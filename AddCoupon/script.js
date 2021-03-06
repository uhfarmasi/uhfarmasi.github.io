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

var auth = firebase.auth();
var db = firebase.firestore();

function LoginWithEmailAndPassword(){
    var email = document.getElementById('email').value || "";
    var password = document.getElementById('password').value || "";
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(user=>{console.log(user);})
    .catch(function(error) {alert('email atau password salah');});
}

auth.onAuthStateChanged(function(user) {
    if (user) {
        hideLoginForm();
    } else {
        showLoginForm();
    }
});

function hideLoginForm(){
    loginForm.style.display = 'none';
    preform.style.display = 'block';
}

function showLoginForm(){
    loginForm.style.display = 'block';
    preform.style.display = 'none';
}

function makeCoupon(length) {
    var result           = '';
    var characters       = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function SignOut(event){
    firebase.auth().signOut().then(function() {
        console.log('Signed Out');
    }, function(error) {
        console.error('Sign Out Error', error);
    });
}