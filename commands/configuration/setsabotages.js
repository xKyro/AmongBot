const {MessageEmbed} = require("discord.js")
module.exports={
  name: "setsabotages",
  category: "configuration",
  description: "Enable/Disable sabotages for your game",
  run: async(bot, message, args) =>{
    //Commands here

    if(message.channel.type === "dm") return message.channel.send(`Cannot run the command in **DM**. Please run the command in a **server**.`)

    if(!bot.users_on_game.has(message.author.id)) return message.channel.send(`*Sorry ${message.member}, **you're not** in a game.`)

    let find_game = bot.users_on_game.get(message.author.id)

    if(bot.games_host.get(find_game) !== message.author.id) return message.channel.send(`**You're not the host** of this game. Only the **host** can manage this.`)

    let set_as = args[0]
    
    if(!set_as) return message.channel.send(`**Enable / Disable sabotages** for the current game. Use \`us/enablesabotage <enabled / disabled>\``)

    if(set_as !== "enabled" && set_as !== "disabled") return message.channel.send(`**Invalid config** for sabotages. Try using: \`enabled / disabled\`.`)

    bot.enable_sabotages.set(find_game, set_as)

    message.channel.send(`You **${set_as}** the sabotages for the current game.`)
  }
}