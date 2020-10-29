const {MessageEmbed} = require("discord.js")
module.exports={
  name: "guide",
  category: "information",
  description: "Show a small guide for the correct usage",
  run: async(bot, message, args) =>{
    //Commands here

    const embed = new MessageEmbed()
    .setAuthor("Bot Guide")
    .setDescription(`Hello there!\nThis is a guide of how to get started with the bot and how to play. Let's see it`)
    .addFields(
      {name: "#1. Create a Game", value: `If you want to host a game and customize it. Create the game! Run the command \`us/create\`\nI'll create a new game for you with a random code, if you want to play with your friends... Give them the code`},
      {name: "#2. Set the Game", value: `You can customize your game!\nTasks, sabotages are allowed, kill cooldown, and others things\nFor example:\n> **us/emergencydur 90** (Set 90s for the emergency meeting duration)\nor\n> **us/killcooldown 45** (Set 45s for the kill cooldown of the impostor)\n\nYou can customize this, only if you're the host`},
      {name: "#3. Start the Game", value: `Run the command \`us/start\`\nAlso, every player role will be choosen randomly, this is assigned by impostor chances\nFor example:\n> Your chance 72%\n> Other player chance 49%\n\n**You'll be choosen to be the Impostor**\n\n> Your chance 10%\n> Other player chance 90%\n\n**The other player will be choosen to be the Impostor**\n\nYou can start the game if you're the host`},
      {name: "#4. Play and have Fun!", value: `If you're a Crewmate: **Your objective is to complete all your tasks**\nIf you're the Impostor: **Your objective is to kill off the crew**\n\nFor every player, can run those commands:\n**Crewmates:** \`us/move, us/tasks, us/fixsabotage, us/runtask, us/inspect, us/chat, us/emergency\`\n**Impostor:**\`us/kill, us/sabotage, us/move, us/inspect, us/chat, us/emergency\``}
    )
    .setImage("https://cdn.discordapp.com/attachments/744644559950315650/765548721235951646/unknown.png")
    .setColor("BLURPLE")
    .setFooter('The image is during a emergency meeting')

    message.channel.send(embed)
  }
}