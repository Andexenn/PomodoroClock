const modes = document.querySelectorAll("[data-time]");
const streak = document.querySelector(".streak");
const timerDisplay = document.querySelector(".display-time");
const button = document.querySelector(".btn");
let countdown;
let currentButtonHandler = null;

function timer(seconds) {
  clearInterval(countdown);

  const now = Date.now();
  const then = now + (seconds) * 1000;

  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000);
    if (secondsLeft < 0) {
      clearInterval(countdown);
      return;
    }
    displayTimeLeft(secondsLeft);
  }, 1000);
}

function startTimer() {
  const seconds = parseInt(this.dataset.time) * 60;
    clearInterval(countdown)
  displayTimeLeft(seconds);
  if (currentButtonHandler) {
    button.removeEventListener("click", currentButtonHandler);
  }
  currentButtonHandler = () => timer(seconds);
  button.addEventListener("click", currentButtonHandler);
}

function displayTimeLeft(seconds) {
  const minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;

  const display = `${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
  timerDisplay.textContent = display;
  document.title = display;
}

modes.forEach((mode) => mode.addEventListener("click", startTimer));
