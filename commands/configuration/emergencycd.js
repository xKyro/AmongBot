const {MessageEmbed} = require("discord.js")
module.exports={
  name: "emergencycd",
  category: "configuration",
  description: "Set your own emergency cooldown",
  run: async(bot, message, args) =>{
    //Commands here

    if(message.channel.type === "dm") return message.channel.send(`Cannot run the command in **DM**. Please run the command in a **server**.`)

    if(!bot.users_on_game.has(message.author.id)) return message.channel.send(`*Sorry ${message.member}, **you're not** in a game.`)

    let find_game = bot.users_on_game.get(message.author.id)

    if(bot.games_host.get(find_game) !== message.author.id) return message.channel.send(`**You're not the host** of this game. Only the **host** can manage this.`)

    let cooldown = parseInt(args[0])

    if(!cooldown) return message.channel.send(`You **didn't provide** a emergency cooldown.`)
    if(cooldown < 10 || cooldown > 60) return message.channel.send(`You're off **limits** (10 - 60)`)

    bot.emergency_cooldown.set(find_game, cooldown)

    message.channel.send(`You've set a **${cooldown}s** of emergency cooldown.`)
  }
}