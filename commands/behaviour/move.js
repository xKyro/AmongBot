const {MessageEmbed} = require("discord.js")
module.exports={
  name: "move",
  category: "behaviour",
  description: "Move around the map",
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

    if(bot.emergencies.get(find_game)) return message.channel.send(`You're on a **emergency meeting**.`)

    let newMove = args[0]
    if(newMove !== "0") newMove = parseInt(newMove)
    
    

    const embed = new MessageEmbed()
    .setAuthor("Move")
    .setDescription(`Displaying all the places, what you can explore/go to complete your tasks`)
    .addFields(
      {name: "Moves", value: `${bot.places.map((place, i) => { return `\`[${i}]\` - Move towards to ${place.name}` }).join("\n")}`, inline:false}
    )
    .setColor("BLURPLE")

    if(!newMove) return message.channel.send(embed)

    if(newMove > bot.places.length) return message.channel.send(`That place **does not exist**. Run \`us/move\` to display all avaible moves.`)
    
    const log_ch = guild.channels.cache.find(ch => ch.name.includes(bot.run_games.get(find_game)))
    if(!log_ch) return message.channel.send(`Cannot afford the game. The **game channel** does not exist.`)

    message.channel.send(`> You just moved to \`${bot.places[newMove].name}\`.`)

    const embed_ = new MessageEmbed()
    .setDescription(`${bot.ticks[3]} | The crewmate ${message.author.username} just moved towards to ${bot.places[newMove].name}.`)
    .setColor("#5da7ff")

    log_ch.send(embed_)

    bot.users_move.set(message.author.id, newMove === "0" ? newMove = 0 : newMove)
  }
}