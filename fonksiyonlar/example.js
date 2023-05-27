const { SlashCommandBuilder, GuildExplicitContentFilter } = require("discord.js")

async function command(interaction){
    return interaction.reply(":)")
}

module.exports = {
    data: new SlashCommandBuilder()
            .setName("example") // must be set as the same name as the file.
            .setDescription(":)"),
    async execute(interaction){
        command(interaction)
    }
}