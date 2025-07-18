let userPrefs = {
  name: "—",
  preferredTemp: 0
};

function showToast(message = "Preferences saved!") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

document.getElementById("preferences-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const preferredTemp = parseInt(document.getElementById("preferredTemp").value);

  userPrefs = { name, preferredTemp };
  showToast("Preferences saved!");
});

function checkWeather() {
  const city = document.getElementById("cityInput").value;
  const apiKey = "30a575618fe6784d61f3352d26a7c75a";

  if (!city) {
    alert("Please enter a city");
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.cod !== 200) {
        document.getElementById("weatherResult").innerHTML = `<p>⚠️ ${data.message}</p>`;
        return;
      }

      const weatherData = {
        description: data.weather[0].description,
        temp: Math.round(data.main.temp)
      };

      document.getElementById("weatherResult").innerHTML = `
        <h3>Weather in ${city}</h3>
        <p>${weatherData.description}, ${weatherData.temp}°C</p>
      `;

      generateFakeNotification(userPrefs, weatherData);
    })
    .catch(err => {
      document.getElementById("weatherResult").innerHTML = `<p>❌ Failed to fetch weather. Check connection or city name.</p>`;
    });
}

function generateFakeNotification(userPrefs, weatherData) {
  const { name, preferredTemp } = userPrefs;
  const { description, temp } = weatherData;

  let message = `Hey ${name || "there"}! It's ${description} and ${temp}°C. `;

  if (temp < preferredTemp) {
    message += "It’s colder than you like – wear something warm! 🧥";
  } else if (temp > preferredTemp + 5) {
    message += "It’s hotter than your preference – stay hydrated! 🥤";
  } else {
    message += "Weather looks great – enjoy your day! 🌤️";
  }

  document.getElementById("weatherResult").innerHTML += `<p>${message}</p>`;
}
