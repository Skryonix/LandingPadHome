let currentSlide = 0;

function updateCarousel() {
  const slides = document.querySelectorAll(".carousel-game");
  if (slides.length === 0) {
    console.error("No slides found. Make sure your HTML contains elements with class '.carousel-game'.");
    return;
  }

  // Use the width of the first slide as the width for all slides
  const slideWidth = slides[0].offsetWidth;
  const gap = 20; 
  const maxSlideIndex = slides.length - 1;

  // Update currentSlide to stay within bounds
  currentSlide = (currentSlide > maxSlideIndex) ? 0 : (currentSlide < 0) ? maxSlideIndex : currentSlide;

  // Calculate total distance to move
  const moveDistance = (slideWidth + gap) * currentSlide;
  document.querySelector(".carousel-slide").style.transform = `translateX(${-moveDistance}px)`;
}

document.addEventListener("DOMContentLoaded", function () {
  // Carousel controls
  const prevButton = document.querySelector(".prev-btn");
  const nextButton = document.querySelector(".next-btn");

  prevButton.addEventListener("click", function () {
    currentSlide--;
    updateCarousel();
  });

  nextButton.addEventListener("click", function () {
    currentSlide++;
    updateCarousel();
  });

  // Initialize the carousel position
  updateCarousel();
});
// Dark mode toggle functionality
function toggleDarkMode() {
  const body = document.body;
  const darkModeToggle = document.getElementById("darkModeToggle");
  body.classList.toggle("dark-mode");
  const isDarkMode = body.classList.contains("dark-mode");
  localStorage.setItem("dark-mode", isDarkMode ? "enabled" : "disabled");
  darkModeToggle.innerText = isDarkMode ? "Light Mode" : "Dark Mode";
}

// Get the weather data from OpenWeatherMap API
async function getWeather() {
  if (!navigator.geolocation) {
    console.error("Geolocation is not supported by your browser");
    return;
  }

  function success(position) {
    const apiKey = '2cafd8e15fd7c6f38c757a64acf77bea';
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        displayWeather(data);
      })
      .catch(error => {
        console.error("Error fetching weather data:", error);
      });
  }

  function error(err) {
    console.error(`Geolocation error (${err.code}): ${err.message}`);
  }

  navigator.geolocation.getCurrentPosition(success, error);
}

function displayWeather(data) {
  const cityElem = document.getElementById('weather-city');
  const tempElem = document.getElementById('weather-temp');
  const descElem = document.getElementById('weather-desc');
  const iconElem = document.getElementById('weather-icon');

  if (!cityElem || !tempElem || !descElem || !iconElem) {
    console.error("One or more weather display elements are missing in the HTML structure.");
    return;
  }

  cityElem.textContent = data.name;
  tempElem.textContent = `${data.main.temp.toFixed(1)}°C`;
  descElem.textContent = data.weather[0].description;
  iconElem.src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
  iconElem.alt = data.weather[0].description;
}

document.addEventListener("DOMContentLoaded", function () {
  // Initialize all functionalities

  // Weather initialization
  getWeather();

  // Dark Mode initialization
  const darkModeToggle = document.getElementById("darkModeToggle");
  if (!darkModeToggle) {
    console.error("Dark mode toggle button not found.");
    return;
  }
  const gif = document.querySelector(".header img");
  if (!gif) {
    console.error("Header image for dark mode toggle not found.");
    return;
  }
  const darkModeEnabled = localStorage.getItem("dark-mode") === "enabled";
  document.body.classList.toggle("dark-mode", darkModeEnabled);
  darkModeToggle.innerText = darkModeEnabled ? "Light Mode" : "Dark Mode";

  // Tilt effect on carousel images
  const slides = document.querySelectorAll(".carousel-slide img");
  if (slides.length === 0) {
    console.error("No carousel images found for tilt effect.");
    return;
  }
  slides.forEach(slide => {
    slide.addEventListener("mousemove", tiltOnMouseMove);
    slide.addEventListener("mouseleave", removeTiltEffect);
  });
});
