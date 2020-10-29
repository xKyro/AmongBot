const {MessageEmbed} = require("discord.js")
module.exports={
  name: "help",
  category: "information",
  description: "Display all useful commands",
  run: async(bot, message, args) =>{
    //Commands here

    let page = 0
    
    const cross = bot.emojis.cache.find(e => e.name.includes("cross"))
    

    const embed = new MessageEmbed()
    .setAuthor("Help Center")
    .setDescription(`Hello there!\nYou're on the basic help center, here you can see all the commands and their description. Also, here are some limitations`)
    .addFields(
      {name: "Limitations", value: `**#1.** You cannot create games once the game hosting is full. The max games that can be created and hosted are **${bot.max_games_host} games**\n**#2.** You cannot join a game when it's full`},
      {name: "Operational Commands", value: `\`us/help\` :: Show the basic help center\n\`us/invite\` :: Show the bot invite\n\`us/guide\` :: Show a small guide for new users that are using the bot\n\`us/mailbox\` :: Show the newer information and updates\n\`us/stats\` :: Show all bot statistics\n`}
    )
    .setColor("BLURPLE")
    .setFooter(`Page 1/5\nDeveloped by: !                        Kyro ;;#9731`)

    const page_1 = new MessageEmbed()
    .setAuthor("Help Center")
    .setDescription(`Hello there!\nYou're on the page 2 of the basic help center, here you can see all the commands that are designed for the **Game Management**`)
    .addFields(
      {name: "Operational Commands", value: `\`us/create\` :: Creates a new game in your server. The user who created it, will be set as the Host of the game\n\`us/leave\` :: Leaves the game you're in. Also, if the Host leaves and there are players left, a new Host will be selected (Randomly)\n\`us/join\` :: Join a existing game, using the game code. Host cannot join this game cause they created it\n\`us/info\` :: Show the information about the game you're in, # Impostors, # Tasks, # Players and others\n\`us/leaderboard\` :: Show the leaderboard. You can specify what leaderboard you want to show (global, guild)\n\`us/start\` :: Start the game you're in. Host can use this to start the game, and 1 user will be chosen to be An Impostor\n`}
    )
    .setColor("BLURPLE")
    .setFooter(`Page 2/5\nDeveloped by: !                        Kyro ;;#9731`)

    const page_2 = new MessageEmbed()
    .setAuthor("Help Center")
    .setDescription(`Hello there!\nYou're on the page 3 of the basic help center, here you can see all the commands that are designed for the **Game Configuration**`)
    .addFields(
      {name: "Operational Commands", value:`\`us/settasks\` :: Set your own amount of tasks. Can be set from 1 task to 10 tasks\n\`us/setsabotages\` :: Enable or Disable the sabotages for the game\n\`us/setimpostors\` :: Set your own amount of Impostors\n\`us/playerlimit\` :: Set your own player limit. This means that are the amount of players that can join\n\`us/emergencydur\` :: Set your own emergency meeting duration\n\`us/emergencycd\` :: Set your own emergency cooldown\n\`us/killcooldown\` :: Set your own kill cooldown for Impostors\n`}
    )
    .setColor("BLURPLE")
    .setFooter(`Page 3/5\nDeveloped by: !                        Kyro ;;#9731`)

    const page_3 = new MessageEmbed()
    .setAuthor("Help Center")
    .setDescription(`Hello there!\nYou're on the page 4 of the basic help center, here you can see all the commands that are designed for the **Game Profile**`)
    .addFields(
      {name: "Operational Commands", value:`\`us/card\` :: Show your game card. In the card will be displayed all your statistics\n\`us/friendrequest\` :: Add, accept, decline, block and view your friends\n`}
    )
    .setColor("BLURPLE")
    .setFooter(`Page 4/5\nDeveloped by: !                        Kyro ;;#9731`)

    const page_4 = new MessageEmbed()
    .setAuthor("Help Center")
    .setDescription(`Hello there!\nYou're on the page 5 of the basic help center, here you can see all the commands that are designed for the **InGame Behaviour**`)
    .addFields(
      {name: "Operational Commands", value:`\`us/move\` :: Move around the map Skeld\n\`us/inspect\` :: Inspect around your area\n\`us/fixsabotage\` :: Fix the sabotage that was commited by An Impostor\n\`us/tasks\` :: Show your remaining tasks\n\`us/runtask\` :: Perform a task or some tasks that are in your area\n\`us/report\` :: Report a dead body that was found in your area\n\`us/emergency\` :: Call a emergency meeting\n\`us/kill\` :: Kill a crewmate that is near to you\n\`us/sabotage\` :: Sabotage a system of the Skeld\n`}
    )
    .setColor("BLURPLE")
    .setFooter(`Page 5/5\nDeveloped by: !                        Kyro ;;#9731`)

    

    const m = await message.channel.send(embed)

    await m.react("◀")
    await m.react("❌")
    await m.react("▶")
     

    const filter = (reaction, user) => ["◀", "▶", "❌"].includes(reaction.emoji.name) && (message.author.id === user.id)
    const collector = m.createReactionCollector(filter)

    collector.on("collect", (reaction, user) =>{

      

      if(reaction.emoji.name === "▶"){
        
        page++;
        if(page > 4) page = 0

        if(page === 0) m.edit(embed)
        if(page === 1) m.edit(page_1)
        if(page === 2) m.edit(page_2)
        if(page === 3) m.edit(page_3)
        if(page === 4) m.edit(page_4)
      }
      if(reaction.emoji.name === "◀"){
        
        page--;
        if(page < 0) page = 4

        if(page === 0) m.edit(embed)
        if(page === 1) m.edit(page_1)
        if(page === 2) m.edit(page_2)
        if(page === 3) m.edit(page_3)
        if(page === 4) m.edit(page_4)

      }
      if(reaction.emoji.name === "❌"){
        m.delete()
        
        message.channel.send(`The help page has been **deleted**.`).then(msg => msg.delete({timeout: 5000}))
      }
    })
  }
}
