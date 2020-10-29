const {MessageEmbed} = require("discord.js")
module.exports={
  name: "inspect",
  category: "behaviour",
  description: "Inspect around a place",
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

    let users_active = []
    let users_around = []

    guild.members.cache.forEach(user =>{
      if(bot.users_on_game.get(user.id) === find_game)
      users_active.push(user.id)
    })

    let found_tasks = []
    let found_crews = []
    let found_deads = []
    let dead_bodies = []
    

    for(let i = 0; i < users_active.length; i++){
      if(users_active.length <= 0) return

      if(bot.users_move.get(users_active[i]) === bot.users_move.get(message.author.id)){

        const user = guild.members.cache.get(users_active[i])

        if(user.id !== message.author.id && bot.games_sabotages.get(find_game) !== 4) users_around.push(user.user.username)
      }
    }

    guild.members.cache.forEach(p => {
      if(bot.dead_bodies.has(p.id)){
        dead_bodies.push(p.user.username)
      }
    })

    if(bot.games_sabotages.get(find_game) === 4){
      found_crews.push(`The lights are **sabotaged!** Fix them first to look.`)
    }else{
      found_crews = users_around
    }

    message.channel.send(`You're **inspecting** around ${bot.places[bot.users_move.get(message.author.id)].name}`).then(msg =>{

      
      for(let i = 0; i < bot.users_tasks[guild.id].users[message.author.id].rm_task.length; i++){

        if(bot.users_tasks[guild.id].users[message.author.id].rm_task[i].includes(bot.places[bot.users_move.get(message.author.id)].name)) found_tasks.push(bot.users_tasks[guild.id].users[message.author.id].rm_task[i])
        
      }
      
      if(bot.games_sabotages.has(find_game)) found_deads.push( bot.places[bot.games_sabotages.get(find_game)].critical_sabotage === true ? `${bot.ticks[2]} | Critical sabotage detected at \`${bot.places[bot.games_sabotages.get(find_game)].name}\`. You have 30s to stop it!` : `${bot.ticks[2]} | Sabotage detected at \`${bot.places[bot.games_sabotages.get(find_game)].name}\``)

      /*if(found_tasks.length <= 0) found_tasks.push(`No tasks found in this area.`)
      if(found_crews.length <= 0) found_crews.push(`No crewmates found in this area.`)
      if(found_deads.length <= 0) found_deads.push(`No sabotages detected yet.`)*/


      const embed = new MessageEmbed()
      .setAuthor("Inspect")
      .setDescription(`You inspected around **${bot.places[bot.users_move.get(message.author.id)].name}** and found:`)
      .addFields(
        {name: "Task Found", value: found_tasks.length <= 0 ? `No tasks found around this area.` : found_tasks.map(t => t).join("\n"), inline:false},
        {name: "Crewmates Found", value: found_crews.length <= 0 ? `No crewmates found around this area.` : found_crews.map(t => t).join("\n"), inline:false},
        {name: "Sabotages Found", value: found_deads.length <= 0 ? `No sabotages detected yet.` : found_deads.map(t => t).join("\n"), inline:false},
        {name: "Dead Bodies Found", value: dead_bodies.length <= 0 ? `No dead bodies found.` : dead_bodies.map(t => t).join("\n"), inline:false},
      )
      .setColor("BLURPLE")

      msg.edit(embed)
    })
  }
}