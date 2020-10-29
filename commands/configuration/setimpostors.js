const {MessageEmbed} = require("discord.js")
module.exports={
  name: "setimpostors",
  category: "configuration",
  description: "Set your own number of impostors",
  run: async(bot, message, args) =>{
    //Commands here

    if(message.channel.type === "dm") return message.channel.send(`Cannot run the command in **DM**. Please run the command in a **server**.`)

    if(!bot.users_on_game.has(message.author.id)) return message.channel.send(`*Sorry ${message.member}, **you're not** in a game.`)

    let find_game = bot.users_on_game.get(message.author.id)

    if(bot.games_host.get(find_game) !== message.author.id) return message.channel.send(`**You're not the host** of this game. Only the **host** can manage this.`)

    let impostors = parseInt(args[0])

    if(!impostors) return message.channel.send(`You **didn't provide** an Impostor count.`)
    if(impostors > 3 || impostors < 1) return message.channel.send(`You're off **limits** (1 - 3)`)

    message.channel.send(`You've set **${impostors} Impostors** for the current game.`)
    bot.game_impostors.set(bot.users_on_game.get(message.author.id), impostors)
  }
}