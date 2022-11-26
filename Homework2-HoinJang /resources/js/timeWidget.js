
const resultElement = document.getElementById("TimeResult");

function timeUntil(today){
    let Days , Hours , Minutes , Seconds = 0;
    const endOfSem = new Date(2022,11,22,23,59,59);                    // the end of the semester
                                                                       // December 22nd 23:59:59
                                                                       // I just set as number 
    let difference = endOfSem - today;
    

    let diffDay = Math.floor(difference / (1000 * 60 * 60 * 24));             // 1second * 60 = 1min
                                                                              // 1min * 60 = 1hour
                                                                              // 1hour *24 = 1day
                                                                                
    let diffHour = Math.floor((difference /(1000 * 60 * 60)) % 24);
                                                                                //1second * 60 = 1min
                                                                                //1min * 60 = 1hour
                                                                                //1hour % 24 = 24hour
    let diffMin = Math.floor((difference / (1000*60))% 60);
    
                                                                                // 1second % 60 = 1min
    let diffSec = Math.floor(difference / 1000 % 60);
    
    // set Hours as diffHour -1 because of a little bit time difference
    return { Days:diffDay , Hours:diffHour-1, Minutes:diffMin, Seconds:diffSec }    
}

function ShowMessage(){
    const today = new Date();

    let {Days, Hours, Minutes, Seconds} = timeUntil(today);

    const resultElement = document.getElementById("TimeResult");
    resultElement.innerText = `${Days} Days ${Hours} Hours ${Minutes} Minutes ${Seconds} Seconds`;
    
}
ShowMessage();
setInterval(ShowMessage, 1000);

