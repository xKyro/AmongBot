const {MessageEmbed} = require("discord.js")
module.exports={
  name: "search",
  category: "management",
  description: "Search for active games",
  run: async(bot, message, args) =>{
    //Commands here

    if(message.channel.type === "dm") return message.channel.send(`Cannot run the command in **DM**. Please run the command in a **server**.`)

    let games_queue = []
    let games_host_queue = []
    let games_player_count_queue = []
    let games_status_queue = []

    let user_id_identifier = []
    let display_info = []

    
    bot.run_games.forEach(g =>{
      if(message.guild.id === bot.games_server.get(g)){
        games_queue.push(g)
      }
    })

    bot.users.cache.forEach(u => {
      if(bot.users_on_game.has(u.id)){
        games_player_count_queue.push({
          user_id: u.id,
          game: bot.users_on_game.get(u.id)
        })
      }
    })

    games_queue.forEach(g => {
      if(bot.games_host.get(g)){
        const host = bot.users.cache.get(bot.games_host.get(g))
        games_host_queue.push(host.username)
      }
      
    })
    games_queue.forEach(g => {
      if(bot.users_on_game.get(g)){
        const host = bot.users.cache.get(bot.games_host.get(g))
        games_host_queue.push(host.username)
      }
    })
    

    for(let i = 0; i < games_queue.length; i++){
      display_info.push(`Game Code: \`${games_queue[i]}\`\nGame Host: \`${games_host_queue[i]}\`\nPlayers: \`${games_player_count_queue.filter(u => u.game === games_queue[i]).length}/${bot.players_game_limit.get(games_queue[i])}\`\nStatus: \`${bot.active_games.has(games_queue[i]) ? `In Game`: `Waiting For Players`}\``)
    }
    const preEmbed = new MessageEmbed()
    .setAuthor("Searching Games")
    .setThumbnail(bot.user.displayAvatarURL())
    .setDescription(`We're searching for games inside this server...`)
    .setColor("BLURPLE")

    const embed = new MessageEmbed()
    .setAuthor("Search Games")
    .setThumbnail(bot.user.displayAvatarURL())
    .setDescription(`Displaying all the games that were found in the guild \`${message.guild.name}\`\n\n> **IG:** In Game\n> **WFP:** Waiting for Players`)
    .addFields(
      {name: "Games", value: `${games_queue.length === 0 ? `We searched for games\nUnfortunately, we couldn't find any active games on this guild. Try again later` : `${display_info.slice(0, 15).map((game, i) => { return `\`[#${i+1}]\`\n${display_info[i]}` }).join("\n")}`}`}
    )
    .setColor("BLURPLE")

    const m = await message.channel.send(preEmbed)

    setTimeout(function(){
      m.edit(embed)
    }, 3000)
  }
}