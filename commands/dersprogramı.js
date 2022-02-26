const { SlashCommandBuilder } = require('@discordjs/builders');

const { initializeApp } = require('firebase/app');
const { getDatabase, get, ref, child } = require('firebase/database');
const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    databaseURL: process.env.databaseURL,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId,
};
initializeApp(firebaseConfig);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dersprogramı')
		.setDescription('Günlük ders programını verir.'),
	async execute(interaction) {

		var currentTime = new Date();
		var whichDay = currentTime.getDay();
		var today = currentTime.toLocaleString('tr-TR', {weekday: 'long'});
		var replyMessage = `${today} günü ders programı:\n`;
		var lessons = [];

		if(whichDay == 6){
			replyMessage = `Cumartesi günleri bot tarafından desteklenmemektedir.`;
		}
		else if(whichDay == 7){
			replyMessage = "Bugün okul bulunmamaktadır.";
		}
		else{

			// Veritabanı Bağlantısı
			const dbRef = ref(getDatabase());
			await get(child(dbRef, `LessonList/12C/${whichDay}`)).then((snapshot) => {
				if (snapshot.exists()) {
					snapshot.forEach(function(item) {
						var itemVal = item.val();
						lessons.push(itemVal);
					});
				} else {
					console.log("Veri yok.");
				}
			}).catch((error) => {
				console.error(error);
			});

			for(i=0; i<lessons.length; i++){
				replyMessage += `${i+1}. Ders - ${lessons[i]}\n`;
			}

		}

		await interaction.reply(replyMessage);
	},
};