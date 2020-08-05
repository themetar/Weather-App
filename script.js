const apiKey = "b2f923af492ef49f597b7a7055e0035f";

async function getCurrentWeather(location = "Bitola") {
  try {
    const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return Promise.reject("no-data");
    }
  } catch (error) {
    console.error("Error:", error);
  } 
}

function filterWeatherData (data) {
  return {
    group:          data.weather[0].main,
    description:    data.weather[0].description,
    icon:           data.weather[0].icon,
    temperature:    data.main.temp,
    feels_like:     data.main.feels_like,
    clouds:         data.clouds && data.clouds.all,
    wind_speed:     data.wind && data.wind.speed,
    wind_direction: data.wind && data.wind.deg,
    rain:           data.rain && data.rain["1h"],
    snow:           data.snow && data.snow["1h"],
  };
}

getCurrentWeather("London").then(data => {
  console.log(filterWeatherData(data))
});
