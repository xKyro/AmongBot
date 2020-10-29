//https://discord.com/oauth2/authorize?client_id=744614311938490428&scope=bot&permissions=2146958847
const {MessageEmbed} = require("discord.js")
const fs = require("fs")
module.exports={
  name: "invite",
  category: "information",
  description: "Invite link for the bot",
  run: async(bot, message, args) =>{
    //Commands here

    const embed = new MessageEmbed()
    .setAuthor("Bot Invite")
    .setDescription(`Hello there!\nThis is our bot Invite Link. You can invite him if you enjoy the bot services!`)
    .addFields(
      {name: "Link", value: `**[Click here to go to Invite link](https://discord.com/oauth2/authorize?client_id=744614311938490428&scope=bot&permissions=2146958847)**`}
    )
    .setImage(bot.user.displayAvatarURL({size:2048, dynamic: true}))
    .setColor("BLURPLE")

    const m = await message.channel.send(embed)

    
  }
}