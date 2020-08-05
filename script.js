const apiKey = "b2f923af492ef49f597b7a7055e0035f";

async function getCurrentWeather(location = "Bitola", units = "metric") {
  try {
    const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${location}&units=${units}&appid=${apiKey}`);
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

let loading = false;

document.getElementsByTagName("form")[0].addEventListener("submit", async event => {
  event.preventDefault(); // do not submit to server

  if (loading) return;

  loading = true;

  const form = event.target;
  const location = form.querySelector("input[name=location").value;
  const units = [...form.querySelectorAll("input[name=units]")].find(input => input.checked).value;

  let weather;
  try {
    weather = await getCurrentWeather(location, units);
    console.log(filterWeatherData(weather));
  } catch (error) {
    console.log("Wrong parameters");
  } finally {
    loading = false;
  }
});
