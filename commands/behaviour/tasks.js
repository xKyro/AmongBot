const {MessageEmbed} = require("discord.js")
module.exports={
  name: "tasks",
  category: "behaviour",
  description: "Display your remaining tasks",
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


    if(bot.users_roles.get(message.author.id) === "impostor") return message.channel.send(`You're **${bot.game_impostors.get(find_game) <= 1 ? `The` : `An`} Impostor**. You don't have tasks, **sabotage and kill everyone**.`)

    const embed = new MessageEmbed()
    .setAuthor("Remaining Tasks")
    .setDescription(bot.users_tasks[guild.id].users[message.author.id].rm_task.length <= 0 ? `You don't have remaining tasks to do!\n*Inspect every place for dead bodies or sabotages*` : bot.users_tasks[guild.id].users[message.author.id].rm_task.map((task, i) => { return `\`[#${i+1}]\` - ${task}` }))
    .setColor("BLURPLE")
    .setFooter(`Total Remaining Tasks: ${bot.remaining_tasks.get(find_game)}`)

    message.channel.send(embed)
  }
}