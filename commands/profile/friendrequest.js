const {MessageEmbed} = require("discord.js")
const Duration = require("humanize-duration")
const fs = require("fs")
module.exports={
  name: "friendrequest",
  category: "profile",
  description: "Send a friend request to a user/player",
  run: async(bot, message, args) =>{
    //Commands here

    if(message.channel.type === "dm") return message.channel.send(`Cannot run the command in **DM**. Please run the command in a **server**.`)

    //Send Request

    let setting = args[0]
    let settings = ["-send", "-accept", "-remove", "-decline", "-block", "-list"]

    if(!settings.includes(setting)) return message.channel.send(`The provided setting is not allowed. Use: \`${settings.map(s => s).join(", ")}\``)

    

    if(setting === "-send"){
      const mention = message.mentions.members.first() || message.guild.members.cache.get(args[1])

      if(!mention) return message.channel.send(`You **didn't mention** a user, or **didn't provide** a user ID.`)

      if(mention.id === message.author.id) return message.channel.send(`**Cannot** send a friend request to yourself.`)
      if(!bot.requests[mention.id]) return message.channel.send(`**Cannot** send a friend request to this user. The user **couldn't be found**.`)

      if(bot.requests[mention.id].friend_requests.some(request => request.user_id === message.author.id)) return message.channel.send(`You **already** sent a friend request to ${mention}`)

      let generated_friend_request_id = ""
      let gens = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "a", "A", "b", "B", "c", "C", "d", "D", "e", "E", "f", "F", "g", "G", "h", "H"]

      if(bot.requests[message.author.id].friends.some(request => request.user_id === mention.user.id)) return message.channel.send(`You're **already** friend of ${mention}`)
      if(bot.requests[mention.id].blocked.some(request => request.user_id === message.author.id)) return message.channel.send(`You were **blocked** by ${mention}. **Cannot** send friend requests to this user.`)

      for(let i = 0; i < 8; i++){
        generated_friend_request_id = generated_friend_request_id + gens[Math.floor(Math.random() * gens.length)]
      }

      bot.requests[mention.id].friend_requests.push({
        request_id: generated_friend_request_id,
        user_id: message.author.id,
        send_since: new Intl.DateTimeFormat("en-US").format(Date.now()),
        expires: Date.now() + 1000 * 60 * 60 * 24
      })

      fs.writeFile("./mainuser/requests.json", JSON.stringify(bot.requests), (err) => { if(err) console.log(err) })
      message.channel.send(`You've **sent** a friend request to **${mention}**`)
    }
    if(setting === "-accept"){
      let code = args[1]

      if(bot.requests[message.author.id].friend_requests.length <= 0) return message.channel.send(`You **don't have** pending friend requests.`)
      if(!code) return message.channel.send(`You **didn't provide** a friend request code.`)

      let accepting = ""

      let new_requests = []

      bot.requests[message.author.id].friend_requests.forEach(request =>{
        if(request.request_id === code){
          accepting = request.user_id
        }else{
          new_requests.push(request)
        }
      })

      bot.requests[message.author.id].friend_requests = new_requests
      if(!accepting) return message.channel.send(`**Cannot** find that request.`)

      bot.requests[accepting].friends.push({
        user_id: message.author.id,
        discriminator: message.author.discriminator,
        friends_since: new Intl.DateTimeFormat("en-US").format(Date.now())
      })
      bot.requests[message.author.id].friends.push({
        user_id: accepting,
        discriminator: message.guild.members.cache.get(accepting).user.discriminator,
        friends_since: new Intl.DateTimeFormat("en-US").format(Date.now())
      })
      fs.writeFile("./mainuser/requests.json", JSON.stringify(bot.requests), (err) => { if(err) console.log(err) })
      message.channel.send(`You **accepted** the friend request of **${message.guild.members.cache.get(accepting)}**. You're now friends!`)
    }
    if(setting === "-decline"){

      let code = args[1]

      if(bot.requests[message.author.id].friend_requests.length <= 0) return message.channel.send(`You **don't have** pending friend requests.`)
      if(!code) return message.channel.send(`You **didn't provide** a friend request code.`)

      let declined = ""

      let new_requests = []

      bot.requests[message.author.id].friend_requests.forEach(request =>{
        if(request.request_id === code){
          declined = request.user_id
        }else{
          new_requests.push(request)
        }
      })
      if(!declined) return message.channel.send(`**Cannot** find that request.`)

      bot.requests[message.author.id].friend_requests = new_requests
      fs.writeFile("./mainuser/requests.json", JSON.stringify(bot.requests), (err) => { if(err) console.log(err) })
      message.channel.send(`You **declined** the friend request of ${message.guild.members.cache.get(declined)}`)
    }
    if(setting === "-block"){

      let userid = args[1]

      //if(bot.requests[message.author.id].friend_requests.length <= 0) return message.channel.send(`You **don't have** pending friend requests.`)
      if(!userid) return message.channel.send(`You **didn't provide** a user ID.`)

      let blocked = message.guild.members.cache.get(userid)

      if(blocked.id === message.author.id) return message.channel.send(`**Cannot** block yourself.`)
      if(bot.requests[message.author.id].friends.some(request => request.user_id === mention.user.id)) return message.channel.send(`You're friend of ${mention}. **Cannot** block him`)
      if(bot.requests[blocked.id].blocked.some(request => request.user_id === mention.user.id)) return message.channel.send(`You **already blocked** ${blocked}.`)
      if(!blocked) return message.channel.send(`**Cannot** find that user.`)

      bot.requests[message.author.id].blocked.push({
        user_id: blocked.id,
        discriminator: blocked.user.discriminator,
        blocked_since: new Intl.DateTimeFormat("en-US").format(Date.now())
      })
      fs.writeFile("./mainuser/requests.json", JSON.stringify(bot.requests), (err) => { if(err) console.log(err) })
      message.channel.send(`You **blocked** the user ${blocked}. They **will not** able to send you friend requests.`)
    }
    if(setting === "-list"){
      let page = 0

      const friend_pending = new MessageEmbed()
      .setAuthor("Friend request Center")
      .setDescription(`Hello there!\nThis is your **Friend request Center**, here will appear every friend request/friends/blocked users that you have inside the game.`)
      .addFields(
        {name: "Pending Requests", value: bot.requests[message.author.id].friend_requests.length <= 0 ? `You don't have pending friend requests. Try sending friend requests to users` : bot.requests[message.author.id].friend_requests.map((request, i) => { return `**REQUEST #${i+1}**\nRequest ID: \`${request.request_id}\`\nFrom: \`${bot.users.cache.get(request.user_id).tag}\`\nSend Since: \`${request.send_since}\`\nExpires: \`${Duration(request.expires - Date.now(), {units: ['h', 'm', 's'], round: true, largest:false})}\`` }).join("\n\n")}
      )
      .setColor("BLURPLE")

      const m = await message.channel.send(friend_pending)

      await m.react("◀")
      await m.react("❌")
      await m.react("▶")
      

      const filter = (reaction, user) => ["◀", "▶", "❌"].includes(reaction.emoji.name) && (message.author.id === user.id)
      const collector = m.createReactionCollector(filter)

      collector.on("collect", (reaction, user) =>{
        if(m.deleted) return

        const friend_pending_ = new MessageEmbed()
        .setAuthor("Friend request Center")
        .setDescription(`Hello there!\nThis is your **Friend request Center**, here will appear every friend request/friends/blocked users that you have inside the game.`)
        .addFields(
          {name: "Pending Requests", value: bot.requests[message.author.id].friend_requests.length <= 0 ? `You don't have pending friend requests. Try sending friend requests to users` : bot.requests[message.author.id].friend_requests.map((request, i) => { return `**REQUEST #${i+1}**\nRequest ID: \`${request.request_id}\`\nFrom: \`${bot.users.cache.get(request.user_id).tag}\`\nSend Since: \`${request.send_since}\`\nExpires: \`${Duration(request.expires - Date.now(), {units: ['h', 'm', 's'], round: true, largest:false})}\`` }).join("\n\n")}
        )
        .setColor("BLURPLE")


        const friend_accepted_ = new MessageEmbed()
        .setAuthor("Friend request Center")
        .setDescription(`Hello there!\nThis is your **Friend request Center**, here will appear every friend request/friends/blocked users that you have inside the game.`)
        .addFields(
          {name: "Friends", value: bot.requests[message.author.id].friends.length <= 0 ? `You don't have friends yet. Try sending friend requests to users` : bot.requests[message.author.id].friends.map((request, i) => { return `Friend: \`${bot.users.cache.get(request.user_id).tag}\`\nFriends Since: \`${request.friends_since}\`\nPlaying: \`${bot.users.cache.get(request.user_id).username} ${bot.users_on_game.has(request.user_id) ? `is playing AmongDiscord (Code: ${bot.users_on_game.get(request.user_id)})` : `is not playing AmongDiscord`}\`` }).join("\n\n")}
        )
        .setColor("BLURPLE")


        const friend_blocked_ = new MessageEmbed()
        .setAuthor("Friend request Center")
        .setDescription(`Hello there!\nThis is your **Friend request Center**, here will appear every friend request/friends/blocked users that you have inside the game.`)
        .addFields(
          {name: "Blocked Users", value: bot.requests[message.author.id].blocked.length <= 0 ? `You don't have blocked users. Block them if necessary` : bot.requests[message.author.id].blocked.map((request, i) => { return `User: \`${bot.users.cache.get(request.user_id).tag}\`\nBlocked Since: \`${request.blocked_since}\`` }).join("\n\n")}
        )
        .setColor("BLURPLE")
        
        if(reaction.emoji.name === "▶") page++
        if(reaction.emoji.name === "◀") page--
        if(reaction.emoji.name === "❌"){
          m.delete()
        
          message.channel.send(`The friend request center has been **deleted**.`).then(msg => msg.delete({timeout: 5000}))
        }

        if(page < 0) page = 2
        if(page > 2) page = 0
        if(page === 0) m.edit(friend_pending_)
        if(page === 1) m.edit(friend_accepted_)
        if(page === 2) m.edit(friend_blocked_)
      })
    }
    if(setting === "-remove"){
      return message.channel.send(`In **maintenance**! Come back soon.`)

      const mention = message.mentions.members.first() || message.guild.members.cache.get(args[1])

      if(!mention) return message.channel.send(`You **didn't mention** a user, or **didn't provide** a user ID.`)

      if(!bot.requests[message.author.id].friends.some(request => request.user_id === mention.user.id)) return message.channel.send(`**You're not** friend of ${mention}`)

      let new_friends = []
      let other_new_friend = []
      let removed = ""

      bot.requests[message.author.id].friends.forEach(request =>{
        if(request.user_id !== mention.id){
          new_friends.push(request)
        }
      })

      bot.requests[message.author.id].friends = new_friends
      message.channel.send(`You're **no longer** friend of ${mention}`)

      bot.requests[mention.id].friends.forEach(request =>{
        if(request.user_id !== message.author.id){
          other_new_friends.push(request)
        }
      })

      bot.requests[mention.id].friends = other_new_friends
      fs.writeFile("./mainuser/requests.json", JSON.stringify(bot.requests), (err) => { if(err) console.log(err) })
    }
  }
}