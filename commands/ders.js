const { SlashCommandBuilder } = require('@discordjs/builders');

const firebase = require('firebase/app');
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
firebase.initializeApp(firebaseConfig);

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

    let lessonStartingTimesArray = [lesson1Start, lesson2Start, lesson3Start, lesson4Start, lesson5Start, lesson6Start, lesson7Start, lesson8Start, lesson9Start];
    let lessonFinishingTimesArray = [lesson1Finish, lesson2Finish, lesson3Finish, lesson4Finish, lesson5Finish, lesson6Finish, lesson7Finish, lesson8Finish, lesson9Finish];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ders')
        .setDescription('Güncel ders bilgilerini verir.'),
    async execute(interaction) {
        var today = new Date();
        var currentTime = `${today.getHours()} : ${today.getMinutes()}`;
        var whichDayUserIsIn = today.getDay();
        var whichLessonUserIsIn = 0;
        var howManyMinutesUntilTheEndOfTheClass;

        switch (whichDayUserIsIn) {
            case 6:
                await interaction.reply(`Cumartesi günleri bot tarafından desteklenmemektedir.`);
                return;
            case 7:
                await interaction.reply(`Bugün okul bulunmamaktadır.`);
                return;
        }

        // Zamana bakarak kullanıcın hangi ders içerisinde olduğuna bağlı olarak ona bir sayı atıyor.
        // Atanan sayılar eğer 10'dan küçükse, bu kullanıcının hangi derste bulunduğunun gerçek değeri.
        // Eğer tenefüsteyse bulunduğu hangi dersin teneffüsündeyse o dersin gerçek değerinin 10 katını alıyor.
        // Örnek1: 6. dersteyse whichLessonUserIsIn = 6;
        // Örnek2: 6. dersin teneffüsündeyse, yani 7. derse girecekse, whichLessonUserIsIn = 60;
        // whichLessonUserIsIn = 40 (Öğle teneffüsü) | whichLessonUserIsIn = 90 (Okul bitti)

        if (currentTime < lesson1Start) {
            whichLessonUserIsIn = 0;
        }
        else if (lesson1Start < currentTime && currentTime < lesson1Finish) {
            whichLessonUserIsIn = 1;
        }
        else if (lesson1Finish < currentTime && currentTime < lesson2Start) {
            whichLessonUserIsIn = 10;
        }
        else if (lesson2Start < currentTime && currentTime < lesson2Finish) {
            whichLessonUserIsIn = 2;
        }
        else if (lesson2Finish < currentTime && currentTime < lesson3Start) {
            whichLessonUserIsIn = 20;
        }
        else if (lesson3Start < currentTime && currentTime < lesson3Finish) {
            whichLessonUserIsIn = 3;
        }
        else if (lesson3Finish < currentTime && currentTime < lesson4Start) {
            whichLessonUserIsIn = 30;
        }

        else if (lesson4Start < currentTime && currentTime < lesson4Finish) {
            whichLessonUserIsIn = 4;
        }
        else if (lesson4Finish < currentTime && currentTime < lesson5Start) {
            whichLessonUserIsIn = 40; // Öğle teneffüsü
        }
        else if (lesson5Start < currentTime && currentTime < lesson5Finish) {
            whichLessonUserIsIn = 5;
        }
        else if (lesson5Finish < currentTime && currentTime < lesson6Start) {
            whichLessonUserIsIn = 50;
        }
        else if (lesson6Start < currentTime && currentTime < lesson6Finish) {
            whichLessonUserIsIn = 6;
        }
        else if (lesson6Finish < currentTime && currentTime < lesson7Start) {
            whichLessonUserIsIn = 60;
        }

        else if (lesson7Start < currentTime && currentTime < lesson7Finish) {
            whichLessonUserIsIn = 7;
        }
        else if (lesson7Finish < currentTime && currentTime < lesson8Start) {
            whichLessonUserIsIn = 70;
        }
        else if (lesson8Start < currentTime && currentTime < lesson8Finish) {
            whichLessonUserIsIn = 8;
        }
        else if (lesson8Finish < currentTime && currentTime < lesson9Start) {
            whichLessonUserIsIn = 80;
        }
        else if (lesson9Start < currentTime && currentTime < lesson9Finish) {
            whichLessonUserIsIn = 9;
        }
        else if (currentTime > lesson9Finish) {
            whichLessonUserIsIn = 90; // Okul bitmiş
        }

        /* switch(whichLessonUserIsIn){
            case whichLessonUserIsIn > 10:

                break;
        } */

        var replyMessage, lessonTeacher, lessonName, zoomId, passcode;

        const dbRef = ref(getDatabase());
        await get(child(dbRef, `Lessons/12C/5/8`)).then((snapshot) => {
            if (snapshot.exists()) {
                lessonTeacher = snapshot.val().lessonTeacher;
                lessonName = snapshot.val().lessonName;
                zoomId = snapshot.val().zoomId;
                passcode = snapshot.val().passcode;
            } else {
                console.log("Veri yok.");
            }
        }).catch((error) => {
            console.error(error);
        });

        replyMessage = `Şu an ${whichLessonUserIsIn}. derstesin.
Başlangıç Saati: ${lessonStartingTimesArray[whichLessonUserIsIn-1]} | Bitiş Saati: ${lessonFinishingTimesArray[whichLessonUserIsIn-1]}
Öğretmen: ${lessonTeacher} | Ders: ${lessonName}
Zoom ID: ${zoomId} | Şifre: ${passcode}`;

        for(let i = 0; i<10; i++){
            console.log(lessonStartingTimesArray[i]);
        }

        await interaction.reply(`${replyMessage}`);
    },
};