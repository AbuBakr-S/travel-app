// Geonames API call
const baseURL = 'http://api.geonames.org/search?name='; 
const apiKey = '&maxRows=1&type=json&username=as20';   

// Weatherbit API call
let currentWeatherBaseURL = new URL ('http://api.weatherbit.io/v2.0/current');
let forecastWeatherBaseURL = new URL ('http://api.weatherbit.io/v2.0/forecast/daily'); // Example: http://api.weatherbit.io/v2.0/forecast/daily?lat=51.509865&lon=-0.118092&key=8fcdb754804e4825afbd72eb47d12818

// Countdown Tracker
let withinAWeek;

// Set Minimum Date on Date Picker to Present Day
(() => {
    // Set Min Departure Date on Calendar
    const date = new Date();

    const year = date.getFullYear();
    console.log(year);

    const month = date.getMonth() + 1;
    console.log(month + 1);

    const dateNum = date.getDate();
    console.log(dateNum);

    // Set Max Departure Date on Calendar
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 16);

    // So you can see the date we have created
    console.log(futureDate);

    const date2 = futureDate.getDate();
    const month2 = futureDate.getMonth() + 1; // 0 is January, so we must add 1
    const year2 = futureDate.getFullYear();


    const formattedNumber = ("0" + date2).slice(-2);
    console.log(formattedNumber);

    const formattedNumber2 = ("0" + month2).slice(-2);
    console.log(formattedNumber);


    // Build Date Satring
    const dateString = `${year}-${month}-${dateNum}`;
    console.log(dateString);
    const dateString2 = `${year2}-${formattedNumber2}-${formattedNumber}`;
    console.log(dateString2);

    document.getElementById('departure-date').setAttribute('min', dateString);
    document.getElementById('departure-date').setAttribute('max', dateString2);
})();

//  Make a GET request on click
document.getElementById('search').addEventListener('click', performAction);


// Geonames - GET Request
const getPlaceName = async(baseURL, placeName, apiKey) => {
    const res = await fetch(baseURL+placeName+apiKey);
    try {
      const data = await res.json();
      return data;
    } catch(error) {
      console.log("error", error);
    }
}


// Weatherbit - Build API URL
const getLocation = async () => {
    const request = await fetch('/all');
    try {
        const allData = await request.json();
        currentWeatherBaseURL.searchParams.append("lat", allData.latitude);
        currentWeatherBaseURL.searchParams.append("lon", allData.longitude);
        forecastWeatherBaseURL.searchParams.append("lat", allData.latitude);
        forecastWeatherBaseURL.searchParams.append("lon", allData.longitude);
    } catch(error) {
        console.log("error", error);
    }
};


// Weatherbit - GET Request
const getCurrentWeather = async(currentWeatherBaseURL) => {
    currentWeatherBaseURL.searchParams.append("key", "8fcdb754804e4825afbd72eb47d12818");
    currentWeatherBaseURL.href;
    const res = await fetch(currentWeatherBaseURL);
    try {
      const data = await res.json();
      return data;
    } catch(error) {
      console.log("error", error);
    }
}


// Weatherbit - GET Request
const getForecastWeather = async(forecastWeatherBaseURL) => {
    forecastWeatherBaseURL.searchParams.append("key", "8fcdb754804e4825afbd72eb47d12818");
    forecastWeatherBaseURL.href;
    const res = await fetch(forecastWeatherBaseURL);
    try {
      const data = await res.json();
      return data;
    } catch(error) {
      console.log("error", error);
    }
}


// Function triggered once the user has submitted input values
async function performAction(e) {
    // Retrieve the place name
    let placeName = document.getElementById('place').value;
    // Reset URL to prevent apending values from additional submissions
    currentWeatherBaseURL = new URL ('http://api.weatherbit.io/v2.0/current');
    forecastWeatherBaseURL = new URL ('http://api.weatherbit.io/v2.0/forecast/daily');
    tripCountdown();
    console.log(`The Trip is Within a Week: ${withinAWeek}`);
    let data = await getPlaceName(baseURL, placeName, apiKey);
    await postData('/place', {latitude: data.geonames[0].lat, longitude: data.geonames[0].lng, country: data.geonames[0].countryName});
    await getLocation();
    data = await getCurrentWeather(currentWeatherBaseURL);
    await postData('/weather', {weather: data.data[0].weather.description, temperature: data.data[0].temp});
    data = await getForecastWeather(forecastWeatherBaseURL);
    await postData('/forecastWeather', {weather: data.data[0].weather.description, temperature: data.data[0].temp});
    await updateUI();
}


// Calculate whether the trip is within a week
const tripCountdown = () => {
    // Date of user submission in milliseconds
    let d1 = Date.now();

    // Date of departure in milliseconds
    let d = new Date(document.getElementById("departure-date").value);
    let d2 = Date.parse(d);

    let difference = d2 - d1;
    
    if (difference < 604800000) {
        //console.log('Within a week. Provide current weather forecast');
        return withinAWeek = true;
    } else {
        //console.log('More than 1 week. Proivide predicted weather forecast');
        return withinAWeek = false;
    }
}


// Setup Async POST request
const postData = async (url = '', data = {})=>{
    const response = await fetch(url, {
        method: 'POST', 
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        // Body data type must match "Content-Type" header        
        body: JSON.stringify(data), 
    });
    try {
        const newData = await response.json();
        return newData;
    } catch(error) {
        console.log("error", error);
        // Appropriately handle the error
    }
};


// Update UI
const updateUI = async () => {
    const request = await fetch('/all');
    try {
        const allData = await request.json();
        document.getElementById('latitude').innerHTML = `The Latitude is: ${allData.latitude}`;
        document.getElementById('longitude').innerHTML = `The Longitude is: ${allData.longitude}`;
        document.getElementById('countryName').innerHTML = `Your Country Name is: ${allData.country}`;
        document.getElementById('weather').innerHTML = `The Weather is: ${allData.weather}`;
        document.getElementById('temperature').innerHTML = `The Current Temperature is: ${allData.temperature}`;
        document.getElementById('forecast-weather').innerHTML = `The Forecasted Weather is: ${allData.forecastWeather}`;
        document.getElementById('forecast-temperature').innerHTML = `The Forecasted Temperature is: ${allData.forecastTemperature}`;
    } catch(error) {
        console.log("error", error);
        // Display error message to the user if the call fails
        document.getElementById('errorMsg').innerHTML = 'Looks like there was a problem with the API call.';
    }
};


export {getPlaceName, getCurrentWeather, performAction};