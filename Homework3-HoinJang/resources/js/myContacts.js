
let dinnaken = document.getElementById("ThirdRow")
let Stadium = document.getElementById("SecondRow")
let Youtube = document.getElementById("FourthRow")
let UmnIT = document.getElementById("FifthRow")
let RecCenter = document.getElementById("SixthRow")
let Gopher = document.getElementById("GopherPic")

/* Dinnaken mouse part*/
dinnaken.addEventListener("mouseenter", function (event) {
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

/* Sort Table part */

function sortTable(n) {                                                     //Name sort
    if(n === 1){                                                            //When the n is 1 then sort name part table.
        
        let table = document.getElementById("myContactsTable");              //Take the id of the table
        let rows = document.getElementById("myContactsTable").rows;          //Take the rows of the table

        let NameList = [];                                          

        //use push function
        for (let i = 0; i <= 4; i++) {                                      
            NameList[i] = table.rows[i+1]
        }

        NameList.sort((a, b) => {                                             //Sort orders of Namelist
            if (a.innerText > b.innerText) {
                return 1
            } else if (a.innerText < b.innerText) {
                return -1
            } else {
                return 0
            }
        });
        
        for(let i = 0; i<= 4; i++){
            table.appendChild(NameList[i]);
        }
    }

    /* ******************************************************************** */

    if (n === 2) {                                                            //When the n is 2 then sort email part table.
        let table = document.getElementById("myContactsTable");               //Take the id of the table
        let rows = table.getElementsByTagName("tr");                          //Take the tr of the table

        let EmailList = []
  
       for(let i = 0; i<=4; i++){
           EmailList[i] = table.rows[i+1]              
       }
       
        EmailList.sort((a, b) => {
            if (a.cells[3].innerText > b.cells[3].innerText) {                 //Sort orders of emaillist
                return 1                                       
            } else if (a.cells[3].innerText < b.cells[3].innerText) {
                return -1
            } else {
                return 0
            }
        });
        for (let i = 0; i <= 4; i++) {
            table.appendChild(EmailList[i]);
        }
    }
}
