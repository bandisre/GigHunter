# GigHunter - Developed at Hack the 6ix

A platform designed to connect local vendors with gigging musicians.

## The Inspiration

As a musician myself, finding a gig with my band has always been an arduous task. Local vendors seldom advertise open mics or opportunities to perform. In response, we created GigHunter where vendors can post performance opportunities to connect with musicians within the area. Musicians can search for opportunities by inputting their zip code and the distance they're willing to travel. Then, the firebase backend uses Google Map APIs to display gigs within the inputted distance.

Built using:
- Vanilla Javascript
- Firebase backend
- Google Map APIs

## Challenges

The biggest challenge we ran into was integrating the Google Map APIs with our backend. The API documentation was very vague so we kept getting obscure bugs that took up a lot of our time to troubleshoot. Developing a cohesive frontend was also difficult as due to our limited experience in JavaScript, we weren't able to make use of frontend libraries/frameworks such as Angular or React — we had to resort to juggling overlaid divs. 

## Future Goals

Currently, this project is still under development. Our future goal is to restructure the frontend using React.js, and to redevelop the backend using a Flask framework and a MongoDB Atlas Cluster. 
