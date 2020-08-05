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
    icon_url:       `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
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
    displayData(filterWeatherData(weather));
  } catch (error) {
    displayData("Wrong parameters");
  } finally {
    loading = false;
  }
});

function displayData (data) {
  const info_element = document.getElementById("info");

  if (typeof data === "string") {
    info_element.innerHTML = [
      "<div>",
      `<p class="error">${data}</p>`,
      "</div>",
    ].join("");
  } else {
    let lines = [
      "<div>",
        '<div class="description">',
          "<div>",
            `<p>${data.group}</p>`,
            `<p>${data.description}</p>`,
          "</div>",
          `<img src="${data.icon_url}" />`,
        "</div>",
        `<p class="temperature">${data.temperature}</p>`,
        `<p class="temperature-feels"><small>Feels like ${data.feels_like}</small></p>`,
        "<table>",
          "<tr>",
            data.rain ? '<td class="rain">Rain</td>' : "",
            data.snow ? '<td class="snow">Snow</td>' : "",
            data.clouds ? '<td class="clouds">Clouds</td>' : "",
            data.wind_speed ? '<td class="wind">Wind</td>' : "",
          "</tr>",
          "<tr>",
            data.rain ? `<td class="rain">${data.rain}</td>` : "",
            data.snow ? `<td class="snow">${data.snow}</td>` : "",
            data.clouds ? `<td class="clouds">${data.clouds}</td>` : "",
            data.wind_speed ? `<td class="wind">${data.wind_speed}</td>` : "",
          "</tr>",
        "</table>",
      "</div>",
    ];
    info_element.innerHTML = lines.join("");
  }
}
