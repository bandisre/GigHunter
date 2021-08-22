$(".profile-div").fadeOut(0);
$(".vendor-detail-wrapper").fadeOut(0);
$(".profile-div").fadeOut(0);
$(".map-page").fadeOut(0);
$(".create-div").fadeOut(0);
$(".email-svg").hide();
$(".phone-svg").hide();

const Locations = [];


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
    getVendors()
}); 

async function getVendors() {
    const vendLoc = [];
    await firebase.firestore().collection('vendors').get()
      .then(querySnapshot => {
        querySnapshot.docs.forEach(doc => {
        vendLoc.push(doc.data());
      });
    });
    for (var i = 0; i < vendLoc.length; i++){
      var Location = vendLoc[i].Location;
      Locations.push(Location);
    }
    return vendLoc;
  }

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


function initMap(Location, Range) {
    var Gigs = [];

    const service = new google.maps.DistanceMatrixService(); // instantiate Distance Matrix servic
    var origin1 = Location;
    for (var i = 0; i < Locations.length; i++){
      var destination1 = Locations[i];
      const matrixOptions = {
        origins: [origin1], // technician locations
        destinations: [destination1], // customer address
        travelMode: 'DRIVING',
        unitSystem: google.maps.UnitSystem.METRIC
      };
      // Call Distance Matrix service
      service.getDistanceMatrix(matrixOptions, callback);

      // Callback function used to process Distance Matrix response
      function callback(response, status) {
        if (status === 'OK') {
            var origins = response.originAddresses;
            var destinations = response.destinationAddresses;
            for (var i = 0; i < origins.length; i++) {
                var results = response.rows[i].elements;
                for (var j = 0; j < results.length; j++) {
                var element = results[j];
                var distance = element.distance.text;
                var from = origins[i];
                var to = destinations[j];
              
                if (parseFloat(distance) < Range) {
                    Gigs.push(to);
                }
            }
          }
        }
      }
    }

    return Gigs;
}


async function createEntries(Gigs) {
    const db = firebase.firestore();
    if (Gigs) {
        document.querySelector('.results').innerText = (Gigs.length) + " Results";
    }
  
    for (var i = 0; i < Gigs.length; i++) {
        setTimeout(() => {})
        var address = Gigs[i];
        var vendLoc = [];
        await db.collection('vendors').get()
        .then(querySnapshot => {
          querySnapshot.docs.forEach(doc => {
          vendLoc.push(doc.data());
        })});
        console.log(vendLoc);
        console.log(Gigs)   
        for (var i = 0; i < vendLoc.length ; i++) {
            for (var j = 0; j < Gigs.length; j++) {
                if (Gigs[j].includes(vendLoc[i].Location)) {
                    console.log('works')
                    $('.results-container').append(`
                    <div class='result-entry'>
                    <img class='result-img' src='https://images.unsplash.com/photo-1524230659092-07f99a75c013?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80'>
                    <h1 class='vendor-name'>${vendLoc[i].vendorName}</h1>
                    <h3 class='location'>${vendLoc[i].Location}</h3>
                        </div>`)
                          
                }
            }

           
             }

        }

    fillDetails();
}

function fillDetails() {
    var elements = document.getElementsByClassName('result-entry');
    Array.from(elements).forEach((elem) => {
        elem.addEventListener('click', () => {
            console.log('works')
            $(".email-svg").show();
            $(".phone-svg").show();
            document.querySelector('.details-title').innerText = "Squidward Tentacles";
            document.querySelector('.details-location').innerText = "100 Queens Park, Toronto, ON ";
            document.querySelector('.phone-number').innerText = "365-776-7202";
            document.querySelector('.email').innerText = "squidward@gmail.com";
            document.querySelector('.vendor-desc').innerText = "Looking for Jazz fingerstyle guitarist. Drummers also welcome and drums and PA system provided in-house."
        })
    })
}


document.querySelector('#create').addEventListener('click', () => {
    console.log('works')    
    const db = firebase.firestore();
    db.collection('vendors').doc(document.querySelector('#name-input-vendor').value).set({
        vendorName: document.querySelector('#name-input-vendor').value,
        Location: document.querySelector('#location-input-vendor').value,
        Phone_Number: document.querySelector('#phone-input-vendor').value,
        Stage_Details: document.querySelector('#stg-input-vendor').value,
        Email: document.querySelector('#email-input-vendor').value,
    }).then(data => {
        document.querySelector('#name-input-vendor').value = "";
        document.querySelector('#location-input-vendor').value = "";
        document.querySelector('#phone-input-vendor').value = "";
        document.querySelector('#stg-input-vendor').value = "";
        document.querySelector('#email-input-vendor').value = "";
    });
})


function addEvent() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 12,
      });
    document.querySelector('.search-button').addEventListener('click', () => {
        var address = document.querySelector('.location-input').value;
        var range = parseInt(document.querySelector('.distance-input').value)
        var Gigs = initMap(address, range);
        setTimeout(() => {
            createEntries(Gigs);
        }, 1000);
    })
}
