const {MessageEmbed} = require("discord.js")
module.exports={
  name: "leaderboard",
  category: "management",
  description: "Show the leaderboard for the current guild",
  run: async(bot, message, args) =>{
    //Commands here

    if(message.channel.type === "dm") return message.channel.send(`Cannot run the command in **DM**. Please run the command in a **server**.`)

    //if(message.author.id !== "639931530638131214") return message.channel.send(`**${bot.ticks[1]} | This command is on progress. Try again later, sorry for the troubles.**`)

    

    let setting = args[0]

    if(!setting) return message.channel.send(`You **didn't provide** a leaderboard setting. Use: \`global, guild\`.`)
    
    if(setting !== "guild" && setting !== "global") return message.channel.send(`The **provided Leaderboard setting** is not allowed. Use: \`global, guild\`.`)

    const m = await message.channel.send(`Getting all **user data**. Please wait...`)
    let myPos = 0

    if(setting === "guild"){
      const data = []

      message.guild.members.cache.forEach(m => {
        if(bot.userlevel[m.user.id]){

          data.push({
            name: m.user.username,
            xp: bot.userlevel[m.user.id].xp,
            lvl: bot.userlevel[m.user.id].lvl
          })
        }
      })

      data.sort((a, b) => b.xp - a.xp)

      for(let i = 0; i < data.length; i++){
        if(data[i].name === message.author.username) myPos = i + 1
        
      }
    
      const embed = new MessageEmbed()
      .setAuthor("LeaderBoard")
      .setDescription(`Hey!\nIn this message you will see the leaderboard for the guild \`${message.guild.name}\`\n**(Top 10 ranked users in the game.)**\n\n> Current leader: ${data.slice(0, 1).map((user, i) => { return `**${user.name}** with **${user.xp} total xp and is level ${user.lvl}**` }).join(" ")}`)
      .addFields(
        {name: "LeaderBoard", value: `${data.slice(0, 10).map((user, i) => { return `> \`[#${i+1}]\` **${user.name}** · Experience: ${user.xp} | Level: ${user.lvl}` }).join("\n")}\n\n${data.length > 10 ? `And ${data.length - 10} users more...`:` `}`},
        {name: "Your Rank", value: `> You're on top \`[#${myPos}]\`\n> Your stats: **XP: ${data[myPos - 1].xp} | LVL: ${data[myPos - 1].lvl}**`}
      )
      .setColor("BLURPLE")
      .setFooter(`Congrats for the TOP 10`)

      m.edit(embed)
    }
    if(setting === "global"){
      const data = []

      bot.users.cache.forEach(m => {
        if(bot.userlevel[m.id]){

          data.push({
            name: m.username,
            xp: bot.userlevel[m.id].xp,
            lvl: bot.userlevel[m.id].lvl
          })
        }
      })
      

      data.sort((a, b) => b.xp - a.xp)

      for(let i = 0; i < data.length; i++){
        if(data[i].name === message.author.username) myPos = i + 1
        
      }
    
      const embed = new MessageEmbed()
      .setAuthor("LeaderBoard")
      .setDescription(`Hey!\nIn this message you will see the global leaderboard for the game\n\n> Current leader: ${data.slice(0, 1).map((user, i) => { return `**${user.name}** with **${user.xp} total xp and is level ${user.lvl}**` }).join(" ")}`)
      .addFields(
        {name: "LeaderBoard", value: `${data.slice(0, 10).map((user, i) => { return `> \`[#${i+1}]\` **${user.name}** · Experience: ${user.xp} | Level: ${user.lvl}` }).join("\n")}\n\n${data.length > 10 ? `And ${data.length - 10} users more...`:` `}`},
        {name: "Your Rank", value: `> You're on top \`[#${myPos}]\`\n> Your stats: **XP: ${data[myPos - 1].xp} | LVL: ${data[myPos - 1].lvl}**`}
      )
      .setColor("BLURPLE")
      .setFooter(`Congrats for the TOP 10`)

      m.edit(embed)
    }
  }
}