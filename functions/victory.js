const {MessageEmbed} = require("discord.js")
const Discord = require("discord.js")
module.exports = (players, victory, bc, bot, guild_id) => {

  //players -> Array of members
  //victory -> Type of victory
  //bc -> Due to
  
  const guild = bot.guilds.cache.get(guild_id)
  if(!guild || !players || !bot) return

  let find_game = bot.users_on_game.get(players[0])

  console.log(`Victory of ${victory} due to ${bc} (${bot.users_on_game.get(players[0])})`)

  players.forEach(p => {

    //if(!bot.users_on_game.has(p)) return

    const member = guild.members.cache.get(p)

    //Tasks
    const victory_tasks = new MessageEmbed()
    .setImage("https://cdn.discordapp.com/attachments/744644559950315650/769642092879544400/Victory-Tasks.png")
    .setColor("#ff5d5d")

    const defeat_tasks = new MessageEmbed()
    .setImage("https://cdn.discordapp.com/attachments/744644559950315650/768484852520583178/Defeat.png")
    .setColor("#ff5d5d")

    //Crew
    const victory_crew = new MessageEmbed()
    .setImage("https://cdn.discordapp.com/attachments/744644559950315650/769642083002351696/Victory-CrewKill.png")
    .setColor("#ff5d5d")

    const defeat_crew = new MessageEmbed()
    .setImage("https://cdn.discordapp.com/attachments/744644559950315650/769642073678544916/Defeat-CrewKill.png")
    .setColor("#ff5d5d")

    //Sabotage
    const victory_sabotage = new MessageEmbed()
    .setImage("https://cdn.discordapp.com/attachments/744644559950315650/769642085723668480/Victory-Sabotage.png")
    .setColor("#ff5d5d")

    const defeat_sabotage = new MessageEmbed()
    .setImage("https://cdn.discordapp.com/attachments/744644559950315650/769642087473217566/Defeat-Sabotage.png")
    .setColor("#ff5d5d")

    //Ejected
    const victory_ejected = new MessageEmbed()
    .setImage("https://cdn.discordapp.com/attachments/744644559950315650/769642091080450079/Victory-Eject.png")
    .setColor("#ff5d5d")

    const defeat_ejected = new MessageEmbed()
    .setImage("https://cdn.discordapp.com/attachments/744644559950315650/769642089486483477/Defeat-Eject.png")
    .setColor("#ff5d5d")

    //bot.users_on_game.delete(member.id)
    //bot.run_games.delete(find_game)
    bot.users_roles.delete(member.id)
    bot.users_move.delete(member.id)
    bot.killed_players.delete(member.id)
    bot.users_tasks[guild.id].users[member.id].rm_task = []
    if(bot.users_tasks[guild.id].users[member.id].rm_task.length <= 0) console.log(`Cleared tasks of ${member.user.username}`)
    //if(bot.games_host.get(member.id)) bot.games_host.delete(member.id)
    
    //Let's try to keep the game on
    if(victory === "crewmate"){
      if(bc === "done_tasks"){
        if(bot.users_roles.get(p) === "crewmate"){
          member.send(victory_tasks)
        }else{
          member.send(defeat_tasks)
        }
      }
      if(bc === "discover"){
        if(bot.users_roles.get(p) === "crewmate"){
          member.send(victory_ejected)
        }else{
          member.send(defeat_ejected)
        }
      }

      bot.userdata[message.author.id].victory_crewmate = bot.userdata[message.author.id].victory_crewmate + 1
    }
    if(victory === "impostor"){
      if(bc === "kill_crew"){
        if(bot.users_roles.get(p) === "crewmate"){
          member.send(defeat_crew)
        }else{
          member.send(victory_crew)
        }
      }
      if(bc === "sabotage"){
        if(bot.users_roles.get(p) === "crewmate"){
          member.send(defeat_sabotage)
        }else{
          member.send(victory_sabotage)
        }
      }

      bot.userdata[message.author.id].victory_impostor = bot.userdata[message.author.id].victory_impostor + 1
    }
  })
  
  //bot.games_tasks.delete(find_game)
  if(bot.active_games.has(find_game)) bot.active_games.delete(find_game)
  bot.games_sabotages.delete(find_game)
  bot.remaining_tasks.delete(find_game)
  bot.remaining_impostors.delete(find_game)
  bot.remaining_crewmates.delete(find_game)
  //bot.games_server.delete(guild.id)
}