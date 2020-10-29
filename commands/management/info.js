const {MessageEmbed} = require("discord.js")
module.exports={
  name: "info",
  category: "management",
  description: "Display all game stats and users on the game",
  run: async(bot, message, args) =>{
    //Commands here
    if(message.channel.type === "dm") return message.channel.send(`Cannot run the command in **DM**. Please run the command in a **server**.`)

    if(!bot.users_on_game.has(message.author.id)) return message.channel.send(`Sorry ${message.member}, **you're not** in a game.`)

    let find_game = bot.users_on_game.get(message.author.id)

    let players_ingame = []
    let actual_host = ""

    message.guild.members.cache.forEach(user => {
      if(bot.users_on_game.get(user.id) === find_game)
      players_ingame.push(user.id)
    })
    message.guild.members.cache.forEach(user => {
      if(bot.games_host.get(find_game) === user.id)
      actual_host = user.user.username
    })

    const embed = new MessageEmbed()
    .setAuthor("Game Information")
    .setThumbnail(bot.user.displayAvatarURL())
    .setDescription(`Here will appear all the game stats!\nGame code: ${bot.users_on_game.get(message.author.id)}\n\n**GENERAL INFO**\n> Host: \`${actual_host}\`\n> Impostors: \`${bot.game_impostors.get(find_game)}\`\n> Players: \`${players_ingame.length}/${bot.players_game_limit.get(find_game)} (To start: ${bot.game_impostors.get(find_game) === 1 ? `4 players` : `${bot.game_impostors.get(find_game) === 2 ? `7 players` : `9 players`}`})\`\n> Complete Task: \`${(players_ingame.length * bot.games_tasks.get(find_game)) - bot.games_tasks.get(find_game)}\`\n\n**CUSTOM SETTINGS**\n> Tasks: \`${bot.games_tasks.get(find_game)}\`\n> Sabotages: \`${bot.enable_sabotages.get(find_game)}\`\n> Kill Cooldown: \`${bot.kill_cooldown.get(find_game)}s\`\n> Emergency Cooldown: \`${bot.emergency_cooldown.get(find_game)}s\`\n> Emergency Duration: \`${bot.emergency_duration.get(find_game)}s\``)
    .setColor("BLURPLE")
    .setFooter(`Connection: ${message.guild.id}`)

    message.channel.send(embed)
  }
}