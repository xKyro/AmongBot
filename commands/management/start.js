const {MessageEmbed} = require("discord.js")
const impostor_chance = []
module.exports={
  name: "start",
  category: "management",
  description: "Run your actual game, only if you're the host",
  run: async(bot, message, args) =>{
    //Commands here
    if(message.channel.type === "dm") return message.channel.send(`Cannot run the command in **DM**. Please run the command in a **server**.`)

    if(!bot.users_on_game.has(message.author.id)) return message.channel.send(`Sorry ${message.member}, **you're not** in a game.`)

    let find_game = bot.users_on_game.get(message.author.id)

    if(bot.games_host.get(find_game) !== message.author.id) return message.channel.send(`**You're not the host** of this game. Only the **host** can start it.`)

    if(bot.active_games.has(find_game)) return message.channel.send(`You **already started** the game.`)

    let players_ingame = []

    message.guild.members.cache.forEach(user => {
      if(bot.users_on_game.get(user.id) === find_game) players_ingame.push(user.id)
    })

    let required = bot.game_impostors.get(find_game) === 1 ? bot.players_to_start : bot.game_impostors.get(find_game) === 2 ? 7 : 9

    if(players_ingame.length < required) return message.channel.send(`**Cannot start** the game without ${required} players. Waiting for more players (${required - players_ingame.length} players needed)`)

    const msg_ = await message.channel.send(`The game will start soon. (5 seconds)\nTo keep the game **private**, all the users must have the DM open.`)
    

    const set_category = message.guild.channels.cache.filter(c => c.type == "category").find(c => c.name.includes("AmongDiscord"))

    const start_embed = new MessageEmbed()
    .setTitle("SHHHH!")
    .setImage("https://s.keepmeme.com/files/en_posts/20200922/among-us-red-impostor-shh-keep-silent-meme-17590572a8d818357fe654319b755762.jpg")
    .setFooter(`There ${bot.game_impostors.get(find_game) <= 1 ? `is ${bot.game_impostors.get(find_game)} impostor` : `are ${bot.game_impostors.get(find_game)} impostors`} among us`)
    .setColor("BLURPLE")

    let users_failed = []
    bot.remaining_crewmates.set(find_game, 0)

    players_ingame.forEach(async p => {
      const user = message.guild.members.cache.get(p)
      

      const msg_ = await user.send(start_embed).catch(err =>{
        console.log(err)
      })
      setTimeout(function(){
        if(msg_) msg_.delete()
      }, 1000 * 5)
    })
      
    

    setTimeout(function(){

      players_ingame = []

      message.guild.members.cache.forEach(user => {
        if(bot.users_on_game.get(user.id) === find_game) players_ingame.push(user.id)
        
      })
      

      if(players_ingame.length < required) return message.channel.send(`**Cannot start** the game without ${required} players. Waiting for more players (${required - players_ingame.length} players needed)`)

      const impostor_role = message.guild.roles.cache.find(role => role.name.includes("Impostor"))
      const crewmate_role = message.guild.roles.cache.find(role => role.name.includes("Crewmate"))

      /*if(!impostor_role || !crewmate_role) return message.channel.send(`**<:tick_warn:744041955696050198> | Cannot start the game, missing roles.**\n\n**<:tick_info:744051426744860693> | Create a role named "Crewmate"**\n**<:tick_info:744051426744860693> | Create a role named "Impostor"**`)*/

      msg_.edit(`> Game has started!\n> Current map: The Skeld`)
      

      players_ingame.forEach(p => {
        impostor_chance.push({
          id: p,
          chance: Math.floor(Math.random() * 100)
        })

      })


      impostor_chance.sort((a, b) => b.chance - a.chance)

      let impostors = []
      for(let i = 0; i < bot.game_impostors.get(find_game); i++){
        impostors.push(impostor_chance[i].id)
        bot.users_roles.set(impostor_chance[i].id, "impostor")
      }

      const crew_embed = new MessageEmbed()
      .setImage("https://cdn.discordapp.com/attachments/744644559950315650/769642095937191946/CrewmateR.png")
      .setColor("BLURPLE")

      const impo_embed = new MessageEmbed()
      .setImage("https://cdn.discordapp.com/attachments/744644559950315650/769642097472831538/ImpostorR.png")
      .setColor("BLURPLE")

      if(!bot.users_tasks[message.guild.id]){
        bot.users_tasks[message.guild.id] = {
          "users": { }
        }
      }

      bot.active_games.set(find_game, "ingame")

      message.guild.channels.create("game_" + bot.run_games.get(find_game), {
        type: "text",
        parent: set_category.id,
        permissionOverwrites: [{
            deny: "SEND_MESSAGES",
            id: message.guild.id
        }]
      })
      
      bot.remaining_crewmates.set(find_game, players_ingame.length - bot.game_impostors.get(find_game))
      bot.remaining_impostors.set(find_game, bot.game_impostors.get(find_game))
      console.log(`Remaining crewmates: ${bot.remaining_crewmates.get(find_game)} in (${find_game})`)

      players_ingame.forEach(player =>{

        bot.users_move.set(player, 0)

        if(!impostors.includes(player)){
          const user = message.guild.members.cache.get(player)
          user.send(crew_embed)
          bot.users_roles.set(user.id, "crewmate")
          

          if(!bot.users_tasks[message.guild.id].users[user.id]){
            bot.users_tasks[message.guild.id].users[user.id] = {
              "rm_task": []
            }
          }

          //let places = ["Cafeteria", "Admin", "MedBay", "Navigation", "Electrical", "Engine", "Storage", "Comunications", "O2"]

          for(let i_ = 0; i_ < bot.games_tasks.get(find_game); i_++){
            let selected = Math.floor(Math.random() * bot.places.length)
            
            bot.users_tasks[message.guild.id].users[user.id].rm_task.push(`${bot.places[selected].name}: ${bot.places[selected].list_tasks[Math.floor(Math.random() * bot.places[selected].list_tasks.length)]}`)
          }
        }else{
          const user = message.guild.members.cache.get(player)
          user.send(impo_embed)
          bot.users_roles.set(user.id, "impostor")
          

          if(!bot.users_tasks[message.guild.id].users[user.id]){
            bot.users_tasks[message.guild.id].users[user.id] = {
              "rm_task": []
            }
          }
        }
      })
      players_ingame.forEach(p =>{
        console.log(`${p} is a ${bot.users_roles.get(p)}`)
      })

      bot.remaining_tasks.set(find_game, (players_ingame.length * bot.games_tasks.get(find_game)) - (bot.games_tasks.get(find_game) * bot.game_impostors.get(find_game)))
      console.log(`Game (${find_game})\nImpostors: ${bot.game_impostors.get(find_game)}\nTasks: ${(players_ingame.length * bot.games_tasks.get(find_game)) - (bot.games_tasks.get(find_game) * bot.game_impostors.get(find_game))}\nPlayers: ${players_ingame.length}`)
      

    }, 1000 * 5)
  }
}
