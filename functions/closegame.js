const {MessageEmbed} = require("discord.js")
const Discord = require("discord.js")
module.exports = (players, victory, bc, bot, guild_id) => {

  setTimeout(function(){
    if(bot.active_games.has(code)) return console.log(`The game ${code} is already running. Cannot close it due to inactivity`)
    if(!bot.run_games.has(code)) return console.log(`The game ${code} was closed by the own host or all players left`)

    let players_joined = []

    message.guild.members.cache.forEach(m => {
      if(bot.users_on_game.get(m.id) === code){
        players_joined.push(m.id)
      }
    })

    for(let i = 0; i < players_joined.length; i++){
      bot.users_roles.delete(players_joined[i])
      bot.users_on_game.delete(players_joined[i])
    }
  
    bot.run_games.delete(code)
    bot.games_host.delete(code)
    bot.games_server.delete(code)
    if(bot.games_sabotages.has(code)) bot.games_sabotages.delete(code)
    if(bot.active_games.has(code)) bot.active_games.delete(code)
    bot.games_tasks.delete(code)
    bot.enable_sabotages.delete(code)
    bot.players_game_limit.delete(code)
    bot.kill_cooldown.delete(code)
    bot.emergency_duration.delete(code)
    bot.emergency_cooldown.delete(code)

    message.channel.send(`**${bot.ticks[1]} | The game has been closed due to inactivity.**`)
  }, 60000 * 5)
}