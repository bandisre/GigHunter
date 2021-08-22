// $(".profile-div").fadeOut(0);
// $(".vendor-detail-wrapper").fadeOut(0);

document.addEventListener("DOMContentLoaded", event => {
    const app = firebase.app();

    const auth = firebase.auth();
    auth.onAuthStateChanged(user => {
        if (user) {
            $('.signOut').show();
            checkIfExistsorCreateProfile(user)
            getUserProfilePic(user);
        }

        else {
            $('.googleAuth').show();
        }
    })
}); 

function googleSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
}

function checkIfExistsorCreateProfile(user) {
    const db = firebase.firestore();
    const userRef = db.collection('users').doc(user.email);

    userRef.get()
        .then(doc => {
            if (doc.exists) {
                updateProfileDOM(doc);
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

function updateProfileDOM(doc) {

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
    zoom: 8,
  });
}