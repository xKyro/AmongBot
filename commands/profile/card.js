const {MessageEmbed, MessageAttachment} = require("discord.js")
const Canvas = require("canvas")
const { registerFont } = require("canvas")
registerFont('fonts/VCR_OSD_MONO_1.001.ttf', { family: 'VCR_OSD_MONO' });

module.exports={
  name: "card",
  category: "profile",
  description: "Display your game card, or someone else's",
  run: async(bot, message, args) =>{
    //Commands here
    //if(message.author.id !== "639931530638131214") return message.channel.send(`**${bot.ticks[1]} | This command is on maintenance.**`)

    if(message.channel.type === "dm") return message.channel.send(`Cannot run the command in **DM**. Please run the command in a **server**.`)

    const mention = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
    
    if(!mention) return message.channel.send(`You **didn't mention** a user, or **didn't provide** a user ID.`)

    const canvas = Canvas.createCanvas(500, 700)
    const ctx = canvas.getContext("2d")
    const background = await Canvas.loadImage(bot.card)
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

    ctx.strokeStyle = '#74037b'
    ctx.strokeRect(0, 0, canvas.width, canvas.height)

    const logo = await Canvas.loadImage(bot.card1)
    ctx.drawImage(logo, 34, 21, 185, 185)
    ctx.drawImage(logo, 250, 41, 185, 145)
    

    const avatar = await Canvas.loadImage(mention.user.displayAvatarURL({ format: 'jpg' }))
    ctx.drawImage(avatar, 51, 40, 150, 150)


    ctx.font = '20px Roboto'
    ctx.fillStyle = '#4bdb3b'
    ctx.textAling = "center"
    ctx.fillText("Name", 60, 250)
    ctx.font = '16px Roboto'
    ctx.fillStyle = '#ffffff'
    ctx.textAling = "center"
    ctx.fillText(mention.user.username, 60, 270)

    //Level
    ctx.font = '18px Roboto'
    ctx.fillStyle = '#ffffff'
    ctx.textAling = "center"
    ctx.fillText(`Experience:`, 270, 70)

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(270, 80, 100, 15)
    ctx.fill()

    ctx.fillStyle = '#373837'
    ctx.fillRect(370, 80, -(bot.userlevel[mention.id].next_lvlxp - bot.userlevel[mention.id].xp), 15)
    ctx.fill()

    ctx.font = '12px Roboto'
    ctx.fillStyle = '#ffffff'
    ctx.textAling = "center"
    ctx.fillText(`${bot.userlevel[mention.id].xp} / ${bot.userlevel[mention.id].next_lvlxp} XP`, 270, 110)

    ctx.font = '18px Roboto'
    ctx.fillStyle = '#ffffff'
    ctx.textAling = "center"
    ctx.fillText(`Level:`, 270, 140)

    ctx.font = '24px Roboto'
    ctx.fillStyle = '#dbd63b'
    ctx.textAling = "center"
    ctx.fillText(`${bot.userlevel[mention.id].lvl}`, 340, 140)
    

    //Stats
    ctx.font = '20px Roboto'
    ctx.fillStyle = '#4bdb3b'
    ctx.textAling = "center"
    ctx.fillText("Statistics:", 60, 310)

    ctx.font = '16px Roboto'
    ctx.fillStyle = '#ffffff'
    ctx.textAling = "center"
    ctx.fillText(`Victory as Crewmate: ${bot.userdata[mention.id].victory_crewmate}`, 60, 340)

    ctx.font = '16px Roboto'
    ctx.fillStyle = '#ffffff'
    ctx.textAling = "center"
    ctx.fillText(`Victory as Impostor: ${bot.userdata[mention.id].victory_impostor}`, 60, 360)

    ctx.font = '16px Roboto'
    ctx.fillStyle = '#ffffff'
    ctx.textAling = "center"
    ctx.fillText(`Sabotages Commited: ${bot.userdata[mention.id].sabotages}`, 60, 380)

    ctx.font = '16px Roboto'
    ctx.fillStyle = '#ffffff'
    ctx.textAling = "center"
    ctx.fillText(`Sabotages Fixed: ${bot.userdata[mention.id].sabotages_fixed}`, 60, 400)

    ctx.font = '16px Roboto'
    ctx.fillStyle = '#ffffff'
    ctx.textAling = "center"
    ctx.fillText(`Task Completed: ${bot.userdata[mention.id].tasks_completed}`, 60, 420)

    ctx.font = '16px Roboto'
    ctx.fillStyle = '#ffffff'
    ctx.textAling = "center"
    ctx.fillText(`All Tasks Completed: ${bot.userdata[mention.id].all_tasks_completed}`, 60, 440)

    ctx.font = '16px Roboto'
    ctx.fillStyle = '#ffffff'
    ctx.textAling = "center"
    ctx.fillText(`Times Killed: ${bot.userdata[mention.id].times_killed}`, 60, 460)

    ctx.font = '16px Roboto'
    ctx.fillStyle = '#ffffff'
    ctx.textAling = "center"
    ctx.fillText(`Times Ejected: ${bot.userdata[mention.id].times_ejected}`, 60, 480)

    ctx.font = '16px Roboto'
    ctx.fillStyle = '#ffffff'
    ctx.textAling = "center"
    ctx.fillText(`Kills: ${bot.userdata[mention.id].kills}`, 60, 500)


    const attachment = new MessageAttachment(canvas.toBuffer(), "crewcard.png")



    message.channel.send(attachment)
  }
}