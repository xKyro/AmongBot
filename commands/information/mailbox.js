const {MessageEmbed} = require("discord.js")
module.exports={
  name: "mailbox",
  category: "information",
  description: "Show all new information",
  run: async(bot, message, args) =>{
    //Commands here
    let l = "https://imgur.com/a/a"

    const embed = new MessageEmbed()
    .setAuthor("MailBox")
    .setDescription(`Hey there! Here are the newer information about the Bot's behaviour`)
    .addFields(
      {name: "Announcement", value:`I've reduced the avaible slots for the bot, cuz nobody is using it or no activity is detected, until the games are full and active again there will be 50 slots`},
      {name: `Update List`, value: `\`#1\` :: **Report Dead Bodies**, you can now report dead bodies! Run the command \`us/report\`, only you can use it when you found a dead body\n\`#2\` :: **Custom Impostors**, you can set your own count of Impostors in your game! Can be from 1 to 3 Impostors\n\`#3\` :: **Chat System**, you can chat with your crewmates during a emergency meeting! Reply in bot's DM with \`chat <msg>\`\n\`#4\` :: **Friends**, you can send friend request to users! Also, you can decline or accept an incoming friend request. You can block users too and they will not be able to send you a friend request\n`}
    )
    .setColor("BLURPLE")

    message.channel.send(embed)
  }
}