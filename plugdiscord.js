const config = require('./config/index.json');

var PlugAPI = require('plugapi');
// import the discord.js module
const Discord = require('discord.js');

var plugbot = new PlugAPI({
    email: config.PlugEmail,
    password: config.PlugPassword
});



plugbot.on('roomJoin', function(room) {
    console.log("Joined " + room + "In PlugDJ");
});




// create an instance of a Discord Client, and call it bot
const dicordbotbot = new Discord.Client();


// the ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted.
dicordbotbot.on('ready', () => {
  console.log('Discord bot is ready!');
});

// create an event listener for messages
dicordbotbot.on('message', message => {
    if(message.channel.name == "crossroads")
    {

        console.log(message.content);
        // if the message is "ping",
        if (message.content === 'ping') {
        // send "pong" to the same channel.
            message.channel.sendMessage('pong');
        }
        if(message.author.id != dicordbotbot.user.id)
        {
            plugbot.sendChat("[Discord] [" + message.author.username + "] " + message.content);
        }
    }
});

plugbot.on('chat', function(data) {
    if (data.type == 'emote')
        console.log(data.from + data.message);
    else
        console.log(data.from + "> " + data.message);
        if(data.from.username != plugbot.getSelf().username)
        {
            var channel = GetChannelObjectbyName("crossroads");
            channel.sendMessage("[PlugDj] [" + data.from.username + "] " + data.message);
        }
});

plugbot.on('advance', function(data) {
    
    if(data.currentDJ!= null)
    {
        var channel = GetChannelObjectbyName("crossroads");
        let embed = new Discord.RichEmbed();
        embed.setTitle("["+ data.currentDJ.username +"] is Playing : "+ data.media.title + "- by: " + data.media.author);
        embed.setColor(0x00AE86);
        embed.addField("Come listen to Music on our Plug.dj!!", "https://plug.dj/thearkanauts");
        embed.setURL("https://plug.dj/thearkanauts");
        embed.setThumbnail(data.media.image);
        channel.sendEmbed(embed);
    }
    
});

function sendMessage(authorChannel, text) {
  dicordbotbot.sendMessage(authorChannel, text);
}

function GetChannelObjectbyName(channelName)
{
    return dicordbotbot.channels.find((item) => item.name == channelName); 
}

// log our bot in
dicordbotbot.login(config.DiscordToken);
plugbot.connect('thearkanauts');