let clickButton = document.querySelector("#clickButton");
let Count = document.getElementById("Count")

clickButton.addEventListener("click",function(){

    let url = "api/click";
    
    fetch(url,{
        method: "POST"
    })
    .then((response)=>response.json())
    .then((data)=>{
        console.log(data)
        console.log(data.clicks)
        Count.innerHTML = data.clicks
    }).catch(function(){
        console.log("error")
    });
    
})

setInterval(() => {
    let url = "api/click";

    fetch(url, {
        method: "GET"
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            console.log(data.clicks)

            Count.innerHTML = data.clicks
        }).catch(function () {
            console.log("error")
        });
}, 1000);


