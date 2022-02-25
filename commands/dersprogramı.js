const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dersprogramı')
		.setDescription('Günlük ders programını verir.'),
	async execute(interaction) {
		await interaction.reply('');
	},
};