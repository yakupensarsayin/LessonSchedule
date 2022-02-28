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

function minuteAdder(time, minsToAdd){
    var updatedTime, finalHour, finalMin;;

    var tempHours = time.slice(0,2);
    var tempMins = time.slice(3);

    var hours = parseInt(tempHours);
    var mins = parseInt(tempMins);
    var updatedMins = mins + minsToAdd;

    if(updatedMins >= 60){
        var hoursToAdd = 0;
        while(updatedMins>=60){
            updatedMins -= 60;
            hoursToAdd += 1;
        }

        var updatedHours = hours + hoursToAdd;
        if(updatedHours<10) finalHour = `0${updatedHours}`;
        else finalHour = updatedHours;

        if(updatedMins === 0) finalMin = `00`;
        else if(updatedMins < 10) finalMin = `0${updatedMins}`;
        else finalMin = `${updatedMins}`;
        
        updatedTime = `${finalHour}:${finalMin}`;
    }
    else{
        var updatedHours = hours;
        if(updatedHours<10) finalHour = `0${updatedHours}`;
        else finalHour = updatedHours;

        if(updatedMins === 0) finalMin = `00`;
        else if(updatedMins < 10) finalMin = `0${updatedMins}`;
        else finalMin = `${updatedMins}`;

        updatedTime = `${finalHour}:${finalMin}`
    }

    return updatedTime;

}
    let lessonStartTimes = [];
    let lessonFinishTimes = [];

    var firstLesson = "08:50";
    var lessonDuration = 40, breakDuration = 10;

    for(i = 0; i<9; i++){
        if(i === 0){
            breakDuration = 20;
            lessonStartTimes.push(firstLesson);
            lessonFinishTimes.push(minuteAdder(firstLesson, lessonDuration));
            i++;
        }
        else if(i === 4) breakDuration = 45;
        else if(i === 6) breakDuration = 15;
        else breakDuration = 10;

        previousLessonFinish = lessonFinishTimes[i-1];
        var thisLessonStart = minuteAdder(previousLessonFinish, breakDuration);
        var thisLessonFinish = minuteAdder(thisLessonStart, lessonDuration);
        lessonStartTimes.push(thisLessonStart);
        lessonFinishTimes.push(thisLessonFinish);
    }

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ders')
        .setDescription('Güncel ders bilgilerini verir.'),
    async execute(interaction) {

        var today = new Date();
        var hours;
        if(today.getHours() < 10) hours = `0${today.getHours()}`;
        else hours = today.getHours();
        var currentTime = `${hours} : ${today.getMinutes()}`;
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
        
        if(currentTime<lessonStartTimes[0]) whichLesson = 0;
        else if(currentTime > lessonFinishTimes[8]) whichLesson = 90;

        if(whichLesson === null){
            for(i = 0; i < 9; i++){
                if(lessonStartTimes[i] <= currentTime && currentTime < lessonFinishTimes[i]){
                    whichLesson = i+1;
                    break;
                }
            }
        }

        if(whichLesson === null){
            for(i =0; i < 9; i++){
                if(lessonFinishTimes[i] <= currentTime && currentTime < lessonStartTimes[i+1]){
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

                replyMessage = `Şu an ${whichLesson}. derstesin.\nBaşlangıç Saati: ${lessonStartTimes[whichLesson - 1]} | Bitiş Saati: ${lessonFinishTimes[whichLesson - 1]}\nÖğretmen: ${lessonTeacher} | Ders: ${lessonName}\nZoom ID: ${zoomId} | Şifre: ${passcode}`;
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
                `${whichBreak}. Ders: ${previousLessonName} - ${previousLessonTeacher} (${lessonStartTimes[whichBreak-1]} - ${lessonFinishTimes[whichBreak-1]})\nTENEFFÜS <--- Buradasın\n${whichBreak+1}. Ders: ${forthcomingLessonName} - ${forthcomingLessonTeacher} (${lessonStartTimes[whichBreak]} - ${lessonFinishTimes[whichBreak]})`;
        }
        else{
            replyMessage = "Bugünlük okul bitmiş. Yeni ders yok.";
        } 

        await interaction.reply(`${replyMessage}`);
    },
};