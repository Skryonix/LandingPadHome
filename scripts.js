let currentSlide = 0;

function updateCarousel() {
  const slides = document.querySelectorAll(".carousel-slide img");
  const slideWidth = slides[0].clientWidth;
  const gap = 20;

  const maxSlideIndex = slides.length - 1;

  if (currentSlide > maxSlideIndex) currentSlide = 0;
  if (currentSlide < 0) currentSlide = maxSlideIndex;

  const moveDistance = slideWidth + gap;
  document.querySelector(".carousel-slide").style.transform = `translateX(${
    -moveDistance * currentSlide
  }px)`;
}

function tiltOnMouseMove(event) {
    const slide = event.currentTarget;
    const slideWidth = slide.offsetWidth;
    const slideHeight = slide.offsetHeight;
    const tiltMax = 15; 
    const offsetX = (event.clientX - slide.getBoundingClientRect().left) - slideWidth / 2;
    const offsetY = (event.clientY - slide.getBoundingClientRect().top) - slideHeight / 2;

    const tiltX = (offsetY / slideHeight * 2) * tiltMax;
    const tiltY = -(offsetX / slideWidth * 2) * tiltMax;

    const boxShadowEffect = `${-tiltY / 4}px ${tiltX / 4}px 30px rgba(0, 0, 0, 0.4)`;  // Increased shadow for more depth

    slide.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.1)`;  // Scale(1.1) to make the game box pop up
    slide.style.boxShadow = boxShadowEffect;
}

function removeTiltEffect(image) {
    image.style.transform = "scale(1)"; // Resetting the scale to normal
    image.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.2)"; // Resetting the shadow to normal
}

document.addEventListener("DOMContentLoaded", function () {
  // Dark mode toggle functionality
  const darkModeToggle = document.getElementById("darkModeToggle");
  const gif = document.querySelector(".header img");
  const body = document.body;

  function toggleDarkMode() {
    if (body.classList.contains("dark-mode")) {
      body.classList.remove("dark-mode");
      localStorage.setItem("dark-mode", "disabled");
      darkModeToggle.innerText = "Dark Mode";
    } else {
      body.classList.add("dark-mode");
      localStorage.setItem("dark-mode", "enabled");
      darkModeToggle.innerText = "Light Mode";
    }
  }

  if (localStorage.getItem("dark-mode") === "enabled") {
    body.classList.add("dark-mode");
    darkModeToggle.innerText = "Light Mode";
  } else {
    darkModeToggle.innerText = "Dark Mode";
  }

  darkModeToggle.addEventListener("click", toggleDarkMode);
  gif.addEventListener("click", toggleDarkMode);

  // Carousel functionality
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

  updateCarousel();

  // Contact form validation
  const form = document.querySelector("#contactForm");
  const inputs = form.querySelectorAll("input, textarea");
  const submitButton = form.querySelector("input[type='submit']");
  const successMessage = document.createElement("p");
  successMessage.id = "successMessage";
  form.insertBefore(successMessage, form.firstChild);

  function displayError(input, message) {
    const errorMessage = input.nextElementSibling;
    errorMessage.textContent = message;
    input.style.borderColor = "red";
  }

  function validateInput(input) {
    if (!input.checkValidity()) {
      displayError(input, input.validationMessage);
      return false;
    } else {
      input.nextElementSibling.textContent = "";
      input.style.borderColor = "initial";
      return true;
    }
  }

  function checkFormValidity() {
    let isValid = true;
    inputs.forEach((input) => {
      if (!validateInput(input)) {
        isValid = false;
      }
    });
    return isValid;
  }

  inputs.forEach((input) => {
    input.addEventListener("input", function () {
      validateInput(input);
      submitButton.disabled = !checkFormValidity();
    });
  });

  form.addEventListener("submit", function (event) {
    if (!checkFormValidity()) {
      event.preventDefault();
    } else {
      successMessage.textContent = "Form submitted successfully!";
      form.reset();
      setTimeout(() => {
        successMessage.textContent = "";
      }, 5000);
    }
  });

  submitButton.disabled = true;

  // Attach omnidirectional tilt effect to each carousel image
  const slides = document.querySelectorAll(".carousel-slide img");
  slides.forEach((slide) => {
    slide.addEventListener("mousemove", tiltOnMouseMove);
    slide.addEventListener("mouseleave", function() {
      removeTiltEffect(slide);
    });
  });
});