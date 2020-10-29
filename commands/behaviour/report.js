const {MessageEmbed} = require("discord.js")
const fs = require("fs")
module.exports={
  name: "report",
  category: "behaviour",
  description: "Report dead bodies",
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

    //Actors
    if(bot.killed_players.has(message.author.id)) return message.channel.send(`**You're dead**. Cannot report dead bodies.`)

    let dead_bodies = []
    guild.members.cache.forEach(p => {
      if(bot.dead_bodies.has(p.id)){
        dead_bodies.push({
          id: p.id,
          name: p.user.username,
          place: bot.dead_bodies.get(p.id)
        })
      }
    })

    let dead_body_reported_id = ""
    let dead_body_reported_place = 0
    let dead_body_reported_crewmate_name = ""

    let a_dead_body_already_was_reported = false

    //Same emergency meeting system, but changed as report

    const log_ch = guild.channels.cache.find(ch => ch.name.includes(bot.run_games.get(find_game)))
    if(!log_ch) return message.channel.send(`Cannot afford the game. The **game channel** does not exist.`)

    dead_bodies.forEach(db =>{
      if(bot.users_move.get(message.author.id) !== db.place) return

      if(a_dead_body_already_was_reported === true) return

      dead_body_reported_id = db.id
      dead_body_reported_place = db.place
      dead_body_reported_crewmate_name = db.name

      a_dead_body_already_was_reported = true
    })

    if(a_dead_body_already_was_reported === false) return message.channel.send(`**No dead bodies around** \`${bot.places[bot.users_move.get(message.author.id)].name}\`. If you have any suspect, call emergency.`)

    let sett = "start"

    let alive_players = []
    let users = []

    const em = new MessageEmbed()
    .setDescription(`${bot.ticks[3]} | The crewmate ${message.author.username} reported a dead body! Discuss.`)
    .setColor("#5da7ff")

    log_ch.send(em)
    
    if(sett === "start"){
      

      guild.members.cache.forEach(m => {
        if(bot.users_on_game.get(m.user.id) === find_game){
          if(bot.killed_players.has(m.user.id)) return
          alive_players.push(m.user.username)
          users.push(m.user.id)
          bot.users_move.set(m.user.id, 0)
          bot.games_votes.set(m.user.id, 0)
          bot.games_votes.set(find_game, 0)
        }
      })

      const embed = new MessageEmbed()
      .setAuthor("Dead body Reported")
      .setDescription(`The crewmate **${message.author.username}** repoted a dead body\nIt's location was on: \`${bot.places[bot.dead_bodies.get(dead_body_reported_id)].name}\`\nDead body of: \`${dead_body_reported_crewmate_name}\`!\nDiscuss!`)
      .addFields(
        {name: "Alive Crewmates", value: `${alive_players.map((cm, i) => { return `\`[#${i+1}]\`- Crewmate: **${cm}**` }).join("\n")}`}
      )
      .setFooter(`Meeting ends in ${bot.emergency_duration.get(find_game)} seconds!\nThink and vote correctly`)
      .setColor("BLURPLE")

      bot.emergencies.set(find_game, find_game)
      

      for(let i = 0; i < users.length; i++){
        const m = guild.members.cache.get(users[i])

        const msg = await m.send(embed)
        setTimeout(function(){
          if(msg.deleted) return
          if(!bot.already_voted.has(m.id)) m.send(`You **didn't vote** for someone or skipped.`)
        }, 1000 * bot.emergency_duration.get(find_game))
        
      }
    }
    let vote_crew = []

    setTimeout(function(){

      bot.emergencies.delete(find_game)
      bot.emergencies_cd.set(find_game, Date.now() + 1000 * bot.emergency_cooldown.get(find_game))

      for(let i = 0; i < alive_players.length; i++){

        vote_crew.push({
          name: alive_players[i],
          t_votes: bot.games_votes.get(users[i])
        })

        bot.already_voted.delete(users[i])
      }

      setTimeout(function(){
        bot.emergencies_cd.delete(find_game)
      }, 1000 * bot.emergency_cooldown.get(find_game))

      bot.already_voted.forEach(u => {
        if(u === find_game) bot.already_voted.delete(u)
      })

      vote_crew.sort((a, b) => b.t_votes - a.t_votes)

      const ejected = guild.members.cache.find(m => m.user.username.includes(vote_crew[0].name))
      let is_ejecting = ""

      is_ejecting = bot.games_votes.get(find_game) < vote_crew[0].t_votes ? `${vote_crew[0].t_votes === vote_crew[1].t_votes ? `Tie`: `${vote_crew[0].name}`}`: `Skip`

      const embed_ = new MessageEmbed()
      .setAuthor("Voting has Ended")
      .setDescription(`The voting has ended. Here are the results`)
      .addFields(
        {name: "Results", value: `${vote_crew.map((user, i) => { return `\`[#${i+1}]\` - Crewmate: **${user.name}** ; Total votes: **${user.t_votes}**` }).join("\n")}\n\nSkip votes: ${bot.games_votes.get(find_game)}`}
      )
      .setFooter(`${is_ejecting === vote_crew[0].name ? `Ejecting: ${is_ejecting}` : `Voting has ended with: ${is_ejecting}`}`)
      .setColor("BLURPLE")

      for(let i = 0; i < users.length; i++){
        const m = guild.members.cache.get(users[i])

        m.send(embed_)
      }

      const non = new MessageEmbed()
      .setDescription(`${bot.ticks[2]} | Voting has been skipped! No one was ejected. ${bot.remaining_impostors.get(find_game)} Impostors remains.`)
      .setColor("#fff85d")

      const tie = new MessageEmbed()
      .setDescription(`${bot.ticks[2]} | Voting has ended with a tie! No one was ejected. ${bot.remaining_impostors.get(find_game)} Impostors remains.`)
      .setColor("#fff85d")

      if(is_ejecting === "Skip") return log_ch.send(non)
      if(is_ejecting === "Tie") return log_ch.send(tie)


      let whos_ejected = bot.users_roles.get(ejected.id)

      const ej = new MessageEmbed()
      .setDescription(`${bot.ticks[2]} | The crewmate ${ejected.user.username} has been ejected and ${bot.users_roles.get(ejected.id) === "crewmate" ? `was not`: 'was'} ${bot.game_impostors.get(find_game) <= 1 ? `The` : `An`} Impostor.`)
      .setColor("#fff85d")

      log_ch.send(ej)

      bot.userdata[ejected.id].times_ejected = bot.userdata[ejected.id].times_ejected + 1
      bot.killed_players.set(ejected.id, 0)
      fs.writeFile("./userdata.json", JSON.stringify(bot.userdata), (err) => { if(err) console.log(err) })
      //bot.users_on_game.delete(ejected.id)
      //bot.games_server.delete(guild.id)
      //bot.run_games.delete(find_game)
      //bot.users_roles.delete(ejected.id)
      //bot.users_move.delete(ejected.id)
      //bot.games_tasks.set(bot.games_tasks.get(find_game) - bot.users_tasks[guild.id].users[ejected.id].rm_task.length)
      //if(bot.games_host.get(ejected.id)) bot.games_host.delete(ejected.id)
      //bot.users_tasks[guild.id].users[ejected.id].rm_task = []
      //if(bot.active_games.has(find_game)) bot.active_games.delete(find_game)
      //bot.userlevel[message.author.id].xp = bot.userlevel[message.author.id].xp + Math.floor(Math.random() * 10)

      bot.dead_bodies.delete(dead_body_reported_id)

      if(whos_ejected === "crewmate"){
        let alives = []
        bot.remaining_crewmates.set(find_game, bot.remaining_crewmates.get(find_game) - 1)

        guild.members.cache.forEach(m => {
          if(bot.users_on_game.get(m.id) == find_game && !bot.killed_players.has(m.id)) alives.push(m.id)
        })
        const ri = new MessageEmbed()
        .setDescription(`${bot.remaining_impostors.get(find_game)} Impostors Remain.`)
        .setColor("#fff85d")

        log_ch.send(ri)

        if(bot.remaining_crewmates.get(find_game) <= bot.remaining_impostors.get(find_game)){
          log_ch.send(bot.gameover)
          bot.victory(users, "impostor", "kill_crew", bot, bot.games_server.get(find_game))

          setTimeout(function(){
            log_ch.delete()
          }, 10000)
        }
      }else{
        let alives = []
        bot.remaining_impostors.set(find_game, bot.remaining_impostors.get(find_game) - 1)

        const ri = new MessageEmbed()
        .setDescription(`${bot.remaining_impostors.get(find_game)} Impostors Remain.`)
        .setColor("#fff85d")

        log_ch.send(ri)
        if(bot.remaining_impostors.get(find_game) >= 1) return
        

        guild.members.cache.forEach(m => {
          if(bot.users_on_game.get(m.id) == find_game) alives.push(m.id)
        })

        if(bot.remaining_crewmates.get(find_game) > 0){
          log_ch.send(bot.gameover)
          bot.victory(users, "crewmate", "discover", bot, bot.games_server.get(find_game))

          setTimeout(function(){
            log_ch.delete()
          }, 10000)
        }
      }
    }, 1000 * bot.emergency_duration.get(find_game))
  }
}