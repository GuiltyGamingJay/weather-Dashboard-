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

let submitHandler = function(event) {
    event.preventDefault();
    let cityName = $('#cityname').val();
    if (cityName) {
        getWeather(cityName);
        // clears search input
        $('#cityname').val("");
    } else {
        alert("Error. Please enter a city name.")
    }
};



let displayWeather = function(weatherData) {

    $("#main-city-name").text(weatherData.name + " (" + dayjs(weatherData.dt * 1000).format("MM/DD/YYYY") + ") ").append(`<img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png"></img>`);

    $("#main-city-temp").text("Temperature: " + weatherData.main.temp.toFixed(1) + " f");
    $("#main-city-humid").text("Humidity: " + weatherData.main.humidity + "%");
    $("#main-city-wind").text("Wind Speed: " + weatherData.wind.speed.toFixed(1) + " mph");

    fetch("https://api.openweathermap.org/data/2.5/uvi?lat=" + weatherData.coord.lat + "&lon="+ weatherData.coord.lon + "&appid=5e7c5fd0e653a35e32f8b138e0447fbe")
        .then(function(response) {
            response.json().then(function(data) {
                $("#uv-box").text(data.value);
            })
        });

    fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + weatherData.name + "&appid=5e7c5fd0e653a35e32f8b138e0447fbe&units=imperial")
        .then(function(response) {
            response.json().then(function(data) {
              
                $('#five-day').empty();
           
                for (i = 7; i <= data.list.length; i += 8) {
                    let fDayCard =`
                    <div class="col-md-2 m-2 py-3 card text-white bg-primary">
                        <div class="card-body p-1">
                            <h5 class="card-title">` + dayjs(data.list[i].dt * 1000).format("MM/DD/YYYY") + `</h5>
                            <img src="https://openweathermap.org/img/wn/` + data.list[i].weather[0].icon + `.png" alt="rain">
                            <p class="card-text">Temp: ` + data.list[i].main.temp.toFixed(1) + `</p>
                            <p class="card-text">Humidity: ` + data.list[i].main.humidity + `</p>
                        </div>
                    </div>
                    `;

                    $('#five-day').append(fDayCard);
                }
            })
    });

    lastCity = weatherData.name;
    saveSearchHistory(weatherData.name);
};


let saveSearchHistory = function (city) {
    
    if (!history.includes(city)) {
        history.push(city);

        $('#search-history').append("<a href='#' class='list-group-item list-group-item-action' id='" + city + "'>" + city + "</a>");
    }
    localStorage.setItem('weatherSearchHistory', JSON.stringify(history));
    localStorage.setItem('lastCity', JSON.stringify(lastCity));
    loadSearchHistory();
};


let loadSearchHistory = function() {
    history = JSON.parse(localStorage.getItem('weatherSearchHistory'));
    lastCity = JSON.parse(localStorage.getItem('lastCity'));
    
    if (!history) {
        history = []
    } if (!lastCity) {
        lastCity = ""
    }

    $('#search-history').empty();

    for (i=0; i < history.length; i++) {
        $("#search-history").append("<a href='#' class='list-group-item list-group-item-action' id='" + history[i] + "'>" + history[i] + "</a>");
    }
};

loadSearchHistory();

if (lastCity != "") {
    getWeather(lastCity);
}

$('#search-form').submit(submitHandler);


$('#search-history').on('click', function(event) {
    let previousCity = $(event.target).closest("a").attr("id");
    getWeather(previousCity);
});