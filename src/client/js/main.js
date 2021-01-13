// Geonames API call
const baseURL = 'https://secure.geonames.org/search?name='; 
const apiKey = '&maxRows=1&type=json&username=as20';   

https://api.weatherbit.io/v2.0/current

// Weatherbit API call
let currentWeatherBaseURL = new URL ('https://api.weatherbit.io/v2.0/current');
let forecastWeatherBaseURL = new URL ('https://api.weatherbit.io/v2.0/forecast/daily'); // Example: http://api.weatherbit.io/v2.0/forecast/daily?lat=51.509865&lon=-0.118092&key=8fcdb754804e4825afbd72eb47d12818

// Countdown Tracker
let withinAWeek;

const dateNow = new Date();

// Current date and future date will be the min and max on the date picker
// Future date is set 15 days ahead of the current date for 16 day forecast api
const dateComponentsObject = {
    currentYear: dateNow.getFullYear(),
    currentMonth: dateNow.getMonth() + 1,
    currentDate: dateNow.getDate(),
    forecastWeatherYear: dateNow.getFullYear(),
    forecastWeatherMonth: dateNow.getMonth() + 1,
    forecastWeatherDate: dateNow.getDate() + 15
}

// Ensure single digit strings are prepended by 0 to return double digits
const isSingleDigit = (dateNum) => {
  let dateNumAsString = dateNum.toString();
  if(dateNumAsString.length < 2){
    dateNumAsString = ("0" + dateNum).slice(-2);
    //const sanitisedDateString = ("0" + dateNum).slice(-2);
    return dateNumAsString;
  } else {
    return dateNumAsString;
  }
}

// Store formatted date components 
const formattedCurrentMonth = isSingleDigit(dateComponentsObject.currentMonth);
const formattedCurrentDate = isSingleDigit(dateComponentsObject.currentDate);
const formattedForecastWeatherMonth = isSingleDigit(dateComponentsObject.forecastWeatherMonth);
const formattedForecastWeatherDate = isSingleDigit(dateComponentsObject.forecastWeatherDate);

// Build YYYY-MM-DD format for min and max attributes
const currentDateString = `${dateComponentsObject.currentYear}-${formattedCurrentMonth}-${formattedCurrentDate}`;
const futureDateString = `${dateComponentsObject.forecastWeatherYear}-${formattedForecastWeatherMonth}-${formattedForecastWeatherDate}`;

// Set min and max values on date picker
window.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('departure-date').setAttribute('min', currentDateString);
    document.getElementById('departure-date').setAttribute('max', futureDateString);
    document.getElementById('return-date').setAttribute('min', currentDateString);

    //  Make a GET request on click
    document.getElementById('search').addEventListener('click', performAction);
});

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
}


const getWeather = async(baseURL) => {
    baseURL.searchParams.append("key", "8fcdb754804e4825afbd72eb47d12818");
    baseURL.href;
    const res = await fetch(baseURL);
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

    // Retrieve depart and return dates
    const dateDepart = document.getElementById('departure-date').value;
    const dateReturn = document.getElementById('return-date').value;

    // Reset URL to prevent apending values from additional submissions
    currentWeatherBaseURL = new URL ('https://api.weatherbit.io/v2.0/current');
    forecastWeatherBaseURL = new URL ('https://api.weatherbit.io/v2.0/forecast/daily');
    tripCountdown(dateDepart);

    let data = await getPlaceName(baseURL, placeName, apiKey);
    await postData('/place', {latitude: data.geonames[0].lat, longitude: data.geonames[0].lng, country: data.geonames[0].countryName});

    if(withinAWeek){    
        await getLocation();
        data = await getWeather(currentWeatherBaseURL);
        await postData('/weather', {weather: data.data[0].weather.description, temperature: data.data[0].temp});
        await postData('/forecastWeather', {forecastWeather: undefined, forecastTemperature: undefined});
    }

    if(!withinAWeek){
        await getLocation();
        data = await getWeather(forecastWeatherBaseURL);
        await postData('/forecastWeather', {forecastWeather: data.data[elapsed].weather.description, forecastTemperature: data.data[elapsed].temp});
        await postData('/weather', {weather: undefined, temperature: undefined});
    }

    // Sanitise place name for pixabay image search
    const newPlaceNameStr = placeName.split(' ').join('+');
    data = await getImage(pixabayBaseURL, newPlaceNameStr);
    await postData('placeImage', {imageSource: data.hits[0].webformatURL})

    tripDuration(dateReturn);

    await updateUI();
}


// Calculate whether the trip is within a week
const tripCountdown = (dateDepart) => {
    // Calculate date position to index 16 day weather forecast

    // Store user selected dates
    let dateDepartString =  dateDepart.split("-");

    // Add depart date strings to dateComponentsObject
    dateComponentsObject.departYear = dateDepartString[0];
    dateComponentsObject.departMonth = dateDepartString[1];
    dateComponentsObject.departDate = dateDepartString[2];

    // Build current date and depart date. Pass date components as string values into the date constructor
    // Calculate the difference between the departure date and the current date to retrieve a value
    const date1 = new Date(`${dateComponentsObject.currentYear}, ${formattedCurrentMonth}, ${formattedCurrentDate}`);
    const date2 = new Date(`${dateComponentsObject.departYear}, ${dateComponentsObject.departMonth}, ${dateComponentsObject.departDate}`);

    // The retrieved value will be converted into days to index the forecast weather array
    const diff = date2 - date1;
    const elapsed = diff / (1000*60*60*24);
    window.elapsed = elapsed;

    // Date of user submission in milliseconds
    let d1 = Date.now();

    // Date of departure in milliseconds
    let d = new Date(dateDepart);
    let d2 = Date.parse(d);

    let difference = d2 - d1;
    
    if (difference < 518400000) {
        return withinAWeek = true;
    } else {
        return withinAWeek = false;
    }
}


const tripDuration = (dateReturn) => {
    // Store user selected dates
    let returnDateString =  dateReturn.split("-");

    // Add return date strings to dateComponentsObject
    dateComponentsObject.returnYear = returnDateString[0];
    dateComponentsObject.returnMonth = returnDateString[1];
    dateComponentsObject.returnDate = returnDateString[2];

    // Use date constructor to build date with the date strings 
    const date1 = new Date(dateComponentsObject.departYear, dateComponentsObject.departMonth, dateComponentsObject.departDate);
    const date2 = new Date(dateComponentsObject.returnYear, dateComponentsObject.returnMonth, dateComponentsObject.returnDate);
    
    // Calculate difference between milliseconds
    const diff = date2 - date1;
    
    // Calculate duration in days from milliseconds
    const tripLength = diff / (1000*60*60*24);
    Math.floor(tripLength);
    window.tripLength = tripLength;
}


// Pixabay GET Request
const pixabayApiKey = '19683295-e8b4f306744125816c90e3afb';
let pixabayBaseURL = new URL ('https://pixabay.com/api/');

const getImage = async(baseURL, imageSearch) => {
    pixabayBaseURL.searchParams.append("key", pixabayApiKey);
    pixabayBaseURL.searchParams.append("q", imageSearch);
    pixabayBaseURL.href;

    const res = await fetch(pixabayBaseURL);
    try {
        const imageData = await res.json();
        return imageData;
    } catch(error) {
        console.log("error", error);
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
        document.getElementById('countdown').innerHTML = `Your Trip Duration is: ${tripLength} Days`;
        document.getElementById('countryName').innerHTML = `Your Country Name is: ${allData.country}`;
        
        let cWeather = document.getElementById('weather');
        let cTemperature = document.getElementById('temperature');
        let fWeather = document.getElementById('forecast-weather');
        let fTemperature = document.getElementById('forecast-temperature');

        // Only show current weather if depart date is within a week
        if(withinAWeek){
            fWeather.classList.add('hide');
            fTemperature.classList.add('hide');
            cWeather.classList.remove('hide');
            cTemperature.classList.remove('hide');
        }

        // Only show forecast weather if depart date is more than a week
        if(!withinAWeek){
            cWeather.classList.add('hide');
            cTemperature.classList.add('hide');
            fWeather.classList.remove('hide');
            fTemperature.classList.remove('hide');
        }

        cWeather.innerHTML = `The Weather is: ${allData.weather}`;
        cTemperature.innerHTML = `The Current Temperature is: ${allData.temperature}`;        
        fWeather.innerHTML = `The Forecasted Weather is: ${allData.forecastWeather}`;
        fTemperature.innerHTML = `The Forecasted Temperature is: ${allData.forecastTemperature}`;
        
        document.getElementById('place-image').setAttribute("src", allData.imageSource);
    } catch(error) {
        console.log("error", error);
        // Display error message to the user if the call fails
        document.getElementById('errorMsg').innerHTML = 'Looks like there was a problem with the API call.';
    }
};


export {isSingleDigit, getPlaceName, getLocation, getWeather, performAction, tripCountdown, tripDuration, getImage, updateUI};
