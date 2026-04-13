// search button click event listener with arrow function so that inside it we can call showLoader(),getWeather()
// getWeather() -> in async/await with try catch will try to fetch data else with catch will catch error
// PURPOSE-> return api data resolved withing try or throw error in catch 
// RECEIVES-> users city
// RETURNS-> Weather data of user eneterd city
// showLoader conveys user that data is being fetched untill then
// PURPOSE-> to let user wait untill DOM is ready to display 
// RETURNS-> it stops after that
// renderData()-> create DOM and then also modify it's textContent
// PURPOSE-> create and display DOM  
// RECEIVES-> textcontent of data which needs to be displayed
// RETURNS-> HTML elements
// saveData() -> to save data in localStorage
// loadData() -> to get data from localStorage
let id = `b5250823e2c02e80a91ca40a93d5c152`;
let message;
loadLastCity();

async function loadLastCity(){
    let savedCity = loadData();
    document.getElementById('city').value = savedCity;
    
    if(savedCity){
        let savedCityData = await getWeather(savedCity);
        renderData(savedCityData);
    }else{
        return '';
    }
}


async function getWeather(city) {
    try{
        // fetching data and stored in variable to convert it to required format 
        let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${id}&units=metric`);

        // here we wait untill the dom is ready properly and also convert data to js object here
        let response = await res.json();

        if(response.cod === "404"){
            message = "City Not Found";
            return message;
        }
        return response;
    }catch(err){
        return "Network error — please check your connection";
    }
}

document.getElementById('weatherForm').addEventListener('submit', async (e)=>{
    e.preventDefault();
    let cityVal = document.getElementById('city').value.trim();
    let dataErr = document.getElementById('displayError');
    if(cityVal === ""){
        message = "Empty Input";
        return dataErr.textContent = message;
    }
    showLoader();
    let data = await getWeather(cityVal);
    if(typeof data === 'object'){
        renderData(data);
        hideLoader();
        dataErr.textContent = '';
        saveData(cityVal);
    } else{
        dataErr.textContent = data;
        let displayData = document.getElementById('weather-container');
        displayData.textContent = '';
        hideLoader();

    }
})

// create DOM and will display response in list
function renderData(response){
    let displayData = document.getElementById('weather-container');
    displayData.textContent = '';

    let li = document.createElement('li');
    li.textContent = `${response.name} | ${response.main.temp}°C | ${response.weather[0].description} | Humidity: ${response.main.humidity}% | Wind: ${response.wind.speed} m/s`;

    displayData.appendChild(li);
}

function saveData(cityVal){
    localStorage.setItem('city', cityVal);
}

function loadData(){
    let sotredCity = localStorage.getItem('city');

    if(sotredCity){
        return sotredCity;
    }else{
        return '';
    }
}

function showLoader(){
    let loader = document.getElementById('loader-container');
    loader.style.display = 'block';
}

function hideLoader(){
    let loader = document.getElementById('loader-container');
    loader.style.display = 'none';
}