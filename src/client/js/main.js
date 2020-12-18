// Geonames API call
const baseURL = 'http://api.geonames.org/search?name='; 
const apiKey = '&maxRows=1&type=json&username=as20';   

// Weatherbit API call
let myUrlWithParams = new URL ('http://api.weatherbit.io/v2.0/current');

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
        myUrlWithParams.searchParams.append("lat", allData.latitude);
        myUrlWithParams.searchParams.append("lon", allData.longitude);
        return myUrlWithParams;
    } catch(error) {
        console.log("error", error);
    }
};


// Weatherbit - GET Request
const getCurrentWeather = async(myUrlWithParams) => {
    myUrlWithParams.searchParams.append("key", "8fcdb754804e4825afbd72eb47d12818");
    myUrlWithParams.href;
    const res = await fetch(myUrlWithParams);
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
    myUrlWithParams = new URL ('http://api.weatherbit.io/v2.0/current');
    tripCountdown();
    let data = await getPlaceName(baseURL, placeName, apiKey);
    await postData('/place', {latitude: data.geonames[0].lat, longitude: data.geonames[0].lng, country: data.geonames[0].countryName});
    await getLocation();
    data = await getCurrentWeather(myUrlWithParams);
    await postData('/weather', {weather: data.data[0].weather.description, temperature: data.data[0].temp});
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
        console.log('Within a week. Provide current weather forecast');
    } else {
        console.log('More than 1 week. Proivide predicted weather forecast');
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
    } catch(error) {
        console.log("error", error);
        // Display error message to the user if the call fails
        document.getElementById('errorMsg').innerHTML = 'Looks like there was a problem with the API call.';
    }
};


export {getPlaceName, getCurrentWeather, performAction};