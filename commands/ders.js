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
        var whichDay = today.getDay();
        var whichLesson = null;

        switch (whichDay) {
            case 6:
                await interaction.reply(`Cumartesi günleri bot tarafından desteklenmemektedir.`);
                return;
            case 0:
                await interaction.reply(`Pazar günü okul bulunmamaktadır.`);
                return;
        }

        // Zamana bakarak kullanıcın hangi ders içerisinde olduğuna bağlı olarak ona bir sayı atıyor.
        // Atanan sayılar eğer 10'dan küçükse, bu kullanıcının hangi derste bulunduğunun gerçek değeri.
        // Eğer tenefüsteyse bulunduğu hangi dersin teneffüsündeyse o dersin gerçek değerinin 10 katını alıyor.
        // Örnek1: 6. dersteyse whichLesson = 6;
        // Örnek2: 6. dersin teneffüsündeyse, yani 7. derse girecekse, whichLesson = 60;
        // whichLesson = 40 (Öğle teneffüsü) | whichLesson = 90 (Okul bitti)
        
        switch(currentTime){
            case currentTime < lesson1Start:
                whichLesson = 0;
                break;
            case currentTime > lesson9Finish:
                whichLesson = 90;
                break;
        }

        if(whichLesson === null){
            for(i = 0; i < 9; i++){
                if(lessonStartingTimesArray[i] <= currentTime && currentTime < lessonFinishingTimesArray[i]){
                    whichLesson = i+1;
                    break;
                }
            }
        }

        if(whichLesson === null){
            for(i =0; i < 9; i++){
                if(lessonFinishingTimesArray[i] <= currentTime && currentTime < lessonStartingTimesArray[i+1]){
                    whichLesson = (i+1) * 10;
                    break;
                }
            } 
        }

        var replyMessage;

        if(whichLesson < 0){
            replyMessage = "Bugün daha okul başlamadı. 08:50'de yine gel.";
        }
        else if(whichLesson != 0 && whichLesson < 10){
            var lessonTeacher, lessonName, zoomId, passcode;

                // Veritabanı bağlantısı 
                const dbRef = ref(getDatabase());
                await get(child(dbRef, `Lessons/12C/${whichDay}/${whichLesson}`)).then((snapshot) => {
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

                // Örnek replyMessage:
                // Şu an 4. derstesin.
                // Başlangıç Saati: 11:30 | Bitiş Saati: 12:10
                // Öğretmen: Bjarne Stroustrup | Ders: Arrays in C++
                // Zoom ID: 111 222 3344 | Şifre: I<3Coding

                replyMessage = `Şu an ${whichLesson}. derstesin.\nBaşlangıç Saati: ${lessonStartingTimesArray[whichLesson - 1]} | Bitiş Saati: ${lessonFinishingTimesArray[whichLesson - 1]}\nÖğretmen: ${lessonTeacher} | Ders: ${lessonName}\nZoom ID: ${zoomId} | Şifre: ${passcode}`;
        }
        else if(whichLesson<90 && whichLesson > 10){
                var whichBreak = whichLesson/10;
                var previousLessonName, previousLessonTeacher, forthcomingLessonName, forthcomingLessonTeacher;

                // Veritabanı bağlantısı 
                const dbRef = ref(getDatabase());
                await get(child(dbRef, `Lessons/12C/${whichDay}/${whichBreak}`)).then((snapshot) => {
                    if (snapshot.exists()) {
                        previousLessonTeacher = snapshot.val().lessonTeacher;
                        previousLessonName = snapshot.val().lessonName;
                    } else {
                        console.log("Veri yok.");
                    }
                }).catch((error) => {
                    console.error(error);
                });

                await get(child(dbRef, `Lessons/12C/${whichDay}/${whichBreak+1}`)).then((snapshot) => {
                    if (snapshot.exists()) {
                        forthcomingLessonTeacher = snapshot.val().lessonTeacher;
                        forthcomingLessonName = snapshot.val().lessonName;
                    } else {
                        console.log("Veri yok.");
                    }
                }).catch((error) => {
                    console.error(error);
                });

                // Örnek replyMessage:
                // 1. Ders: AYT Matematik - Sal Khan (08:50 - 9:30)
                // TENEFFÜS <-- Buradasın
                // 2. Ders: AYT Matematik - Sal Khan (9:50 - 10:30)

                replyMessage = 
                `${whichBreak}. Ders: ${previousLessonName} - ${previousLessonTeacher} (${lessonStartingTimesArray[whichBreak-1]} - ${lessonFinishingTimesArray[whichBreak-1]})\nTENEFFÜS <--- Buradasın\n${whichBreak+1}. Ders: ${forthcomingLessonName} - ${forthcomingLessonTeacher} (${lessonStartingTimesArray[whichBreak]} - ${lessonFinishingTimesArray[whichBreak]})`;
        }
        else{
            replyMessage = "Bugünlük okul bitmiş. Yeni ders yok.";
        } 

        await interaction.reply(`${replyMessage}`);
    },
};