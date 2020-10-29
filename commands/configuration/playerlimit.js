const {MessageEmbed} = require("discord.js")
module.exports={
  name: "playerlimit",
  category: "configuration",
  description: "Set your own player limit for the game",
  run: async(bot, message, args) =>{
    //Commands here

    if(message.channel.type === "dm") return message.channel.send(`Cannot run the command in **DM**. Please run the command in a **server**.`)

    if(!bot.users_on_game.has(message.author.id)) return message.channel.send(`*Sorry ${message.member}, **you're not** in a game.`)

    let find_game = bot.users_on_game.get(message.author.id)

    if(bot.games_host.get(find_game) !== message.author.id) return message.channel.send(`**You're not the host** of this game. Only the **host** can manage this.`)

    let limit = parseInt(args[0])

    if(!limit) return message.channel.send(`You **didn't provide** a player limit.`)
    if(limit < 4 || limit > 10) return message.channel.send(`You're off **limits** (4 - 10)`)

    bot.players_game_limit.set(find_game, limit)

    message.channel.send(`You've set a limit of **${limit} max players**.`)
  }
}