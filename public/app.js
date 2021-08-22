$(".profile-div").fadeOut(0);
$(".vendor-detail-wrapper").fadeOut(0);
$(".profile-div").fadeOut(0);
$(".map-page").fadeOut(0);

document.addEventListener("DOMContentLoaded", event => {
    const app = firebase.app();

    const auth = firebase.auth();
    auth.onAuthStateChanged(user => {
        if (user) {
            $('.signOut').show();
            $('.googleAuth').hide();
            checkIfExistsorCreateProfile(user)
            getUserProfilePic(user);
        }
        else {
            $('.googleAuth').show();
            $('.signOut').hide();
        }
    })
}); 

function googleSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
}

function googleSignOut() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signOut()
}

function checkIfExistsorCreateProfile(user) {
    const db = firebase.firestore();
    const userRef = db.collection('users').doc(user.email);

    userRef.get()
        .then(doc => {
            if (doc.exists) {
                var user_data = doc.data();

                $("#name-input").attr("value", user_data.userName);
                $("#phone-input").attr("value", user_data.Phone_Number);
                $("#ppl-input").attr("value", user_data.Number_of_People);
                $("#genre-input").attr("value", user_data.Genre);
                $("#desc-input").val(user_data.Description_of_act_offered);
                document.querySelector(".pf-email").innerText = user.email;
            }
            else {
                userRef.set({
                    UserID: user.uid,
                    userName: "",
                    Phone_Number: "",
                    Number_of_People: 0,
                    Genre: "",
                    Description_of_act_offered:"",
                })
            }
        })
}


function getUserProfilePic(user) {
    user.providerData.forEach(profile => {
        $('.pfp').attr('src', profile.photoURL)
    })
}

let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 12,
  });
}

document.querySelector('.save-btn').addEventListener('click', () => {
    const db = firebase.firestore();
    var user = firebase.auth().currentUser;
    db.collection('users').doc(user.email).set({
        userName: $("#name-input").val(),
        Phone_Number: $("#phone-input").val(),
        Number_of_People: parseInt($("#ppl-input").val()),
        Genre: $("#genre-input").val() ,
        Description_of_act_offered: $("#desc-input").val(),
    });
})