
let dinnaken = document.getElementById("Address1");
let Stadium = document.getElementById("Address2");
let Youtube = document.getElementById("Address3");
let UmnIT = document.getElementById("Address4");
let RecCenter = document.getElementById("Address5");
let Gopher = document.getElementById("GopherPic");

/* Dinnaken mouse part*/
dinnaken.addEventListener("mouseenter",function(event){
    Gopher.src = "resources/images/Dinnaken_properties.png";
}, false);

dinnaken.addEventListener("mouseleave", function (event) {
    Gopher.src = "resources/images/gophers-mascot.png";
}, false);

/* Stadium mouse part*/
Stadium.addEventListener("mouseenter", function (event) {
    Gopher.src = "resources/images/Minnesota_football_stadium.png";
}, false);
Stadium.addEventListener("mouseleave", function (event) {
    Gopher.src = "resources/images/gophers-mascot.png";
}, false);

/* Youtube mouse part*/

Youtube.addEventListener("mouseenter", function (event) {
    Gopher.src = "resources/images/Youtube.png";
}, false);
Youtube.addEventListener("mouseleave", function (event) {
    Gopher.src = "resources/images/gophers-mascot.png";
}, false);

/* UmnIT mouse part*/

UmnIT.addEventListener("mouseenter", function (event) {
    Gopher.src = "resources/images/UmnIT.png";
}, false);
UmnIT.addEventListener("mouseleave", function (event) {
    Gopher.src = "resources/images/gophers-mascot.png";
}, false);

/* RecCenter mouse part*/

RecCenter.addEventListener("mouseenter", function (event) {
    Gopher.src = "resources/images/RecCenter.png";
}, false);
RecCenter.addEventListener("mouseleave", function (event) {
    Gopher.src = "resources/images/gophers-mascot.png";
}, false);


