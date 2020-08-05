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

getCurrentWeather("London").then(data => console.log(data));
