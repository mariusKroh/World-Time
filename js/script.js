const endpoint = "https://raw.githubusercontent.com/mariusKroh/worldTime/master/timezones.json";
const timezones = [];
const wrapper = document.querySelector("#wrapper");
const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector(".search");
const submitButton = document.querySelector(".make-clock");
const suggestions = document.querySelector(".suggestions");

// N E E D S  P R O P E R  V A R I A B L E  N A M E S 

// Get timezones from JSON & populate timezones arr
fetch(endpoint)
  .then(blob => blob.json())
  .then(data => timezones.push(...data))
  .catch(err => console.log(err));

// S E A R C H   F U N C T I O N A L I T Y
// Find & display search query
function findMatches(wordToMatch, timezones) {

  return timezones.filter(place => {
    const regex = new RegExp(wordToMatch, 'gi');
    return place.city.match(regex) || place.country.match(regex);
  });
}


function displayMatches() {
  const matchArray = findMatches(this.value, timezones);
  console.log(matchArray);
  const html = matchArray.map(place => {
    const regex = new RegExp(this.value, 'gi');
    const cityName = place.city.replace(regex, this.value);
    const countryName = place.country.replace(regex, this.value);
    return `<li class="suggestion">${cityName}, ${countryName}</li>`;
  }).join("");
  suggestions.innerHTML = html;
}

// toggle highlight class on mouseover - can probably be simplified
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

// populate form when clicking on a suggestion
function populateForm(e) {
  console.log(e);
  const target = e.target;
  if (target.tagName != "LI") return;
  searchInput.value = target.innerHTML;
  suggestions.innerHTML = "";
}

// Get all hands of all clocks 
function getHands() {
  const secondHands = document.querySelectorAll(".second-hand");
  const minHands = document.querySelectorAll(".min-hand");
  const hourHands = document.querySelectorAll(".hour-hand");
  return {
    secondHand: secondHands,
    minHand: minHands,
    hourHand: hourHands
  }
}

// Get UTC Offset from search input & make the clock
function makeClock() {
  event.preventDefault()
  const userInput = searchInput.value.split(",");
  const regex = new RegExp(userInput[0], 'gi');
  const offset = timezones.filter(item => {
    return item.city.match(regex)
  }).map(item => {
    return item.offset
  }).join("");
  renderClock(userInput, offset);
  searchInput.value = "";
  suggestions.innerHTML = "";
}

function renderClock(city, offset) {
  console.log(offset);
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
  hourHand.setAttribute("utc-offset-hours", offset);
  minHand.classList.add("hand");
  minHand.classList.add("min-hand");
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

  clockName.innerHTML = `${name} UTCOffset is: ${utcOffset}`
  terminate.innerHTML = `╳`;
}

// clock functions

function getUTCTime() {
  const now = new Date()
  const utcHours = now.getUTCHours();
  const utcMinutes = now.getUTCMinutes();
  const utcSeconds = now.getUTCSeconds();
  return {
    hours: utcHours,
    minutes: utcMinutes,
    seconds: utcSeconds
  }
}

function calculateOffset(value) {
  const totalMinutes = value * 60;
  const offsetMinutes = totalMinutes % 60;
  const offsetHours = (totalMinutes - offsetMinutes) / 60;
  return {
    offsetMinutes: offsetMinutes,
    offsetHours: offsetHours

  }
}

function setSeconds(seconds) {
  const secondHandRotation = 90 + (seconds * 6);
  return secondHandRotation
}

function setMinutes(minutes) {
  const minuteHandRotation = 90 + (minutes * 6);
  return minuteHandRotation
}

function setHours(hours) {
  const hourHandRotation = 90 + (hours * 30);
  return hourHandRotation
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
    hand.style.transform = `rotate(${setMinutes(minutes)}deg)`;
  });
  allHours.forEach(hand => {
    const offset = hand.getAttribute("utc-offset-hours");
    hand.style.transform = `rotate(${(setHours(hours))+ offset * 30 }deg)`;
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

searchForm.addEventListener("mousemove", addHighlight);
searchForm.addEventListener("mouseout", removeHighlight);

suggestions.addEventListener("click", populateForm);
//suggestions.addEventListener("mousemove", populateForm);

searchForm.addEventListener("submit", makeClock);


///* TO DO 
//   - no empty submit ( or create utc when empty)
// - error when submitting non list place
//- handle utc offset in h and min
//- handle daylight savings
//- minor menu things (click somewhere to close suggestions fE)
//- terminate clock function