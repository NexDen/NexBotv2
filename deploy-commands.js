const { REST, Routes } = require('discord.js');
const { clientId, token } = require('./config.json');
const fs = require('node:fs');

const commands = [];
const commandFiles = fs.readdirSync("./fonksiyonlar/").filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./fonksiyonlar/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
	try {
		console.log(`${commands.length} tane komut yazılıyor.`);
		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log(`${data.length} tane komut yazıldı.`);
	} catch (error) {
		console.error(error);
	}
})();