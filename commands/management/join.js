const {MessageEmbed} = require("discord.js")
module.exports={
  name: "join",
  category: "management",
  description: "Joins a existing game",
  run: async(bot, message, args) =>{
    //Commands here
    if(message.channel.type === "dm") return message.channel.send(`Cannot run the command in **DM**. Please run the command in a **server**.`)

    let join_code = args[0]
    let game_limit = []

    

    if(!join_code) return message.channel.send(`You **didn't provide** a game code.`)

    message.guild.members.cache.forEach(m =>{
      if(bot.users_on_game.get(m.id) === join_code) game_limit.push(m.id)
    })

    let server_host = bot.games_server.get(join_code)

    if(bot.users_on_game.get(message.author.id) === join_code) return message.channel.send(`Sorry ${message.member}, but you **already** on this game.`)
    if(bot.users_on_game.has(message.author.id)) return message.channel.send(`Sorry ${message.member}, but you **already** on a game.`)
    if(!bot.run_games.has(join_code)) return message.channel.send(`The game what you're trying to join, **couldn't be found**.`)

    if(bot.active_games.has(join_code)) return message.channel.send(`The game what you're trying to join **already started**.`)

    if(game_limit.length >= bot.players_game_limit.get(join_code)) return message.channel.send(`The game what you're trying to join **is full**.`)

    if(message.guild.id !== server_host) return message.channel.send(`Failed to join the game. Make sure you're on the **same server** (Connection: \`${server_host}\`)`)

    

    const msg = await message.channel.send(`Joining... **(This may take a few seconds)**`)

    let ping = Math.floor(msg.createdTimestamp - message.createdTimestamp)

    console.log(ping)

    if(ping >= 400){
      msg.edit(`Failed to join, your net **connection is not stable** (400ms or higher)`)
    }else{
      message.member.send(`You have **joined** into the game ${join_code}**`).catch(() =>{
        message.channel.send(`Looks like ${message.member} doesn't have the **DM open**. To use the bot, you **should have your DM open**.`)
        console.log(`The user ${message.author.username} doesn't have the DM open`)
      })
      bot.users_on_game.set(message.author.id, join_code)
      msg.edit(`You successfully **joined** to the game ${join_code}! (${game_limit.length + 1}/${bot.players_game_limit.get(join_code)})`)
      console.log(`${message.author.username} has joined to the game ${join_code}`)
    }
  }
}