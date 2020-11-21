// Build dynamic URL query by joining variables
const baseURL = 'http://api.geonames.org/searchJSON?q=';       
const apiKey = '&username=as20';     

// Setup async GET request
const getWeather = async (baseURL, placeName, apiKey) => {

    const res = await fetch(baseURL+placeName+apiKey);
    
    try {
        const data = await res.json();
        return data;
    } catch(error){
        console.log("error", error);
        // Appropriately handle the error
    }
};


// Anticipate postcode as user response
const performAction = () => {
    // User response: Post Code in UK Format
    const placeName =  document.getElementById('placeName').value;    
    // User response: Feeling
    //const feeling = document.getElementById('feelings').value;

    // UK Date Format
    //let d = new Date();
    //let newDate = d.getDate() +'.'+ (d.getMonth()+1) +'.'+ d.getFullYear();     // getMonth() returns the month (0–11). Add 1 to adjust.

    getWeather(baseURL, placeName, apiKey)
    .then(function(data){
        console.log('data: ', data.geonames.lat, data.geonames.lng, data.geonames.countryName)
        postData('/', {latitude: data.geonames.lat, longitude: data.geonames.lng, country: data.geonames.countryName});
    })
    .then(function(data){
        updateUI;
    });
};


// Add event listener
document.getElementById('generate').addEventListener('click', performAction);


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
    }catch(error){
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
        document.getElementById('longitude').innerHTML = `The Longitude is: ${allData.longitude} &#8451;`;
        document.getElementById('countryName').innerHTML = `Your Country Name is: ${allData.country}`;
    } catch(error){
        console.log("error", error);
        // Display error message to the user if the call fails
        document.getElementById('errorMsg').innerHTML = 'Looks like there was a problem with the API call.';
    }
};

export {getWeather, performAction, postData, updateUI};