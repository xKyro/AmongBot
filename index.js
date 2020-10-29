const Duration = require("humanize-duration")
require("dotenv").config()

const keepAlive = require('./server');
const Monitor = require('ping-monitor');

 
keepAlive();
const monitor = new Monitor({
    website: 'https://AmongHost.itzfox.repl.co',
    title: 'Secundario',
    interval: 5 // minutes
});

monitor.on('up', (res) => console.log(`${res.website} esta online.`));
monitor.on('down', (res) => console.log(`${res.website} se ha caído - ${res.statusMessage}`));
monitor.on('stop', (website) => console.log(`${website} se ha parado.`) );
monitor.on('error', (error) => console.log(error));



//Discord
const {Collection, Client, Discord, MessageEmbed} = require("discord.js")
const fs = require("fs")
const ms = require("ms")


const bot = new Client()

//Global Data Bases
bot.userdata = require("./userdata.json")
bot.userlevel = require("./userlevel.json")
bot.userclaims = require("./userclaims.json")

//User Data Base
bot.requests = require("./mainuser/requests.json")

bot.ticks = [
  "<:tick_check:752248100508401744>", 
  "<:tick_cross:752248100617453600>", 
  "<:tick_warn:752248100395024406>", 
  "<:tick_info:752248100554408034>",
  "<:tick_unmarked:757384673868644422>",
  "<:tick_marked:757384673675575388>"
]
//Interactable Menu
bot.claim_menu = new Map()
bot.claiming_role = new Map()

//Game Management GM
bot.players_game_limit = new Map() //GM
bot.games_server = new Map() //GM
bot.users_move = new Map() //GM
bot.run_games = new Map() //GM
bot.games_kill_cd = new Map() //GM
bot.games_sabotages = new Map() //GM
bot.remaining_tasks = new Map() //GM
bot.active_games = new Map() //GM
bot.games_votes = new Map() //GM
bot.emergencies = new Map() //GM
bot.emergencies_cd = new Map() //GM
bot.killed_players = new Map() //GM
bot.dead_bodies = new Map() //GM
bot.remaining_crewmates = new Map() //GM
bot.remaining_impostors = new Map() //GM

//Users Management UM
bot.already_voted = new Map() //UM
bot.users_tasks = { } //UM
bot.users_on_game = new Map() //UM
bot.games_host = new Map() //UM
bot.users_roles = new Map() //UM

//Custom Game Behaviour CGB
bot.games_tasks = new Map() //CGB
bot.kill_cooldown = new Map() //CGB
bot.emergency_duration = new Map() //CGB
bot.emergency_cooldown = new Map() //CGB
bot.enable_sabotages = new Map() //CGB
bot.game_impostors = new Map() //CGB

//Configs
bot.max_games_host = 50
bot.players_to_start = 4
bot.places = [{
  name: "Cafeteria",
  can_be_sabotaged: false,
  critical_sabotage: false,
  list_tasks:[
    "Fix Wiring",
    "Empty Garbage",
    "Download Data"
  ]
},
{
  name: "Admin",
  can_be_sabotaged: false,
  critical_sabotage: false,
  list_tasks:[
    "Fix Wiring",
    "Swipe Card",
    "Upload Data"
  ]
},
{
  name: "Medbay",
  can_be_sabotaged: false,
  critical_sabotage: false,
  list_tasks:[
    "Inspect Samples",
    "Submit Scan"
  ]
},
{
  name: "Weapons",
  can_be_sabotaged: false,
  critical_sabotage: false,
  list_tasks:[
    "Accept Diverted Power",
    "Clear Asteroids",
    "Download Data"
  ]
},
{
  name: "Navigation",
  can_be_sabotaged: false,
  critical_sabotage: false,
  list_tasks:[
    "Fix Wiring",
    "Chart Course",
    "Stabilize Steering",
    "Accept Diverted Power",
    "Download Data"
  ]
},
{
  name: "Electrical",
  can_be_sabotaged: true,
  critical_sabotage: false,
  list_tasks:[
    "Divert Power to navigation",
    "Divert Power to upper engine",
    "Divert Power to lower engine",
    "Divert Power to shields",
    "Divert Power to security",
    "Divert Power to weapons",
    "Divert Power to communications",
    "Divert Power to o2",
    "Calibrate Distributor",
    "Fix Wiring",
    "Download Data",
  ]
},
{
  name: "Upper Engine",
  can_be_sabotaged: false,
  critical_sabotage: false,
  list_tasks:[
    "Accept Diverted Power",
    "Align Engine Output",
    "Fuel Engine",
  ]
},
{
  name: "Lower Engine",
  can_be_sabotaged: false,
  critical_sabotage: false,
  list_tasks:[
    "Accept Diverted Power",
    "Align Engine Output",
    "Fuel Engine",
  ]
},
{
  name: "Storage",
  can_be_sabotaged: false,
  critical_sabotage: false,
  list_tasks:[
    "Empty Garbage",
    "Fix Wiring",
  ]
},
{
  name: "Communications",
  can_be_sabotaged: true,
  critical_sabotage: false,
  list_tasks:[
    "Accept Diverted Power",
    "Download Data",
  ]
},
{
  name: "O2",
  can_be_sabotaged: true,
  critical_sabotage: true,
  list_tasks:[
    "Clean O2 Filter",
    "Empty Chute",
    "Accept Diverted Power",
  ]
},
{
  name: "Shields",
  can_be_sabotaged: false,
  critical_sabotage: false,
  list_tasks:[
    "Prime Shields",
    "Accept Diverted Power",
  ]
},
{
  name: "Reactor",
  can_be_sabotaged: true,
  critical_sabotage: true,
  list_tasks:[
    "Unlock Manifolds",
    "Start Reactor",
  ]
},
{
  name: "Security",
  can_be_sabotaged: false,
  critical_sabotage: false,
  list_tasks:[
    "Accept Diverted Power",
  ]
},]
bot.card = "./card.PNG"
bot.card1 = "./card_1.PNG"

bot.gameover = new MessageEmbed()
.setImage("https://cdn.discordapp.com/attachments/744644559950315650/769691645481451571/GameOver.png")
.setColor("#ff5d5d")

//Game Functions
bot.victory = require('./functions/victory')
bot.alarm = require('./functions/alarm')


/*-----------------------------------------------------
-                                                     -
-                    AMONG DISCORD                    -
-            Game of teamwork and betrayal            -
-                                                     -
------------------------------------------------------*/

bot.commands = new Collection()
bot.aliases = new Collection()
bot.categories = fs.readdirSync("./commands/");
["command"].forEach(handler => {
  require(`./handlers/${handler}`)(bot)
})


bot.login(process.env.token)
let show_ = 0

bot.on("ready", () => {
  
  console.log(`\nAmongDiscord is now ready!\nGAME_HOSTING: ${bot.max_games_host} games\nGUILDS: ${bot.guilds.cache.size} servers\nUSERS: ${bot.users.cache.size} users`)
  bot.user.setActivity(`Loading datas...`, {type: 'WATCHING'})


  setTimeout(function(){
    bot.user.setActivity(`Clearing games...`, {type: 'WATCHING'})

    setTimeout(function(){
      bot.user.setActivity(`Initializing systems and behaviours...`, {type: 'WATCHING'})
    }, 1000 * Math.floor(Math.random() * 5))
  }, 1000 * 5)

  setInterval(function(){
    
    bot.user.setActivity(`${bot.users_on_game.size} players & ${bot.run_games.size}/${bot.max_games_host} games | us/help`, {type: 'WATCHING'})
  }, 15000)
})
bot.on("message", (message) =>{

  let prefix = "us/"

  if(!bot.userdata[message.author.id] && !message.author.bot){
    bot.userdata[message.author.id] = {
      "user_name": message.author.username,
      "victory_crewmate": 0,
      "victory_impostor": 0,
      "sabotages": 0,
      "sabotages_fixed": 0,
      "tasks_completed": 0,
      "all_tasks_completed": 0,
      "times_killed": 0,
      "times_ejected": 0,
      "kills": 0
    }
  }
  if(!bot.userlevel[message.author.id] && !message.author.bot){
    bot.userlevel[message.author.id] = {
      "user_name": message.author.username,
      "xp": 0,
      "next_lvlxp": 100,
      "lvl": 0
    }
  }
  if(!bot.requests[message.author.id] && !message.author.bot){
    bot.requests[message.author.id] = {
      "friend_requests": [],
      "friends": [],
      "blocked": []
    }
  }
  if(!bot.userclaims[message.author.id] && !message.author.bot){

    let gens = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "A", "a", "B", "b", "C", "c", "D", "d", "E", "e", "F", "f"]
    let code = ""
    let code_1 = ""
    let code_2 = ""
    let code_3 = ""

    for(let i = 0; i < 4; i++){
      code = code + gens[Math.floor(Math.random() * gens.length)]
      code_1 = code_1 + gens[Math.floor(Math.random() * gens.length)]
      code_2 = code_2 + gens[Math.floor(Math.random() * gens.length)]
      code_3 = code_3 + gens[Math.floor(Math.random() * gens.length)]
    }


    bot.userclaims[message.author.id] = {
      "claims": [{
        role_id: "757343544271831102",
        required_lvl: 5,
        claimed: false,
        claim_code: code
      },
      {
        role_id: "757343807078400032",
        required_lvl: 15,
        claimed: false,
        claim_code: code_1
      },
      {
        role_id: "757343832625905675",
        required_lvl: 25,
        claimed: false,
        claim_code: code_2
      },
      {
        role_id: "757343867631566899",
        required_lvl: 35,
        claimed: false,
        claim_code: code_3
      },]
    }
  }

  if(bot.userlevel[message.author.id]){
    if(bot.userlevel[message.author.id].xp >= bot.userlevel[message.author.id].next_lvlxp){
    
      bot.userlevel[message.author.id].xp = bot.userlevel[message.author.id].next_lvlxp
      bot.userlevel[message.author.id].next_lvlxp = bot.userlevel[message.author.id].xp + 100
      bot.userlevel[message.author.id].lvl = bot.userlevel[message.author.id].lvl + 1

      const level_up = new MessageEmbed()
      .setDescription(`${message.member}\nYou're now level **${bot.userlevel[message.author.id].lvl = bot.userlevel[message.author.id].lvl}**`)
      .setImage("https://cdn.discordapp.com/attachments/744644559950315650/769693068461867028/LevelUp.png")
      .setColor("BLURPLE")

      message.channel.send(level_up)
    }
  }
  if(bot.requests[message.author.id]){

    let new_requests = []

    if(bot.requests[message.author.id].friend_requests.length >= 1){
      bot.requests[message.author.id].friend_requests.forEach(request =>{
      if(Date.now() + 1000 < request.expires){
          new_requests.push(request)
        }
      })

      bot.requests[message.author.id].friend_requests = new_requests
    }
  }

  fs.writeFile("./userdata.json", JSON.stringify(bot.userdata), (err) => { if(err) console.log(err) })
  
  fs.writeFile("./userlevel.json", JSON.stringify(bot.userlevel), (err) => { if(err) console.log(err) })
  fs.writeFile("./userclaims.json", JSON.stringify(bot.userclaims), (err) => { if(err) console.log(err) })
  fs.writeFile("./mainuser/requests.json", JSON.stringify(bot.requests), (err) => { if(err) console.log(err) })

  if(message.guild && message.guild.id === "757279376671768726"){


    if(bot.claim_menu.has(message.author.id)){
      if(bot.claim_menu.get(message.author.id) === 0){
        let code = message.content
        if(code === "Cancell"){
          message.channel.send(`You **cancelled** the role selection.`)
          bot.claim_menu.delete(message.author.id)
          return
        }

        bot.userclaims[message.author.id].claims.forEach(claim =>{
          if(claim.claim_code === code){

            if(claim.claimed === true){
              message.channel.send(`You **already** claimed this role.`)

              bot.claim_menu.delete(message.author.id)
              bot.claiming_role.delete(message.author.id)

              return
            }

            bot.claim_menu.set(message.author.id, 1)
            message.channel.send(`Successfully found the role **${message.guild.roles.cache.get(claim.role_id).name}**\n> Are you sure you want to claim this role? \`(Yes / No)\``)

            bot.claiming_role.set(message.author.id, claim.role_id)
          }
        })
      }
      if(bot.claim_menu.get(message.author.id) === 1){
        let response = message.content

        if(response === "Yes"){
          bot.userclaims[message.author.id].claims.forEach(claim =>{
            if(claim.role_id === bot.claiming_role.get(message.author.id)){
              if(claim.required_lvl > bot.userlevel[message.author.id].lvl){
                message.channel.send(`You **cannot** claim this role! You **don't have** the required level.`)
                bot.claim_menu.delete(message.author.id)
                bot.claiming_role.delete(message.author.id)
                
              }else{
                message.channel.send(`You **claimed** this role.`)
                message.member.roles.add(bot.claiming_role.get(message.author.id))
                bot.claim_menu.delete(message.author.id)
                bot.claiming_role.delete(message.author.id)

                claim.claimed = true
                fs.writeFile("./userclaims.json", JSON.stringify(bot.userclaims), (err) => { if(err) console.log(err) })
              }
            }
          })
        }
        if(response === "No"){
          bot.claim_menu.delete(message.author.id)
          bot.claiming_role.delete(message.author.id)
          message.channel.send(`You **cancelled** the claim.`)
        }
      }
    }
  }

  if(message.channel.type === "dm"){

    //If a emergency meeting is running
    let find_game = bot.users_on_game.get(message.author.id)
    if(bot.emergencies.has(find_game)){

      let vote = message.content

      let users = []
      let alive_players = []

      let server = bot.games_server.get(find_game)
      const guild = bot.guilds.cache.get(server)

      
      if(vote.startsWith("chat")){

        const args_ = message.content.slice(4).trim().split(/ +/g);

        let msg = args_.slice(0).join(" ")
        if(!msg) return message.channel.send(`Enter a **text**.`)

        guild.members.cache.forEach(m => {
          if(bot.users_on_game.get(m.user.id) === find_game){
            if(bot.killed_players.has(message.author.id)){
              if(bot.killed_players.has(m.id)) m.send(`> **${message.author.username} (Ghost Chat):** ${msg}`)
            }else{
              m.send(`> **${message.author.username}:** ${msg}`)
            }
            
          }
        })
      }

      guild.members.cache.forEach(m => {
        if(bot.users_on_game.get(m.id) === find_game){
          if(bot.killed_players.has(m.id)) return
          users.push(m.id)
          alive_players.push(m.user.username)
        }
      })
      if(vote === "skip" || vote === "Skip"){

        

        if(bot.already_voted.has(message.author.id)) return message.channel.send(`You **already** voted! Cannot vote twice.`)
        message.channel.send(`You voted for **Skipping**.`)
        
        if(bot.games_votes.get(find_game)){
          bot.games_votes.set(find_game, bot.games_votes.get(find_game) + 1)
        }else{
          bot.games_votes.set(find_game, 1)
        }

        bot.already_voted.set(message.author.id, find_game)
      }else{

        vote = parseInt(vote)

        if(!vote) return

        if(!users[vote - 1]) return message.channel.send(`No crewmate **found** with this number.`)

        if(bot.already_voted.has(message.author.id)) return message.channel.send(`You **already** voted! Cannot vote twice.`)
        message.channel.send(`You voted for **${alive_players[vote - 1]}**`)
        
        if(bot.games_votes.get(users[vote - 1])){
          bot.games_votes.set(users[vote - 1], bot.games_votes.get(users[vote - 1]) + 1)
        }else{
          bot.games_votes.set(users[vote - 1], 1)
        }

        bot.already_voted.set(message.author.id, find_game)
      }
    }
    
    if(!message.content.startsWith(prefix)) return
  
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    const command = bot.commands.get(cmd)
    //if(!command) command = bot.commands.get(bot.aliases.get(cmd))
    if(!command) return message.channel.send(`The command **( ${cmd} )** doesn't exist. Please run a **valid command**. You can run the command \`${prefix}help\`, for more information.`)
    if(command) command.run(bot, message, args)
    return
  }

  if(!message.member) return
  if(!message.guild) return 
  if(message.member.user.bot) return
  if(!message.content.startsWith(prefix)) return

  const set_category = message.guild.channels.cache.filter(c => c.type == "category").find(c => c.name.includes("AmongDiscord") || c.name.includes("AmongBot"))

  if(!set_category || set_category === "undefined") return message.channel.send(`Hey, before using me, create a category with the name "AmongDiscord", so i can host all the games in that category.`)
  if(set_category.name.includes("AmongBot")) return message.channel.send(`Woah! Looks like you're using **an older version** of the bot, please **re-name** the category \`AmongBot -> AmongDiscord\`.`)
  
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
  

  const command = bot.commands.get(cmd)
  //if(!command) command = bot.commands.get(bot.aliases.get(cmd))
  if(!command) return message.channel.send(`The command **( ${cmd} )** doesn't exist. Please run a **valid command**. You can run the command \`${prefix}help\`, for more information.`)
  if(command) command.run(bot, message, args)
})
bot.on("guildCreate", (guild) =>{

  const main_channel = guild.channels.cache.find(ch => ch.name.includes("chat")) || guild.channels.cache.find(ch => ch.name.includes("general"))
  if(!main_channel) return

  console.log(`ADDED GUILD! "${guild.name}"`)

  if(main_channel){

    const embed = new MessageEmbed()
    .setAuthor("New Server")
    .setDescription(`Hello everyone!\nI'm **AmongDiscord**, the bot that can re-create Among Us in a Discord Server, just setup your server and play with me!`)
    .addFields(
      {name: ":tools: Help Center", value: `If you need help with the bot, or you have any issue. You can join our support server: https://discord.gg/fYpjKRZ`},
      {name: ":page_facing_up: Get Started!", value: `**#1.** Create a category named "AmongDiscord". You can put every emoji **between and after** the name\n**#2.** Run the command \`us/help\``}
    )
    .setImage("https://cdn.discordapp.com/attachments/744644559950315650/769940887123656764/AD-Server.png")
    .setColor("BLURPLE")

    main_channel.send(embed)
  }

})
bot.on("guildDelete", (guild) =>{
  console.log(`REMOVED GUILD! "${guild.name}"`)
})