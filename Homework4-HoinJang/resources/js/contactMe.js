
let UserEmail = document.getElementById("email");                           //Take the email ID 

UserEmail.addEventListener("keyup",event=>{                             
    const Email = document.getElementById("email").value;                   
    const UserName = document.getElementById("username").value;

    if(Email.includes("@")){                                                // If the email has "@" 
        if(UserName == "" || UserName == null){                             // And UserName is empty or not
            var name = Email.slice(0,Email.indexOf("@"));                   // then slice such as jang0064@umn.edu -> jang0064

            document.getElementById("username").value = name;               // Putting the sliced name into the username's value
        }
    }
});  


document.getElementById("Concern_Message").style.visibility = "hidden";    // Set the Concern_Message as "hidden"
const Message = document.getElementById("Concern_Message");


document.getElementById("question").addEventListener("click",event=>{      // when the question buttion is clicked, 
                                                                           // then the message is still being hidden.
    Message.style.visibility = "hidden";
});

document.getElementById("comment").addEventListener("click", event=>{      // same as question button
    
    Message.style.visibility ="hidden";
});

document.getElementById("concern").addEventListener("click",event =>{      // when the concern button is clicked,
               
    Message.style.visibility= "visible";                                   //then the message is shown.
});





