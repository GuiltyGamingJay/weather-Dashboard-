let history = [];
let lastCity = "";
// api key for weather data
// https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
// api key = 5e7c5fd0e653a35e32f8b138e0447fbe
let getWeather = function(city) {
    let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=5e7c5fd0e653a35e32f8b138e0447fbe&units=imperial";
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    displayWeather(data);
                });
            } else {
                alert("ERROR: " + response.statusText);
            }

        console.log(apiUrl);
        console.log("test test test");
    })
     // console.log(apiUrl);

     .catch(function(error) {
        alert("Unable to connect to OpenWeatherMap API");
    })
};

