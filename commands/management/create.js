const {MessageEmbed} = require("discord.js")
module.exports={
  name: "create",
  category: "management",
  description: "Create a new game",
  run: async(bot, message, args) =>{
    //Commands here

    if(message.channel.type === "dm") return message.channel.send(`Cannot run the command in **DM**. Please run the command in a **server**.`)

    if(bot.users_on_game.has(message.author.id)) return message.channel.send(`Sorry ${message.member}, but you **already** on a game.`)

    if(bot.run_games.size >= bot.max_games_host) return message.channel.send(`Game handler is **currently full!** ${bot.run_games.size}/${bot.max_games_host} games are being hosted. **Try again later!**`)


    let gens = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "a", "b", "c", "d", "e", "f", "g", "h"]
    let code = ""

    for(let i = 0; i < 6; i++){
      code = code + gens[Math.floor(Math.random() * gens.length)]
    }

    if(bot.run_games.has(code)) return message.channel.send(`Cannot create the game. Looks like the game code is **already used**.`)

    let can_be_created = true

    message.member.send(`You have **created** the game ${code}. You can see **game configuration** in the \`Help Center : Page #3\`.`).catch(() =>{
      message.channel.send(`Looks like ${message.member} doesn't have the **DM open**. To use the bot, you **should have your DM open**.`)
      can_be_created = false
      console.log(`The user ${message.author.username} doesn't have the DM open`)
    })

    if(can_be_created === false) return

    message.channel.send(`You **successfully** created a new game. Game code is **${code}**.`)
    bot.users_on_game.set(message.author.id, code)
    bot.run_games.set(code, code)
    bot.games_host.set(code, message.author.id)
    bot.games_server.set(code, message.guild.id)
    bot.players_game_limit.set(code, 10)
    bot.kill_cooldown.set(code, 30)
    bot.emergency_duration.set(code, 60)
    bot.emergency_cooldown.set(code, 20)
    bot.game_impostors.set(code, 1)
    
    bot.games_tasks.set(code, 10)
    bot.enable_sabotages.set(code, "enabled")

    console.log(`The user ${message.author.username} created a game (${code}) in the server ${message.guild.name}`)

    /*setTimeout(function(){
      if(bot.active_games.has(code)) return console.log(`The game ${code} is already running. Cannot close it due to inactivity`)
      if(!bot.run_games.has(code)) return console.log(`The game ${code} was closed by the own host or all players left`)

      let players_joined = []
      console.log(`The game (${code}) has been closed due to inactivity`)

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
    }, 60000 * 5)*/
  }
}