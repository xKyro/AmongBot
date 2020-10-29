const {MessageEmbed} = require("discord.js")
module.exports={
  name: "leave",
  category: "management",
  description: "Leave your actual game",
  run: async(bot, message, args) =>{
    //Commands here
    if(message.channel.type === "dm") return message.channel.send(`Cannot run the command in **DM**. Please run the command in a **server**.`)

    if(!bot.users_on_game.has(message.author.id)) return message.channel.send(`Sorry ${message.member}, **you're not** in a game.`)

    

    let find_game = bot.users_on_game.get(message.author.id)
    let players_ingame = []

    bot.users_on_game.delete(message.author.id)
    if(bot.users_roles.get(message.author.id) === "crewmate") bot.remaining_tasks.set(find_game, bot.remaining_tasks.get(find_game) - bot.users_tasks[message.guild.id].users[message.author.id].rm_task.length)
    
    message.channel.send(`You **successfully** leave your actual game.`)
    console.log(`The user ${message.author.username} has left the game (${find_game})`)

    message.guild.members.cache.forEach(user => {
      if(bot.users_on_game.get(user.id) === find_game)
      players_ingame.push(user.id)
    })
    if(bot.users_roles.get(message.author.id) === "impostor") bot.remaining_impostors.set(find_game, bot.remaining_impostors.get(find_game) - 1)
    if(bot.remaining_impostors.get(find_game) <= 0) bot.victory(players_ingame, "crewmate", "disconnect", bot, bot.games_server.get(find_game))

    if(players_ingame.length <= 0) {

      message.channel.send(`The game has been **deleted**, because all the **players left**.`)
      bot.run_games.delete(find_game)
      bot.games_host.delete(find_game)
      bot.games_server.delete(find_game)
      if(bot.games_sabotages.has(find_game)) bot.games_sabotages.delete(find_game)
      if(bot.active_games.has(find_game)) bot.active_games.delete(find_game)
      bot.games_tasks.delete(find_game)
      bot.enable_sabotages.delete(find_game)
      bot.players_game_limit.delete(find_game)
      bot.kill_cooldown.delete(find_game)
      bot.emergency_duration.delete(find_game)
      bot.emergency_cooldown.delete(find_game)
      console.log(`The game (${find_game}) has been deleted`)

      const log_ch = message.guild.channels.cache.find(ch => ch.name.includes(bot.run_games.get(find_game)))
      if(!log_ch) return

      log_ch.delete()
      
    }else{
      if(bot.games_host.get(find_game) === message.author.id){
        message.channel.send(`The **game host** has left, a new host has been **selected**.`)

        bot.games_host.set(find_game, players_ingame[Math.floor(Math.random() * players_ingame.length)])
      }
    }
  }
}