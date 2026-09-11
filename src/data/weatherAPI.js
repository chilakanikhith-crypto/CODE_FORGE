const API_KEY = "b1a7951f157fe7c01d41769c559d4999";

export async function getWeather() {

  const city = "Hyderabad";

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
  );

  const data = await response.json();

  return {
    temperature: data.main.temp,
    humidity: data.main.humidity,
    condition: data.weather[0].description,
    wind: data.wind.speed
  };
}