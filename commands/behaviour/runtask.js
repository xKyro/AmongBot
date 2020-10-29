const {MessageEmbed} = require("discord.js")
const fs = require("fs")
module.exports={
  name: "runtask",
  category: "behaviour",
  description: "Run a task",
  run: async(bot, message, args) =>{
    //Commands here

    if(message.channel.type !== "dm") return message.channel.send(`Cannot run this command on a **server**. Please run the command in **DM**`)
    if(!bot.users_on_game.has(message.author.id)) return message.channel.send(`Sorry ${message.author}, **you're not** in a game.`)

    

    
    let find_game = bot.users_on_game.get(message.author.id)
    let server = bot.games_server.get(find_game)

    const guild = bot.guilds.cache.get(server)

    const user_identifier = guild.members.cache.get(message.author.id)

    if(!bot.users_roles.has(message.author.id)) return message.channel.send(`The game doesn't **started** yet! If you are the game **host**, you can start it using \`us/start\``)

    if(!guild) return message.channel.send(`Cannot find the **main guild** for the game host.`)

    //Actors

    if(bot.emergencies.get(find_game)) return message.channel.send(`You're on a **emergency meeting**.`)

    const log_ch = guild.channels.cache.find(ch => ch.name.includes(bot.run_games.get(find_game)))
    if(!log_ch) return message.channel.send(`Cannot afford the game. The **game channel** does not exist.`)

    let run_task = bot.users_move.get(message.author.id)
    

    const embed = new MessageEmbed()
    .setAuthor("Run Task")
    .setDescription(`Displaying all the executable tasks:`)
    .addFields(
      {name: "Tasks", value: `\`us/runtask 0\` - Run a task of cafeteria\n\`us/runtask 1\` - Run a task of admin\n\`us/runtask 2\` - Run a task of medbay\n\`us/runtask 3\` - Run a task of navigation\n\`us/runtask 4\` - Run a task of electrical\n\`us/runtask 5\` - Run a task of engine\n\`us/runtask 6\` - Run a task of storage\n\`us/runtask 7\` - Run a task of comunications\n\`us/runtask 8\` - Run a task of O2`, inline:false}
    )
    .setColor("#ff5d5d")

    
    if(bot.users_move.get(message.author.id) !== run_task) return message.channel.send(`**${bot.ticks[1]} | Cannot do this task. You are not in that place.**`)

    let old_tasks = []
    let new_tasks = []

    let done_task = 0

    bot.users_tasks[guild.id].users[message.author.id].rm_task.forEach(task =>{
      if(!task.includes(bot.places[bot.users_move.get(message.author.id)].name)) new_tasks.push(task)
      if(task.includes(bot.places[bot.users_move.get(message.author.id)].name)) done_task = done_task + 1
    })
    console.log(new_tasks)

    if(done_task === 0) return message.channel.send(`You **don't have** pending task in this area (\`${bot.places[bot.users_move.get(message.author.id)].name}\`)`)

    
    bot.remaining_tasks.set(find_game, bot.remaining_tasks.get(find_game) - done_task)

    bot.users_tasks[guild.id].users[message.author.id].rm_task = new_tasks
    bot.userdata[message.author.id].tasks_completed = bot.userdata[message.author.id].tasks_completed + done_task

    const embed_ = new MessageEmbed()
    .setDescription(`${bot.ticks[0]} | The crewmate ${message.author.username} completed ${done_task} task(s) in ${bot.places[run_task].name}.`)
    .setColor("#5dff69")

    let users_actives_ = []

    log_ch.send(embed_)
    message.channel.send(`You completed \`${done_task}\` task(s) in \`${bot.places[run_task].name}\`.\n**Task remaining:** ${bot.users_tasks[guild.id].users[message.author.id].rm_task.length} :: **All Task Remaining:** ${bot.remaining_tasks.get(find_game)}`)


    if(bot.users_tasks[guild.id].users[message.author.id].rm_task.length <= 0) {
      bot.userdata[message.author.id].all_tasks_completed = bot.userdata[message.author.id].all_tasks_completed + 1
    }
    

    fs.writeFile("./userdata.json", JSON.stringify(bot.userdata), (err) => { if(err) console.log(err) })

    guild.members.cache.forEach(user =>{
      if(bot.users_on_game.get(user.id) === find_game) users_actives_.push(user.id)
    })

    if(bot.remaining_tasks.get(find_game) < 1){
      log_ch.send(bot.gameover)
      bot.victory(users_actives_, "crewmate", "done_tasks", bot, bot.games_server.get(find_game))

      for(let i = 0; i < users_actives_.length; i++){
        
        bot.userlevel[users_actives_[i]].xp = bot.userlevel[users_actives_[i]].xp + Math.floor(Math.random() * 10)
        if(bot.users_roles.get(users_actives_[i]) === "crewmate") bot.userdata[users_actives_[i]].victory_crewmate = bot.userdata[users_actives_[i]].victory_crewmate + 1
        fs.writeFile("./userdata.json", JSON.stringify(bot.userdata), (err) => { if(err) console.log(err) })
        
        
      }
      setTimeout(function(){
        log_ch.delete()
      }, 10000)
    }
    
  }
}