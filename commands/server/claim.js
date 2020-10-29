const {MessageEmbed} = require("discord.js")
module.exports={
  name: "claim",
  category: "server",
  description: "Claim a role reward for the official server",
  run: async(bot, message, args) =>{
    //Commands here

    if(message.channel.type === "dm") return message.channel.send(`Cannot run the command in **DM**. Please run the command in a **server**.`)

    if(message.guild.id !== "757279376671768726") return message.channel.send(`You only can run this command in **the server AmongDiscord**. \`(With this command you can claim roles - Ex: The Crewmate, The Impostor)\``)

    const embed = new MessageEmbed()
    .setAuthor("Claim Roles")
    .setDescription(`You have \`[${bot.userclaims[message.author.id].claims.filter(c => bot.userlevel[message.author.id].lvl >= c.required_lvl && c.claimed === false).length}]\` pending claims!\nReply with the *claim code* that the bot give you.`)
    .addFields(
      {name: "Claims", value: bot.userclaims[message.author.id].claims.map((claim, i) => { return `[ ${message.guild.roles.cache.get(bot.userclaims[message.author.id].claims[i].role_id)} ]\n**Required Level to Claim:** ${bot.userclaims[message.author.id].claims[i].required_lvl}\n**Already Claimed?:** ${bot.userclaims[message.author.id].claims[i].claimed}\n**Claim Code:** ${bot.userclaims[message.author.id].claims[i].claim_code}` }).join("\n\n")}
    )
    .setColor("#ff5d5d")
    .setFooter('Unlock the roles by leveling up!\nType "Cancell" to cancell the role selection')

    message.channel.send(embed)
    bot.claim_menu.set(message.author.id, 0)
  }
}