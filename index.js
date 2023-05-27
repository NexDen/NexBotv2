var { token } = require("./config.json")
var { Discord, Client, Collection, GatewayIntentBits ,Intents, MessageActionRow, MessageButton, MessageSelectMenu, MessageEmbed } = require("discord.js")
var Colors = require("./colors.js")

const fs = require("node:fs")
const path = require("node:path")

const readline = require("readline")

var debug = false;


var { komut_log , düzenle_log } = require("./log_messages.js")

const { handle_message } = require("./handle_messages");

var {handle_member_add, handle_member_leave} = require("./handle_member")

// test yorumu.

const {execute: aktif_execute} = require("./fonksiyonlar/aktif.js")
const {execute: bakim_execute} = require("./fonksiyonlar/bakim.js")

// zort

// abdü

var client = new Client({
    intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
})

const rl = readline.createInterface({
    input: process.stdin,
    output:process.stdout
})

client.once('ready', () => { 
    console.log(`\x1b[33m${client.user.username}\x1b[0m\x1b[1m'a bağlanıldı!\x1b[0m'`)
    client.user.setPresence({ activities: [{ name: 'Minecraft'}], status: 'online' });
});

var guildId = "961714430461227028"
var channelId = "961714430461227031"

rl.on('line', (input) => {
    const guild = client.guilds.cache.find(guild => guild.id === guildId)
    const channel = guild.channels.cache.find(channel => channel.id === channelId);
    if (channel) {
        channel.send(input);
    }
});


client.commands = new Collection();

const commandsPath = path.join(__dirname, 'fonksiyonlar');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`${Colors.Bright}${Colors.FgRed}[UYARI]${Colors.Reset} ${filePath} komutu "data" veya "execute" komutu içermiyor.`);
	}
}

client.on("error", error => {
    console.error(error)
})

client.on("messageUpdate", async (oldMessage, newMessage) =>{
    düzenle_log(oldMessage, newMessage, client)
    })

client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return 

    const command = interaction.client.commands.get(interaction.commandName)

    if (!command) {
        console.error(`${Colors.Bright}${Colors.FgRed}[KOMUT BULUNAMADI]${Colors.Reset} ${interaction.commandName}`)
    }

    try {
        await command.execute(interaction)
        komut_log(interaction)
    } catch (err){
        console.error(err)
        await interaction.reply({
            content: "Komut çalıştırırken bir hata oluştu.",
            ephemeral: true
        })
    }


})

client.on("guildCreate", async guild => {
    var şuan = new Date(Date.now()).toLocaleTimeString("tr-TR")
    var sunucu_isim = guild.name
    console.log(`${Colors.Bright}${Colors.FgRed}[SUNUCU-GİRİŞ] ${Colors.FgYellow}${şuan} ${Colors.FgGreen}${sunucu_isim}`)
})

client.on("guildMemberAdd", async member => {
    handle_member_add(member, debug)
})

client.on("guildMemberRemove", async member => {
    handle_member_leave(member, debug)
})

client.on("messageCreate", async message =>{

    if (message.content === "!aktif"){
        if (message.member.permissions.has("Administrator")){
            aktif_execute(message)
        }
    }

    if (message.content === "!bakim"){
        if (message.member.permissions.has("Administrator")){
            bakim_execute(message)
        }
    }

    handle_message(message, client, debug)
})

client.login(token)
