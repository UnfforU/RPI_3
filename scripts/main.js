const body = document.querySelector('body'),
    tempF = document.getElementById('temp-f'),
    tempC = document.getElementById('temp-c'),

    lang = document.getElementById('lang'),

    time = document.getElementById('city_time'),
    date = document.getElementById('city_date'),

    searchInputTxt = document.querySelector('.search-input'),
    searchBtn = document.getElementById("search"),

    city = document.getElementById('city'),
    country = document.getElementById('country'),

    humidityText = document.getElementById('humidity_text'),
    apparentText = document.getElementById('apparent_text'),
    windText = document.getElementById('wind_text'),
    windUnitsText = document.getElementById('wind_units'),
    latitudeText = document.getElementById('latitude_text'),
    longitudeText = document.getElementById('longitude_text'),

    weatherIcon = document.getElementById('weather_icon'),
    temperature = document.getElementById('curr_temp'),
    apparentValue = document.getElementById('apparent_value'),
    windValue = document.getElementById('wind_value'),
    humidityValue = document.getElementById('humidity_value'),
    longitudeValue = document.getElementById('longitude_value'),
    latitudeValue = document.getElementById('latitude_value'),

    reloadBtn = document.getElementById('reload');

    day_1_Name = document.getElementById('day_one_name'),
    day_1_Temp = document.getElementById('day_one_temp'),
    day_1_Icon = document.getElementById('day_one_icon'),

    day_2_Name = document.getElementById('day_two_name'),
    day_2_Temp = document.getElementById('day_two_temp'),
    day_2_Icon = document.getElementById('day_two_icon'),

    day_3_Name = document.getElementById('day_three_name'),
    day_3_Temp = document.getElementById('day_three_temp'),
    day_3_Icon = document.getElementById('day_three_icon'),

    voiceBtn = document.querySelector('.btn_voice'),

    arr_week_en = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    arr_month_en = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    arr_week_ru = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
    arr_month_ru = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"],
    arr_week_full_en = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    arr_week_full_ru = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];

let currCity,
    currCountry,
    currDay,
    arr_week,
    arr_month,
    arr_week_full,
    timezone = 0,
    voice = null,
    voiceFlag = false;

//#region RUN
GetGeolocation();
SetLanguage();
SetTemperatureType();
SetBackgroundImg();
ShowTime();
reloadBackImg();
SetThreeDaysWeather();
//#endregion

//#region EventListeners
lang.addEventListener('change', () =>{
    localStorage.setItem('lang', lang.value);
    SetLanguage();
})

tempF.addEventListener('click', () => {
    MakeAllFahrenheit();
    SetTempF();

});

tempC.addEventListener('click', () => {
    MakeAllCelsius();
    SetTempC();
});

reloadBtn.addEventListener('click', () => {
    SetBackgroundImg();
});

searchInputTxt.addEventListener('keypress', keyInputEnter);

searchBtn.addEventListener('click', () => {
    GetPlaceAndWeatherInfo().then(r => SetCity());
    searchInputTxt.value = "";
});

voiceBtn.addEventListener('click', () => {
    if (voice == null) {
        voice = voiceObCreate();
        voiceSetLang();
        voiceRecording();
    }

    if (voiceFlag) {
        voice.stop();
    } else {
        voice.start();
    }

    voiceFlag = !voiceFlag;
});
//#endregion

//#region Выбор языка сайта
function SetLanguage(){
    if(localStorage.getItem('lang') == null){
        localStorage.setItem('lang', 'ru');
        lang.options[0].selected = true;
        SetRus();
    }

    switch (localStorage.getItem('lang')) {
        case 'ru': {
            SetRus();
            break;
        }
        case  'en': {
            SetEng();
        }
    }
    GetPlaceAndWeatherInfo().then(r => SetCity());
    voiceChangeLang();
}

function  SetRus(){
    searchInputTxt.placeholder = 'Название города';
    searchBtn.textContent = 'Поиск';
    humidityText.textContent = 'влажность: ';
    apparentText.textContent = 'чувствуется: ';
    windText.textContent = 'ветер: ';
    windUnitsText.textContent = 'м/с ';
    longitudeText.textContent = 'долгота :';
    latitudeText.textContent = 'широта :';
    arr_week = arr_week_ru;
    arr_month = arr_month_ru;
    arr_week_full = arr_week_full_ru;
    SetCurrWeekDay(currDay + 1, day_1_Name);
    SetCurrWeekDay(currDay + 2, day_2_Name);
    SetCurrWeekDay(currDay + 3, day_3_Name);

    lang.options[0].selected = true;
}

function SetEng(){
    searchInputTxt.placeholder = 'City name';
    searchBtn.textContent = 'Search';
    humidityText.textContent = 'humidity: ';
    apparentText.textContent = 'feels like: ';
    windText.textContent = 'wind: ';
    windUnitsText.textContent = 'm/s ';
    longitudeText.textContent = 'longitude :';
    latitudeText.textContent = 'latitude :';
    arr_week = arr_week_en;
    arr_month = arr_month_en;
    arr_week_full = arr_week_full_en;
    SetCurrWeekDay(currDay + 1, day_1_Name);
    SetCurrWeekDay(currDay + 2, day_2_Name);
    SetCurrWeekDay(currDay + 3, day_3_Name);

    lang.options[1].selected = true;
}
//#endregion

//#region Выбор единицы измерения температуры
function SetTemperatureType(){
    if(localStorage.getItem('temp') == null){
        SetTempC();
    }

    switch (localStorage.getItem('temp')) {
        case 'C': {
            SetTempC();
            break;
        }
        case 'F': {
            SetTempF();
        }
    }
}

function SetTempC(){
    tempC.classList.add("btn_temp_active");
    tempF.classList.remove("btn_temp_active");
    localStorage.setItem('temp', 'C');
}

function SetTempF(){
    tempF.classList.add("btn_temp_active");
    tempC.classList.remove("btn_temp_active");
    localStorage.setItem('temp', 'F');
}

function MakeAllFahrenheit() {
    if (localStorage.getItem('temp') === 'C') {
        MakeFahrenheit(temperature);
        MakeFahrenheit(apparentValue);
        MakeFahrenheit(day_1_Temp);
        MakeFahrenheit(day_2_Temp);
        MakeFahrenheit(day_3_Temp);
    }
}

function MakeFahrenheit(temperature) {
    console.log(parseInt(temperature.textContent, 10)* 1.8 + 32);
    temperature.textContent = parseInt(Math.round(parseInt(temperature.textContent, 10) * 1.8 + 32));

}

function MakeAllCelsius() {
    if (localStorage.getItem('temp') === 'F') {
        MakeCelsius(temperature);
        MakeCelsius(apparentValue);
        MakeCelsius(day_1_Temp);
        MakeCelsius(day_2_Temp);
        MakeCelsius(day_3_Temp);
    }
}

function MakeCelsius(temperature) {
    console.log(temperature.textContent);
    temperature.textContent = parseInt(Math.round((parseInt(temperature.textContent, 10) - 32.0) / 1.8));
}
//#endregion

//#region Фоновое изображение
async function SetBackgroundImg(){
    const url = 'https://api.unsplash.com/photos/random?query=night&orientation=landscape&client_id=uKLb1lavrorEORg0brcNTMrlrGhphuJfwupfKhPOMWw';
    //const  url = 'https://api.unsplash.com/photos/random?orientation=landscape&per_page=1&query=night&client_id=e2077ad31a806c894c460aec8f81bc2af4d09c4f8104ae3177bb809faf0eac17';
    const res = await fetch(url);
    if (!res.ok) {
        body.style.backgroundImage = `url(./images/default_background.jpg)`;
        console.log("defBack");
        return;
    }

    const data = await res.json();

    body.style.backgroundImage = `url(${data.urls.regular})`;
}

async function reloadBackImg() {
    await SetBackgroundImg();
    setInterval(SetBackgroundImg, 1000 * 60 * 60);
}
//#endregion

//#region Поиск по городу(ввод)
function keyInputEnter(e) {
    if (e.type === 'keypress') {
        if (e.keyCode === 13) {
            GetPlaceAndWeatherInfo().then(r => SetCity());
            searchInputTxt.value = "";
        }
    }
}
//#endregion

//#region Время
function addZero(n) {
    return (parseInt(n, 10) < 10 ? '0' : '') + n;
}

function ShowTime() {
    let today = new Date();
    today.setSeconds(today.getSeconds()+timezone);
    let hour = today.getHours(),
        min = today.getMinutes(),
        sec = today.getSeconds(),
        dayWeek = today.getDay(),
        day = today.getDate(),
        month = today.getMonth();

    currDay = day;

    time.innerHTML = `${hour}<span>:</span>${addZero(min)}<span>:</span>${addZero(sec)}`;
    date.innerHTML = `${arr_week[dayWeek]}<span>, </span>${day} ${arr_month[month]}`;
    setTimeout(ShowTime, 1000);
}
//#endregion

//#region Формируем основные данные странички
async function SetCity() {
    if (localStorage.getItem('city') !== null || localStorage.getItem('country') !== null) {
        currCity = localStorage.getItem('city');
        city.textContent = currCity;
        currCountry = localStorage.getItem('country');
        country.textContent = currCountry;
    }
}

function TempFilter(temperature){
    switch (localStorage.getItem('temp')) {
        case 'C': {
            return parseInt(temperature, 10);
        }
        case 'F': {
            return parseInt((parseInt(temperature, 10) * 1.8) + 32);
        }
    }
}

async function GetPlaceAndWeatherInfo(){
    currCity = (searchInputTxt.value !== "" ? searchInputTxt.value : localStorage.getItem("city"));
    let lang = localStorage.getItem('lang');
    console.log(currCity);
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${currCity}&lang=${lang}&appid=67379698d4967c14c4072e6e75cacbee&units=metric`;

    const res = await fetch(url);
    if (!res.ok) {
        return;
    }

    const data = await res.json();
    console.log(data);
    weatherIcon.className = 'weather_icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = TempFilter(data.main.temp);
    apparentValue.textContent = TempFilter(data.main.feels_like);
    windValue.textContent = data.wind.speed;
    humidityValue.textContent = data.main.humidity;
    latitudeValue.textContent = data.coord.lat;
    longitudeValue.textContent = data.coord.lon;
    timezone = data.timezone - 10800;

    await getMap();

    localStorage.setItem('city', data.name);
    currCity = data.name;
    console.log((currCity));
    localStorage.setItem('country', data.sys.country);
    currCountry = data.sys.country;
}
//#endregion

//#region Карта
async function getMap(){
    mapboxgl.accessToken = 'pk.eyJ1IjoidW5mIiwiYSI6ImNrcDg1dHIzajA3NDEydW55MHgzNnZlanYifQ.qQDTsYVUboj5SZQUUhSbOA';

    let x = parseFloat(longitudeValue.textContent);
    let y = parseFloat(latitudeValue.textContent);
    var map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: [x, y], // starting position [lng, lat]
        zoom: 10 // starting zoom
    });
}
//#endregion

//#region Геолокация пользователя
async function GetGeolocation(){
    const url = 'https://ipinfo.io/json?token=7139a5e9a799da';
    const res = await fetch(url);
    if (!res.ok) {
        console.log("error in res");
    } else {
        const data = await res.json();

        localStorage.setItem('city', data.city);
        localStorage.setItem('country', data.country);

        GetPlaceAndWeatherInfo().then(r => SetCity());
    }
}
//#endregion

//#region Погода на 3 дня вперед
async function SetThreeDaysWeather() {
    let url = `https://api.openweathermap.org/data/2.5/forecast?q=${localStorage.getItem("city")}&lang=ru&units=metric&APPID=32668db5559e877281a139dd47d93fee`;

    const res = await fetch(url);
    if (!res.ok) {
        return;
    }

    const data = await res.json();
    SetOneDayWeather(data, day_1_Icon, day_1_Temp, 7);
    SetCurrWeekDay(currDay + 1, day_1_Name);

    SetOneDayWeather(data, day_2_Icon, day_2_Temp, 14);
    SetCurrWeekDay(currDay + 2, day_2_Name);

    SetOneDayWeather(data, day_3_Icon, day_3_Temp, 21);
    SetCurrWeekDay(currDay + 3, day_3_Name);
}

function SetOneDayWeather(data, currIcon, currTemp, index) {
    currIcon.className = 'weather_icon_mini owf';
    currIcon.classList.add(`owf-${data.list[index].weather[0].id}`);
    currTemp.textContent = TempFilter(data.list[index].main.temp);
}

function SetCurrWeekDay(currDay, currName){
    while (currDay > 6) {
        currDay -= 7;
    }
    currName.textContent = arr_week_full[currDay];
}
//#endregion

//#region Голосовой поиск
function IsVoiceSupported() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition);
}

function voiceObCreate() {
    if (IsVoiceSupported()) {
        return new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
    }
}

function voiceSetLang(){
    if (voice != null) {
        if (localStorage.getItem('lang') === "ru") {
            voice.lang = "ru-RU";
        } else {
            voice.lang = "en-EN";
        }
    }
}

function voiceChangeLang() {
    if (voice != null) {
        voice.stop();
        voiceFlag=false;
        voiceSetLang();
    }
}

function voiceRecording(){
    voice.interimResults = true;
    voice.onresult = function(event){
        var result = event.results[event.resultIndex];
        if (result.isFinal) {
            GetPlaceAndWeatherInfo().then(r => SetCity());
            voice.stop();
            voiceFlag=false;
            searchInputTxt.value="";
        } else {
            searchInputTxt.value=result[0].transcript;
        }
    };
}
//#endregion