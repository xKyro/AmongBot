const {MessageEmbed} = require("discord.js")
const fs = require("fs")
module.exports={
  name: "sabotage",
  category: "behaviour",
  description: "Sabotage a system",
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

    if(bot.emergencies.get(find_game)) return message.channel.send(`You're on a **emergency meeting**.`)

    if(bot.enable_sabotages.get(find_game) === "disabled") return message.channel.send(`Sorry, but the **sabotages are not enabled** for this game.`)

    let sabotage_index = args[0]

    if(sabotage_index !== "0") sabotage_index = parseInt(sabotage_index)

    const embed = new MessageEmbed()
    .setAuthor("Sabotage")
    .setDescription(`Displaying all the avaible sabotages`)
    .addFields(
      {name: "Sabotages", value: `${bot.places.map((place, i) => { return `\`[${i}]\` - Sabotage ${place.name}${place.critical_sabotage === true ? `; This __is__ a **Critical Sabotage**` : `; This __is not__ a **Critical Sabotage**`}` }).join(`\n`)}`, inline:false}
    )
    .setColor("BLURPLE")

    if(!sabotage_index) return message.channel.send(embed)

    if(bot.places[sabotage_index].can_be_sabotaged === false) return message.channel.send(`You're **not allowed** to sabotage ${bot.places[sabotage_index].name}`)

    if(sabotage_index > bot.places.length) return message.channel.send(`That sabotage **does not exist**. Run \`us/sabotage\` to display all sabotages.`)

    if(bot.games_sabotages.has(find_game)) return message.channel.send(`You **already sabotaged** a system! Wait until the sabotage get fixed`)

    const log_ch = guild.channels.cache.find(ch => ch.name.includes(bot.run_games.get(find_game)))
    if(!log_ch) return message.channel.send(`Cannot afford the game. The **game channel** does not exist.`)

    const embed_ = new MessageEmbed()
    .setDescription(`${bot.ticks[2]} | ${bot.game_impostors.get(find_game) <= 1 ? `The`: `An`} Impostor sabotaged the \`${bot.places[sabotage_index].name}\` systems!`)
    .setColor("#fff85d")

    log_ch.send(embed_)

    message.channel.send(`You **sabotaged** \`${bot.places[sabotage_index].name}\``)

    bot.games_sabotages.set(find_game, sabotage_index)

    bot.userdata[message.author.id].sabotages = bot.userdata[message.author.id].sabotages + 1

    fs.writeFile("./userdata.json", JSON.stringify(bot.userdata), (err) => { if(err) console.log(err) })

    let users_actives = []
    guild.members.cache.forEach(user =>{
      if(bot.users_on_game.get(user.id) === find_game){
        users_actives.push(user.id)
      }
    })
    let sabotaged = sabotage_index

    if(bot.places[sabotage_index].name === "Reactor") bot.alarm(users_actives, "reactor", "sabotage", bot, bot.games_server.get(find_game))
    if(bot.places[sabotage_index].name === "O2") bot.alarm(users_actives, "oxygen", "sabotage", bot, bot.games_server.get(find_game))

    if(bot.places[sabotage_index].critical_sabotage === true){
      setTimeout(function(){
        if(!bot.games_sabotages.has(find_game) || bot.games_sabotages.get(find_game) !== sabotaged) return
        log_ch.send(bot.gameover)
        bot.victory(users_actives, "impostor", "sabotage", bot, bot.games_server.get(find_game))

        setTimeout(function(){
          log_ch.delete()
        }, 10000)
      }, 1000 * 30)
    }
  }
}