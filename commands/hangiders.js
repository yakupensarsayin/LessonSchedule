const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hangiders')
		.setDescription('Hangi derste olduğunuzu söyler.'),
	async execute(interaction) {
		await interaction.reply('');
	},
};