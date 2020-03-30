var NAME;
var NIM;
var DOC_ID;
var startTime;
var coupon;
var inputName = document.getElementById('input-name');
var inputNim = document.getElementById('input-nim');
var inputCoupon = document.getElementById('input-coupon');
var questionContainer = document.querySelector('.question-container');
var testFinish = document.querySelector('.test-finish');
var startButton = document.querySelector('.start-button');
var sisaWaktuField = document.getElementById('sisaWaktuField');
var questionNumberField = document.getElementById('question-number');
var questionText = document.getElementById('question-text');
var preform = document.getElementById('preform');
var loadingDialog = document.getElementById('loading-dialog');
var loadingMessage = document.getElementById('loadingMessage');
var answerButton = document.getElementById('answerButton');
var answerInput = document.getElementById('answerInput');


var firebaseConfig = {
    apiKey: "AIzaSyDHbA7lH3G9WDRfNwif5TGFoTFKBNnorMk",
    authDomain: "ronsovia.firebaseapp.com",
    databaseURL: "https://ronsovia.firebaseio.com",
    projectId: "ronsovia",
    storageBucket: "ronsovia.appspot.com",
    messagingSenderId: "3493120467",
    appId: "1:3493120467:web:6af3204f6ff10d73b14726"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();


function saveToFirestore(){
    etiket_testRef.doc(DOC_ID).set({
        name: NAME,
        coupon: coupon,
        startTime: startTime
    })
    .then(function(docRef) {console.log("Document written with ID: ");})
    .catch(function(error) {console.error("Error adding document: ", error);});
}

function saveFinishTime(){
    etiket_testRef.doc(DOC_ID).update({
        finishTime: new Date()
    })
    .then(function(docRef) {console.log("Document written with ID: ");})
    .catch(function(error) {console.error("Error adding document: ");});
}

function saveCurrentQuestionToFirestore(){
    let updatedData = {};
    updatedData[`finish_soal_${currentQuestion}`] = new Date();

    etiket_testRef.doc(DOC_ID).update(updatedData)
    .then(function(docRef) {console.log("Document written with ID: ");})
    .catch(function(error) {console.error("Error adding document: ");});
}

function StartTest(){
    showLoadingDialog();
    NAME = inputName.value.trim();
    NIM = inputNim.value.trim();
    startTime = new Date();
    coupon = inputCoupon.value.trim();
    DOC_ID = `${NIM}-${coupon}`;

    if(!isValid(NAME,NIM, coupon)){
        hideLoadingDialog();
        return true;
    }

    couponRef.doc(coupon).get()
    .then(function(doc) {
        if (doc.exists) {
            console.log('Kupon VALID');
            questionContainer.classList.remove('hidden');
            startButton.classList.add('hidden');
            preform.classList.add('hidden');
            stopwatch = setInterval(UpdateSisaWaktu, 1000);

            ChangeQuestion();
            saveToFirestore();
        } else {
            alert(`Kupon '${coupon}' tidak valid`);
            hideLoadingDialog();
            return true;
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
        alert('Terdapat masalah koneksi. Silahkan refresh halaman ini untuk mencoba kembali');
    });
}

function ChangeQuestion(){
    showLoadingDialog();
    //Check Local Storage to see if the question is already answered
    let sisaWaktuStorage = localStorage.getItem(`${TEST_ID}_${currentQuestion}`);
    while(sisaWaktuStorage == 'DONE' && currentQuestion < questions.length){
        currentQuestion += 1;
        sisaWaktuStorage = localStorage.getItem(`${TEST_ID}_${currentQuestion}`);
    }
    // sisaWaktu = tempo;
    sisaWaktu =  parseInt(sisaWaktuStorage) > -1 ? sisaWaktuStorage : tempo;

    questionNumberField.innerHTML = `<h1>${currentQuestion+1}</h1>`;

    if(currentQuestion < questions.length){
        questionText.innerHTML = questions[currentQuestion];
        isRunning = true;
        hideLoadingDialog();
        // currentQuestion += 1;
    }else{
        clearInterval(stopwatch);
        questionContainer.classList.add('hidden');
        testFinish.classList.remove('hidden');

        hideLoadingDialog();
        cleanStorage();
        saveFinishTime();
        deleteCoupon(coupon);
    }
}

function UpdateSisaWaktu(){
    if(sisaWaktu < 0){
        moveToNextQuestion();
    }

    if(isRunning){
        sisaWaktu -= 1;
        if(sisaWaktu>-1) sisaWaktuField.innerHTML = sisaWaktu;
        localStorage.setItem(`${TEST_ID}_${currentQuestion}`, sisaWaktu);
    }
}

function deleteCoupon(kupon){
    couponRef.doc(kupon).delete().then(function() {
        console.log("Document successfully deleted!");
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
}

async function sendAnswer(){
    showLoadingDialog('Sedang mengirim jawaban ...');
    let answer = {name: NAME, nim: NIM};
    answer[`soal_${currentQuestion+1}`] = answerInput.value;
    try{
        await answerRef.doc(DOC_ID).set(answer, {merge: true});
        moveToNextQuestion();
    }catch(error){
        alert('Gagal mengirim jawaban. Pastikan anda terhubung internet');
    }
    hideLoadingDialog();
}

function moveToNextQuestion(){
    localStorage.setItem(`${TEST_ID}_${currentQuestion}`, 'DONE');
    answerInput.value = '';
    saveCurrentQuestionToFirestore();
    ChangeQuestion();
    isRunning = false;
}

function isValid(name, nim, kupon){
    if(kupon.length < 3){
        alert('Masukkan kupon dengan benar');
        return false;
    }
    if(name.length < 2){
        alert('Masukkan nama lengkap anda');
        return false;
    }
    if(nim.length < 2){
        alert('Masukkan NPM anda');
        return false;
    }
    return true;
}

function showLoadingDialog(message){
    loadingDialog.style.display = 'flex';
    loadingMessage.innerHTML = message || 'Loading...';
}

function hideLoadingDialog(){
    loadingDialog.style.display = 'none';
}

function cleanStorage(){
    for(let i=0; i<questions.length; i++){
        localStorage.setItem(`${TEST_ID}_${i}`, '');
    }
    localStorage.clear();
}

const Download = function(filename, data) {
    var blob = new Blob([data], {type: 'text/csv'});
    if(window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    }
    else{
        var elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;        
        document.body.appendChild(elem);
        elem.click();        
        document.body.removeChild(elem);
    }
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
};

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
};