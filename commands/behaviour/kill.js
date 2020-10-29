const {MessageEmbed} = require("discord.js")
const fs = require("fs")
const Duration = require("humanize-duration")
module.exports={
  name: "kill",
  category: "behaviour",
  description: "Kill a crewmate",
  run: async(bot, message, args) =>{
    //Commands here

    if(message.channel.type !== "dm") return message.channel.send(`Cannot run this command on a **server**. Please run the command in **DM**`)
    if(!bot.users_on_game.has(message.author.id)) return message.channel.send(`Sorry ${message.author}, **you're not** in a game.`)

    

    
    let find_game = bot.users_on_game.get(message.author.id)
    let server = bot.games_server.get(find_game)

    const guild = bot.guilds.cache.get(server)

    const user_identifier = guild.members.cache.get(message.author.id)

    if(!bot.users_roles.has(message.author.id)) return message.channel.send(`The game doesn't **started** yet! If you are the game **host**, you can start it using \`us/start\``)

    if(!guild) return message.channel.send(`Cannot find the **main guild** for the game host.`)

    if(bot.users_roles.get(message.author.id) === "crewmate") return message.channel.send(`You are a **crewmate!** You **cannot** run impostor's commands.`)

    //Actors
    if(bot.killed_players.has(message.author.id)) return message.channel.send(`**You're dead**. Cannot kill players.`)

    let cd = bot.games_kill_cd.get(message.author.id)
    if(cd){
      const remaining = Duration(cd - Date.now(), {units: ['h', 'm', 's'], round: true, largest:false})
      return message.channel.send(`You should wait **${remaining}**, before killing another crewmate.`)
    }

    if(bot.emergencies.get(find_game)) return message.channel.send(`You're on a **emergency meeting**.`)

    let users_active = []
    let users_around = []

    guild.members.cache.forEach(user =>{
      if(bot.users_on_game.get(user.id) === find_game)
      users_active.push(user.id)
    })

    for(let i = 0; i < users_active.length; i++){
      if(users_active.length <= 0) return
      if(bot.killed_players.has(users_active[i])) return

      if(bot.users_move.get(users_active[i]) === bot.users_move.get(message.author.id)){

        const user = guild.members.cache.get(users_active[i])

        if(user.id !== message.author.id && bot.users_roles.get(user.id) !== "impostor") users_around.push(user.id)
      }
    }

    const log_ch = guild.channels.cache.find(ch => ch.name.includes(bot.run_games.get(find_game)))
    if(!log_ch) return message.channel.send(`Cannot afford the game. The **game channel** does not exist.`)

    if(users_around.length <= 0) return message.channel.send(`There are **no crewmates** around this area. Search in another area!`)

    

    const find_crew = guild.members.cache.get(users_around[Math.floor(Math.random() * users_around.length)])

    if(!find_crew) return console.log(`No crewmate found`)
    if(bot.users_roles.get(find_crew.id) === "impostor") return message.channel.send(`You **cannot** kill another Impostor.`)
    

    const embed = new MessageEmbed()
    .setDescription(`${bot.ticks[1]} | The crewmate ${find_crew.user.username} was killed by ${bot.game_impostors.get(find_game) <= 1 ? `The`: `An`} Impostor.`)
    .setColor("#ff5d5d")

    bot.killed_players.set(find_crew.id, 0)
    bot.dead_bodies.set(find_crew.id, bot.users_move.get(find_crew.id))
    

    log_ch.send(embed)

    message.channel.send(`You **killed** the crewmate **${find_crew.user.username}**!`)

    bot.userdata[message.author.id].kills = bot.userdata[message.author.id].kills + 1

    find_crew.send(`You **were killed** by ${bot.game_impostors.get(find_game) <= 1 ? `The`: `An`} Impostor. You can **still** do your tasks to win!`)

    bot.userdata[find_crew.id].times_killed = bot.userdata[find_crew.id].times_killed + 1

    fs.writeFile("./userdata.json", JSON.stringify(bot.userdata), (err) => { if(err) console.log(err) })

    
    bot.remaining_crewmates.set(find_game, bot.remaining_crewmates.get(find_game) - 1)
    console.log(`Remaining crewmates: ${bot.remaining_crewmates.get(find_game)} in (${find_game})`)

    let users_actives = []
    let users_actives_ = []

    guild.members.cache.forEach(user =>{
      if(bot.users_on_game.get(user.id) === find_game){
        users_actives.push(user.user.username)
        users_actives_.push(user.id)
      }
    })

    bot.games_kill_cd.set(message.author.id, Date.now() + 1000 * bot.kill_cooldown.get(find_game))
    setTimeout(function(){ 
      bot.games_kill_cd.delete(message.author.id)
    }, 1000 * bot.kill_cooldown.get(find_game))


    if(bot.remaining_crewmates.get(find_game) <= bot.remaining_impostors.get(find_game)){
      log_ch.send(bot.gameover)
      bot.victory(users_actives_, "impostor", "kill_crew", bot, bot.games_server.get(find_game))

      setTimeout(function(){
        log_ch.delete()
      }, 10000)
    }
  }
}

