const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ders')
		.setDescription('Güncel ders bilgilerini verir.'),
	async execute(interaction) {
		await interaction.reply('');
	},
};