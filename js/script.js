// S E T U P

const endpoint =
  "https://raw.githubusercontent.com/mariusKroh/worldTime/master/timezones.json";
const timezones = [];
const wrapper = document.querySelector("#wrapper");
const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector(".search-input");
const suggestions = document.querySelector(".suggestions");

fetch(endpoint)
  .then(blob => blob.json())
  .then(data => timezones.push(...data))
  .catch(err => console.log(err));

// R E F A C T O R    I N   T H E   E N D   :)

// S E A R C H   F U N C T I O N A L I T Y
// Find & display search query
function findMatches(wordToMatch, timezones) {
  return timezones.filter(place => {
    const regex = new RegExp(wordToMatch, "gi");
    return place.city.match(regex) || place.country.match(regex);
  });
}

function displayMatches() {
  const matchArray = findMatches(this.value, timezones);
  const html = matchArray
    .map(place => {
      const cityName = place.city;
      const countryName = place.country;
      //const utcOffset = place.offset;
      return `<li class="suggestion">${cityName}, ${countryName}</li>`;
    })
    .join("");
  suggestions.innerHTML = html;
}

// toggle highlight class on mouseover -> can probably be simplified
function addHighlight(e) {
  const target = e.target;
  if (target.tagName != "LI") return;
  target.classList.add("highlight");
}

function removeHighlight(e) {
  const target = e.target;
  if (target.tagName != "LI") return;
  target.classList.remove("highlight");
}

// Load clock when clicking suggestion
function makeClock(e) {
  const target = e.target;
  const content = target.textContent.split(",");
  const regex = new RegExp(content[0], "gi");
  const offset = timezones
    .filter(item => {
      return item.city.match(regex);
    })
    .map(item => {
      return item.offset;
    })
    .join("");
  renderClock(content, offset);

  suggestions.innerHTML = "";
}

// Get all hands of all clocks
function getHands() {
  return {
    secondHand: document.querySelectorAll(".second-hand"),
    minHand: document.querySelectorAll(".min-hand"),
    hourHand: document.querySelectorAll(".hour-hand")
  };
}

function renderClock(city, offset) {
  const name = city;
  const utcOffset = offset;
  const container = document.createElement("div");
  const info = document.createElement("div");
  const clockName = document.createElement("div");
  const terminate = document.createElement("div");
  const clock = document.createElement("div");
  const clockFace = document.createElement("div");
  const hourHand = document.createElement("div");
  const minHand = document.createElement("div");
  const secondHand = document.createElement("div");

  container.classList.add("clock-container");
  clock.classList.add("clock");
  info.classList.add("info");
  clockName.classList.add("clock-name");
  terminate.classList.add("terminate");
  clockFace.classList.add("clock-face");
  hourHand.classList.add("hand");
  hourHand.classList.add("hour-hand");
  hourHand.setAttribute(
    "utc-offset-hours",
    calculateOffset(utcOffset).offsetHours
  );
  minHand.classList.add("hand");
  minHand.classList.add("min-hand");
  minHand.setAttribute(
    "utc-offset-minutes",
    calculateOffset(utcOffset).offsetMinutes
  );
  secondHand.classList.add("hand");
  secondHand.classList.add("second-hand");
  wrapper.appendChild(container);
  container.appendChild(info);
  info.appendChild(clockName);
  info.appendChild(terminate);
  container.appendChild(clock);
  clock.appendChild(clockFace);
  clockFace.appendChild(hourHand);
  clockFace.appendChild(minHand);
  clockFace.appendChild(secondHand);

  clockName.innerHTML = `${name}`;
  terminate.innerHTML = `╳`;
}

// clock functions

function getUTCTime() {
  const now = new Date();
  return {
    hours: now.getUTCHours(),
    minutes: now.getUTCMinutes(),
    seconds: now.getUTCSeconds()
  };
}

function calculateOffset(value) {
  const totalMinutes = value * 60;
  const offsetMinutes = totalMinutes % 60;
  const offsetHours = (totalMinutes - offsetMinutes) / 60;
  return {
    offsetMinutes: offsetMinutes,
    offsetHours: offsetHours
  };
}

function setSeconds(seconds) {
  const secondHandRotation = 90 + seconds * 6;
  return secondHandRotation;
}

function setMinutes(minutes) {
  const minuteHandRotation = 90 + minutes * 6;
  return minuteHandRotation;
}

function setHours(hours) {
  const hourHandRotation = 90 + hours * 30;
  return hourHandRotation;
}
// set time for each of the clocks, still need to separate offset in hours & minutes + include daylight savings
function setTime() {
  const seconds = getUTCTime().seconds;
  const minutes = getUTCTime().minutes;
  const hours = getUTCTime().hours;
  //pauseTransition(seconds);
  const allSeconds = getHands().secondHand;
  const allMinutes = getHands().minHand;
  const allHours = getHands().hourHand;
  allSeconds.forEach(hand => {
    hand.style.transform = `rotate(${setSeconds(seconds)}deg)`;
  });
  allMinutes.forEach(hand => {
    const offset = hand.getAttribute("utc-offset-minutes");
    hand.style.transform = `rotate(${setMinutes(minutes) + offset * 6}deg)`;
  });
  allHours.forEach(hand => {
    const offset = hand.getAttribute("utc-offset-hours");
    hand.style.transform = `rotate(${setHours(hours) + offset * 30}deg)`;
  });

  // set Background
  //setBackground(minutes, seconds, hours);
}

// function setBackground(h, s, l) {
//   const hue = h * 6;
//   const saturation = s * (100 / 60);
//   const light = l * (100 / 60);
//   container.style = `background-color:hsl(${hue},${saturation}%,${light}%)`
// }

setInterval(setTime, 1000);

//function pauseTransition(currentValue) {
// if (currentValue === 0) {
//   secondHand.classList.remove("transition")
// } else {
//   secondHand.classList.add("transition");
// }
// needs update not to call each second, do we actually need seconds in a world clock?
//}

searchInput.addEventListener("change", displayMatches);
searchInput.addEventListener("keyup", displayMatches);

suggestions.addEventListener("mousemove", addHighlight);
suggestions.addEventListener("mouseout", removeHighlight);
suggestions.addEventListener("mouseup", makeClock);

//suggestions.addEventListener("mousemove", populateForm);

///* TO DO
// - needs different logic for utc offset + minutes
//   - no empty submit ( or create utc when empty)
// - error when submitting non list place
//- handle utc offset in h and min
//- handle daylight savings
//- minor menu things (click somewhere to close suggestions fE)
//- terminate clock function
