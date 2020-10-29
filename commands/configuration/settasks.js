const {MessageEmbed} = require("discord.js")
module.exports={
  name: "settasks",
  category: "configuration",
  description: "Set the task amount",
  run: async(bot, message, args) =>{
    //Commands here

    if(message.channel.type === "dm") return message.channel.send(`Cannot run the command in **DM**. Please run the command in a **server**.`)

    if(!bot.users_on_game.has(message.author.id)) return message.channel.send(`*Sorry ${message.member}, **you're not** in a game.`)

    let find_game = bot.users_on_game.get(message.author.id)

    if(bot.games_host.get(find_game) !== message.author.id) return message.channel.send(`**You're not the host** of this game. Only the **host** can manage this.`)

    let new_tasks = parseInt(args[0])

    if(!new_tasks) return message.channel.send(`You **didn't provide** the task count.`)

    if(new_tasks < 1 || new_tasks > 10) return message.channel.send(`You're off **limits** (1 - 10)`)

    if(bot.games_tasks.has(find_game)) bot.games_tasks.set(find_game, new_tasks)

    message.channel.send(`You set **${new_tasks} tasks** for every crewmate in the game.`)
  }
}