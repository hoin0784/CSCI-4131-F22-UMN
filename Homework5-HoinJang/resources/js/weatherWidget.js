
function getWeather() {
      /***************************************************************** */
          /* To show the output, we need all these id */
      let latitude = document.getElementById("latitude-input").value      
      let longitude = document.getElementById("longitude-input").value    

      let temp_display = document.getElementById("temp-display")          
      let sunrise_display = document.getElementById("sunrise-display")
      let sunset_display = document.getElementById("sunset-display")
      let weatherOutput = document.getElementById("weatherOutput")
      /***************************************************************** */                               // This code does the fetch with the forecast

      let SunURL = "https://api.sunrise-sunset.org/json";                                                 // Base URL of sunrise-sunset 
      SunURL +="?lat="+latitude+"&lng="+longitude+"&formatted=0";       
      
      let ForecastURL = "https://api.open-meteo.com/v1/forecast";                                         // Base URL of ForecastURL
      ForecastURL += "?latitude="+latitude+"&longitude="+longitude+"&current_weather=true&temperature_unit=fahrenheit&winspeed_unit=ms&timezone=America%2FChicago";

     
      fetch(ForecastURL)                                                                                  // fetch do: A method that allows us to send a network request 
      .then(response => response.json())                                                                  // to a server and receive a response.
      .then(data=>{
        console.log(data);

        let current_weather = WEATHER_CODES[data.current_weather.weathercode]                             // Get the weather code from the data and set to the current_weather

        let temperature = data.current_weather.temperature;                                               // Get the temperature from the json data 
        temp_display.innerHTML ="Temperature: " +temperature + " Degrees F<br>" +"<br>"+current_weather;  // output from the weather widget
        
  })

      /******************************************************************* */                             // This code does the fetch with the sunrise and sunset
      .catch(error=>console.log(error));

       fetch(SunURL)                                                                                      // Do the same work as forecast until the line 42
      .then(response => response.json())  //Get the json type
      .then(data => {
        console.log(data)
        
        let temp = data.results; 
        let temp1 = temp.sunrise;
        let temp2 = temp.sunset;

        todaySunrise = new Date(temp1);                                                                   // This will decode a string in many standard formats 
                                                                                                          // including ISO 8061
        todaySunSet = new Date(temp2);

        todaySunrise = todaySunrise.toLocaleTimeString();                                                 // This will create a readable string in the local time zone for the 
        todaySunSet = todaySunSet.toLocaleTimeString();                                                   // time indicated by a date object

        sunrise_display.innerHTML = "Sunrise: " + todaySunrise;                                           // Output from the Sunrise
        sunset_display.innerHTML = "Sunset: "+ todaySunSet;                                               // Output from the Sunset
  })
      .catch(error=>console.log(error));
}

// "borrowed" from MDN's geolocation API example

function geoFindMe() {

    console.log("calling geofindme");                                                                     //Output from console ("calling geofind me")
    const status = document.querySelector('#weatherStatus');    
    
    function success(position) {
        let latitude = position.coords.latitude;                          
        let longitude = position.coords.longitude;                        
        const latitude_input = document.querySelector("#latitude-input");
        const longitude_input = document.querySelector("#longitude-input");

        longitude_input.value = longitude;
        latitude_input.value = latitude;
        console.log(`${latitude}, ${longitude}`);                                                         //Output from console ("my latitude", my longitude)
        status.textContent = "";
    }
    /* If the error is occured then, */
    function error() {
      status.textContent = 'Unable to retrieve your location';
    }

    /* This part is finding the navigation part */
    /* Use the gps */
    if (!navigator.geolocation) {                       
      status.textContent = 'Geolocation is not supported by your browser';
    } else {
      status.textContent = 'Locating…';
      navigator.geolocation.getCurrentPosition(success, error);
    }
}


WEATHER_CODES = {
0:  'Clear sky',
1:  'Mainly clear',
2:  'Partly cloudy',
3:  'Overcast',     
45: 'Fog',
48: 'Depositing Rime fog',
51: 'Light Drizzle',
53: 'Moderate Drizzle',
55: 'Dense Drizzle',
57: 'Light Freezing Drizzle',
57: 'Dense Freezing Drizzle',
61: 'Slight Rain',
63: 'Moderate Rain',
65: 'Heavy Rain',
66: 'Light Freezing Rain',
67: 'Heavy Freezing Rain',
71: 'Slight Snow fall',
73: 'Moderate Snow fall',
75: 'Heavy Snow fall',
77: 'Snow grains',
80: 'Slight Rain showers',
81: 'Moderate Rain showers',
82: 'Violent Rain showers',
85: 'Slight Snow showers slight and heavy',
86: 'Heavy Snow showers slight and heavy',
95: 'Thunderstorm',
96: 'Thunderstorm with slight hail',
99: 'Thunderstorm with heavy hail',
}

/* buttom from Auto-Find me */
document.querySelector('#find-me').addEventListener('click', geoFindMe);
/* button from Find the weather */
document.querySelector("#get-weather-btn").addEventListener('click', getWeather);


 