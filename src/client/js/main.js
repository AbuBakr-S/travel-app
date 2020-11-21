// Build dynamic URL query by joining variables
const baseURL = 'https://api.openweathermap.org/data/2.5/weather?zip=';       // Includes zip
const apiKey = ',gb&units=metric&appid=6d0e16cb765e5e669c1e507ac7107a09';     // Includes gb for country and unit set to metric for temperature in celcius

// Setup async GET request
const getWeather = async (baseURL, postCode, apiKey) => {

    const res = await fetch(baseURL+postCode+apiKey);
    
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
    const postCode =  document.getElementById('postCode').value;      
    // User response: Feeling
    const feeling = document.getElementById('feelings').value;

    // UK Date Format
    let d = new Date();
    let newDate = d.getDate() +'.'+ (d.getMonth()+1) +'.'+ d.getFullYear();     // getMonth() returns the month (0–11). Add 1 to adjust.

    getWeather(baseURL, postCode, apiKey)
    .then(function(data){
        console.log('data: ', data.main.temp, newDate , feeling)
        postData('/', {temperature: data.main.temp, date: newDate, userResponse: feeling});
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
        document.getElementById('date').innerHTML = `Today's Date: ${allData.date}`;
        document.getElementById('temp').innerHTML = `The temperature is: ${allData.temperature} &#8451;`;
        document.getElementById('content').innerHTML = `Feelings Log: ${allData.userResponse}`;
    } catch(error){
        console.log("error", error);
        // Display error message to the user if the call fails
        document.getElementById('errorMsg').innerHTML = 'Looks like there was a problem with the API call.';
    }
};

export {getWeather, performAction, postData, updateUI};