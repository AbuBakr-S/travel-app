// Geonames API call
const baseURL = 'http://api.geonames.org/search?name='; 
const apiKey = '&maxRows=1&type=json&username=as20';   

// Weatherbit API call
let currentWeatherBaseURL = new URL ('http://api.weatherbit.io/v2.0/current');
let forecastWeatherBaseURL = new URL ('http://api.weatherbit.io/v2.0/forecast/daily'); // Example: http://api.weatherbit.io/v2.0/forecast/daily?lat=51.509865&lon=-0.118092&key=8fcdb754804e4825afbd72eb47d12818

// Countdown Tracker
let withinAWeek;

// Set Minimum and Maximum Date on Date Picker
// Min - Present day
// Max - 16 days ahead
(() => {
    //##### SANITISE DATE #####
    const dateNow = new Date();
    const currentYear = dateNow.getFullYear();
    const currentMonth = dateNow.getMonth() + 1;
    const currentDate = dateNow.getDate();

    // Set Max Departure Date on Calendar
    const departFuture = dateNow.setDate(dateNow.getDate() + 16);

    const futureDate = dateNow.getDate();
    const futureMonth = dateNow.getMonth() + 1; // 0 is January, so we must add 1
    const futureYear = dateNow.getFullYear();


    // Sanitise date string
    const isSingleDigit = (dateNum) => {
        let dateNumAsString = dateNum.toString();
        if(dateNumAsString.length < 2){
            const sanitisedDateString = ("0" + dateNum).slice(-2);
            //console.log(`New Date: ${sanitisedDateString}`);
            return sanitisedDateString;
        } else {
            return dateNumAsString;
        }
    }

    let cleanCMonth = isSingleDigit(currentMonth);
    let cleanCDate = isSingleDigit(currentDate);
    let cleanFMonth = isSingleDigit(futureMonth);
    let cleanFDate = isSingleDigit(futureDate);

    // Build Date Satring
    const currentDateString = `${currentYear}-${cleanCMonth}-${cleanCDate}`;
    const futureDateString = `${futureYear}-${cleanFMonth}-${cleanFDate}`;

    console.log(currentDateString);
    console.log(futureDateString);

    document.getElementById('departure-date').setAttribute('min', currentDateString);
    document.getElementById('departure-date').setAttribute('max', futureDateString);
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
        if(withinAWeek){
            currentWeatherBaseURL.searchParams.append("lat", allData.latitude);
            currentWeatherBaseURL.searchParams.append("lon", allData.longitude);
        }
        if(!withinAWeek){
            forecastWeatherBaseURL.searchParams.append("lat", allData.latitude);
            forecastWeatherBaseURL.searchParams.append("lon", allData.longitude);
        }
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

    if(withinAWeek){    
        await getLocation();
        data = await getCurrentWeather(currentWeatherBaseURL);
        await postData('/weather', {weather: data.data[0].weather.description, temperature: data.data[0].temp});
    }

    if(!withinAWeek){
        await getLocation();
        data = await getForecastWeather(forecastWeatherBaseURL);
        await postData('/forecastWeather', {weather: data.data[0].weather.description, temperature: data.data[0].temp});
    }

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