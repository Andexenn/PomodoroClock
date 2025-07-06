const modes = document.querySelectorAll("[data-time]");
const streak = document.querySelector(".streak");
const timerDisplay = document.querySelector(".display-time");
const button = document.querySelector(".btn");

const TODO = document.querySelector(".to-do");
const addItems = document.querySelector(".add-items");
let items = JSON.parse(localStorage.getItem("items")) || [];

let countdown;
let currentButtonHandler = null;
let isPomodoro = false;

function timer(seconds) {
  clearInterval(countdown);

  const now = Date.now();
  const then = now + seconds * 1000;

  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000);
    if (secondsLeft < 0) {
      clearInterval(countdown);
      if (isPomodoro) {
        let currentStreak = parseInt(streak.textContent, 10) || 0;
        streak.textContent = currentStreak + 1;
      }

      items = items.filter((item) => item.done);
      populateList(items, TODO);
      return;
    }
    displayTimeLeft(secondsLeft);
  }, 1000);
}

function startTimer() {
  isPomodoro = this.dataset.time === "25";
  const seconds = parseInt(this.dataset.time) * 60;
  clearInterval(countdown);
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

function addItem(e) {
  e.preventDefault();
  const text = this.querySelector("[name=item]").value;
  const item = {
    text,
    done: false,
  };

  items.push(item);
  populateList(items, TODO);
  localStorage.setItem("items", JSON.stringify(items));
  this.reset();
}

function populateList(list = [], TODO) {
  TODO.innerHTML = list
    .map((task, i) => {
      return `<li>
                <input type="checkbox" data-index = ${i} id = "item${i}" ${
        task.done ? "checked" : ""
      } />
                <label for = "item${i}">${task.text}</label>
      </li>`;
    })
    .join("");
}

function toggleDone(e){
  if(!e.target.matches("input")) return;
  const el = e.target;
  const index = el.dataset.index;
  items[index].done = !items[index].done;
  localStorage.setItem("items", JSON.stringify(items));
  populateList(items, TODO);
}

addItems.addEventListener("submit", addItem);

TODO.addEventListener("click", toggleDone);

populateList(items, TODO);
