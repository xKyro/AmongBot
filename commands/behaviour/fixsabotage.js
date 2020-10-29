const {MessageEmbed} = require("discord.js")
const fs = require("fs")
module.exports={
  name: "fixsabotage",
  category: "behaviour",
  description: "Repair a sabotage made by the impostor",
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

    if(bot.killed_players.has(message.author.id)) return message.channel.send(`**You're dead**. Cannot fix sabotages.`)

    if(bot.emergencies.get(find_game)) return message.channel.send(`You're on a **emergency meeting**.`)

    if(!bot.games_sabotages.has(find_game)) return message.channel.send(`There are **no sabotages** to fix.`)

    const log_ch = guild.channels.cache.find(ch => ch.name.includes(bot.run_games.get(find_game)))
    if(!log_ch) return message.channel.send(`Cannot afford the game. The **game channel** does not exist.`)

    if(bot.users_move.get(message.author.id) !== bot.games_sabotages.get(find_game)) return message.channel.send(`This place **is not sabotaged** yet.`)

    const embed = new MessageEmbed()
    .setDescription(`${bot.ticks[0]} | The crewmate \`${message.author.username}\` fixed the sabotage of \`${bot.places[bot.games_sabotages.get(find_game)].name}\`.`)
    .setColor("#5dff69")

    log_ch.send(embed)

    message.channel.send(`You **fixed** the sabotage of \`${bot.places[bot.games_sabotages.get(find_game)].name}\``)

    bot.games_sabotages.delete(find_game)
    bot.userdata[message.author.id].sabotaged_fixed = bot.userdata[message.author.id].sabotaged_fixed + 1

    fs.writeFile("./userdata.json", JSON.stringify(bot.userdata), (err) => { if(err) console.log(err) })

    
  }
}