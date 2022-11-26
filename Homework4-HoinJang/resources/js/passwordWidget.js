// TODO: Based on the rules here, return an object with a properties `className` and `message`
//
// - A password with length less than 6 has `message` 'Short' and `className` 'short'
//
// Otherwise, we assign the password a score representing its strength. The
// score starts at 0 and will be incremented by one for each of the following
// conditions the password satisfies:
//
// - The password has length longer than 7
// - The password has at least one capital and lowercase letter
// - The password has at least one letter and at least one number
// - The password contains at two or more symbols
//
// We define symbols to be the following characters:
//    '!', '%', '&', '@', '#', '$', '^', '*', '?', '_', '~'
//
// Based on the value from the rules above, return the object with the correct
// values from the corresponding table:
//
// | Score | Class Name | Message         |
// |-------+------------+-----------------|
// | s < 2 | weak       | Weak Password   |
// | s = 2 | good       | Good Password   |
// | s > 2 | strong     | Strong Password |


function checkStrength(password) {

  let message,className;
  let score = 0;
                                                         // Password Strength 1 : The password has length longer than 7 (over 8)
  let pattern2   = "^(?=.*[a-z])(?=.*[A-Z])";            // Password Strength 2 : At least one capital and lowerCase
  let pattern3 = "^(?=.*[a-zA-Z])(?=.*[0-9])";           // Password Strength 3 : The password has at least one letter and at least one number
  let pattern4 = ".*[!%&@#$^*?_~].*[!%&@#$^*?_~].*";     // password Strength 4 : The password contains at two or more symbols
      
      if(password.length < 6){
        
        console.log("length is not enough");
        return { message: "Short", className: "short" };
        //score is already set to 0
      }
      else{
        
        score++;                                          // count score++ because the length is greater than 7
        if ((password.search(pattern2) !== -1)){
            score++;
        }
        if ((password.search(pattern3)) !== -1 ){
            score++;
        }
        if ((password.search(pattern4) !== -1)){
            score++;
        }
      }
    
    // Use switch for returning the message and class Name by score
  switch(score){
    // when the score number is 0
    case 0: 
      return { message : "Short", className : "short" };
      break;
    // when the score number is 1
    case 1:
      return { message: "Weak Password", className: "weak"};
      break;
    
    // when the score number is 2
    case 2:
      return { message: "Good Password", className: "good"};
      break;
    // when the score number is 3
    case 3: 
      return { message: "Strong Password", className: "strong"};
      break;
    // when the score number is 4
    case 4:
      return { message: "Strong Password", className: "strong"};
      break;
  } 
}

// You do not need to change this function. You may want to read it -- as you will find parts of it helpful with
// the countdown widget.
function showResult(password) {

  const { message, className } = checkStrength(password);

  if(!message || !className) {
    console.error("Found undefined message or className");
    console.log("message is", message);
    console.log("className is", className);
  }

  // This gets a javascript object that represents the <span id="pwdresult"></span> element
  // Using this javascript object we can manipulate the HTML span by
  // changing it's class and text content
  
  const resultElement = document.getElementById("pwdresult");

  // This sets the class to one specific element (since you can have multiple classes it's a list)
  resultElement.classList = [className];
  // This sets the text inside the span
  resultElement.innerText = message;
}

// Add a listener for the strength checking widget
function addPasswordListener() {
  let passwordEntry = document.getElementById('password');
  passwordEntry.addEventListener("keyup", () => {
    const password = passwordEntry.value;
    showResult(password);
  });
}

addPasswordListener();
