const {MessageEmbed} = require("discord.js")
module.exports={
  name: "stats",
  category: "information",
  description: "Display all bot information",
  run: async(bot, message, args) =>{
    //Commands here

    let registered_users_level = []
    let registered_users_card = []

    let players = []

    bot.users.cache.forEach(m => {
      if(bot.userlevel[m.id]) registered_users_level.push(m.id)

      if(bot.users_on_game.has(m.id)){
        players.push({
          player_id: m.id,
          player_role: bot.users_roles.has(m.id) ? bot.users_roles.get(m.id) : `No role Yet`
        })
      }
    })
    

    const msg = await message.channel.send(`Getting all **bot stats**...`)


    const embed = new MessageEmbed()
    .setAuthor("Bot Statistics")
    .setDescription(`Hey there!\nHow's going? Well, anyways\nYou can see all my statistics in this message! \n\nLantency: **${Math.floor(msg.createdTimestamp - message.createdTimestamp)}ms**\nAPI Latency: **${Math.round(bot.ws.ping)}ms**\n`)
    .addFields(
      {name: "Statistics", value: `**Users:**\nThere are **${bot.users.cache.size} users**\n\n**Guilds:**\nThere are **${bot.guilds.cache.size} guilds** ( Total Guilds )\nThere are **${bot.guilds.cache.filter(guild => guild.channels.cache.find(ch => ch.type === "category" && ch.name.includes("AmongDiscord"))).size} guilds** with a game host ( AmongDiscord category )\n\n**Players:**\nThere are **${bot.users_on_game.size} players** in Games\nThere are **${players.filter(player => player.player_role === "crewmate").length} players** that are **Crewmates**\nThere are **${players.filter(player => player.player_role === "impostor").length} players** that are **Impostors**\nThere are **${players.filter(player => player.player_role === "No role Yet").length} players** that are **not Crewmates or Impostors**\n\n**Games:**\nThere are **${bot.run_games.size} games** created\nThere are **${bot.active_games.size} running games**\n\n**Hosts:**\nThere are **${bot.channels.cache.filter(ch => ch.type === "category" && ch.name.includes("AmongDiscord")).size}/${bot.channels.cache.filter(ch => ch.type === "category" && ch.name.includes("AmongBot")).size} game hosts** ( New/Old ) ( Categories )`, inline:true},
    )
    .setColor("BLURPLE")
    msg.edit(embed)
  }
}