const {MessageEmbed} = require("discord.js")
const Discord = require("discord.js")
module.exports = (players, alarm, bc, bot, guild_id) => {

  //players -> Array of members
  //alarm -> Type of alarm
  //bc -> Due to
  
  const guild = bot.guilds.cache.get(guild_id)
  if(!guild || !players || !bot) return

  let find_game = bot.users_on_game.get(players[0])

  players.forEach(p => {

    //if(!bot.users_on_game.has(p)) return

    const member = guild.members.cache.get(p)
    

    const reactor_meltdown = new MessageEmbed()
    .setImage("https://cdn.discordapp.com/attachments/744644559950315650/769642116976476181/Sabotage-Reactor.png")
    .setColor("#ff5d5d")

    const oxygen_depleted = new MessageEmbed()
    .setImage("https://cdn.discordapp.com/attachments/744644559950315650/769642129953652797/Sabotage-O2.png")
    .setColor("#ff5d5d")

    if(alarm === "reactor" && bc === "sabotage"){ 
      member.send(reactor_meltdown)
    }
    if(alarm === "oxygen" && bc === "sabotage"){ 
      member.send(oxygen_depleted)
    }
  })
}