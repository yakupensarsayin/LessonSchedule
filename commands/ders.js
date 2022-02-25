const { SlashCommandBuilder } = require('@discordjs/builders');

var lesson1Start = "08:50",
    lesson1Finish = "09:30",

    lesson2Start = "09:50",
    lesson2Finish = "10:30",

    lesson3Start = "10:40",
    lesson3Finish = "11:20",

    lesson4Start = "11:30",
    lesson4Finish = "12:10",

    lesson5Start = "12:55",
    lesson5Finish = "13:35",

    lesson6Start = "13:45",
    lesson6Finish = "14:25",

    lesson7Start = "14:40",
    lesson7Finish = "15:20",

    lesson8Start = "15:30",
    lesson8Finish = "16:10",

    lesson9Start = "16:20",
    lesson9Finish = "17:00";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ders')
		.setDescription('Güncel ders bilgilerini verir.'),
	async execute(interaction) {       
        var today = new Date();
        var currentTime = `${today.getHours()} : ${today.getMinutes()}`;
        var replyMessage = "";

        if(currentTime < lesson1Start){
            replyMessage = "Daha okul başlamadı. İlk ders 08.50'de.";
        }
        else if(lesson1Start < currentTime && currentTime < lesson1Finish){
            replyMessage = "1. derstesin.";
        }
        else if(lesson1Finish < currentTime && currentTime < lesson2Start){
            replyMessage = "1. dersin teneffüsündesin.";
        }
        else if(lesson2Start < currentTime && currentTime < lesson2Finish){
            replyMessage = "2. derstesin.";
        }
        else if(lesson2Finish < currentTime && currentTime < lesson3Start){
            replyMessage = "2. dersin teneffüsündesin.";
        }
        else if(lesson3Start < currentTime && currentTime < lesson3Finish){
            replyMessage = "3. derstesin.";
        }
        else if(lesson3Finish < currentTime && currentTime < lesson4Start){
            replyMessage = "3. dersin teneffüsündesin.";
        }

        else if(lesson4Start < currentTime && currentTime < lesson4Finish){
            replyMessage = "4. derstesin.";
        }
        else if(lesson4Finish < currentTime && currentTime < lesson5Start){
            replyMessage = "Öğle tenefüsündesin.";
        }
        else if(lesson5Start < currentTime && currentTime < lesson5Finish){
            replyMessage = "5. derstesin.";
        }
        else if(lesson5Finish < currentTime && currentTime < lesson6Start){
            replyMessage = "5. dersin teneffüsündesin.";
        }
        else if(lesson6Start < currentTime && currentTime < lesson6Finish){
            replyMessage = "6. derstesin.";
        }
        else if(lesson6Finish < currentTime && currentTime < lesson7Start){
            replyMessage = "6. dersin teneffüsündesin.";
        }

        else if(lesson7Start < currentTime && currentTime < lesson7Finish){
            replyMessage = "7. derstesin.";
        }
        else if(lesson7Finish < currentTime && currentTime < lesson8Start){
            replyMessage = "7. dersin tenefüsündesin.";
        }
        else if(lesson8Start < currentTime && currentTime < lesson8Finish){
            replyMessage = "8. derstesin.";
        }
        else if(lesson8Finish < currentTime && currentTime < lesson9Start){
            replyMessage = "8. dersin teneffüsündesin.";
        }
        else if(lesson9Start < currentTime && currentTime < lesson9Finish){
            replyMessage = "9. derstesin.";
        }
        else if(currentTime > lesson9Finish){
            replyMessage = "Bugünlük okulun bitti.";
        }
        
		await interaction.reply(replyMessage);
	},
};