// S E T U P

const endpoint =
  "https://raw.githubusercontent.com/mariusKroh/simpleWorldTimeZones/master/timezones.json";
const timezones = [];
const wrapper = document.querySelector("#wrapper");
const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector(".search-input");
const suggestions = document.querySelector(".suggestions");

fetch(endpoint)
  .then(blob => blob.json())
  .then(data => timezones.push(...data))
  .catch(err => console.error(err));

// S E A R C H   F U N C T I O N A L I T Y
// Find & display search query
function findMatches(wordToMatch, timezones) {
  if (wordToMatch === "") {
    suggestions.innerHTML = "";
    return;
  }
  return timezones.filter(place => {
    const regex = new RegExp(wordToMatch, "gi");
    return place.city.match(regex) || place.country.match(regex);
  });
}

function displayMatches(e) {
  if (e.keyCode === 38 || e.keyCode === 40) return;
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

// Get mouseevent or keypress on suggestions + toggle highlight class
function addHighlight(e) {
  if (suggestions.innerHTML === "") return;
  console.count("fire add highlight");
  let target;
  console.log(e.type);

  e.type === "mousemove" ? (target = e.target) : (target = e);
  // prevent highlighting of more than one result by first deactivating all
  const listElements = document.querySelectorAll(".suggestion");
  listElements.forEach(element => {
    element.classList.remove("highlight");
  });
  target.classList.add("highlight");
}

// Accessible menu with up,down and enter keys
function navigateSuggestions(e) {
  if (e.keyCode != 38 && e.keyCode != 40 && e.keyCode != 13) return;
  // Add IDs to each list element
  let listElements = document.querySelectorAll(".suggestion");
  listElements.forEach((element, index) => {
    element.id = index;
  });
  if (e.keyCode === 40 && !hasHighlight(listElements)) {
    addHighlight(listElements[0]);
  } else if (e.keyCode === 40) {
    const current = whichHighlight(listElements);
    let activeID = current[0].id;
    activeID < listElements.length - 1 ? activeID++ : (activeID = 0);
    addHighlight(listElements[activeID]);
  } else if (e.keyCode === 38 && !hasHighlight(listElements)) {
    const lastItem = listElements.length - 1;
    addHighlight(listElements[lastItem]);
  } else if (e.keyCode === 38) {
    const lastItem = listElements.length - 1;
    const current = whichHighlight(listElements);
    let activeID = current[0].id;
    activeID > 0 ? activeID-- : (activeID = lastItem);
    addHighlight(listElements[activeID]);
  } else {
    e.preventDefault();
    const current = whichHighlight(listElements);
    makeClock(current[0]);
  }
}

// Check if any suggestion is already active
function hasHighlight(menuItems) {
  const isActive = [...menuItems].map(item => {
    return item.classList.contains("highlight");
  });
  const bool = arr => arr.some(Boolean);
  return bool(isActive);
}

// Return element which is active
function whichHighlight(menuItems) {
  const which = [...menuItems].filter(item => {
    return item.classList.contains("highlight");
  });
  return which;
}

// Close suggestions when clicking somewhere else
function closeSuggestions(e) {
  if (e.target.tagName === "INPUT") return;
  searchInput.value = "";
  suggestions.innerHTML = "";
}

// C L O C K   S T U F F
// Prepare clock data
function makeClock(e) {
  let target;
  e.type === "mouseup" ? (target = e.target) : (target = e);

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
  const daylightSavings = timezones
    .filter(item => {
      return item.city.match(regex);
    })
    .map(item => {
      return item.isdst;
    })
    .join("");
  renderClock(content, offset, daylightSavings);
  searchInput.value = "";
  searchInput.blur();
  suggestions.innerHTML = "";
}

// Render clock to DOM
function renderClock(city, offset, isdst) {
  const name = city;
  const utcOffset = offset;
  const daylightSavings = isdst;
  const container = document.createElement("div");
  const info = document.createElement("div");
  const clockName = document.createElement("div");
  const terminate = document.createElement("div");
  const clock = document.createElement("div");
  const clockFace = document.createElement("div");
  const hourHand = document.createElement("div");
  const minHand = document.createElement("div");
  const secondHand = document.createElement("div");
  console.log(daylightSavings);

  container.classList.add("clock-container");
  clock.classList.add("clock");
  info.classList.add("info");
  clockName.classList.add("clock-name");
  terminate.classList.add("terminate");
  clockFace.classList.add("clock-face");
  hourHand.classList.add("hand");
  hourHand.classList.add("hour-hand");
  hourHand.classList.add("transition");

  hourHand.setAttribute(
    "utc-offset-hours",
    calculateOffset(utcOffset).offsetHours
  );
  //hourHand.setAttribute("daylight-savings");
  minHand.classList.add("hand");
  minHand.classList.add("min-hand");
  minHand.classList.add("transition");
  minHand.setAttribute(
    "utc-offset-minutes",
    calculateOffset(utcOffset).offsetMinutes
  );
  secondHand.classList.add("hand");
  secondHand.classList.add("second-hand");
  secondHand.classList.add("transition");
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
  terminate.innerHTML = `✕`;
}

// Get all hands of all clocks
function getHands() {
  return {
    secondHand: document.querySelectorAll(".second-hand"),
    minHand: document.querySelectorAll(".min-hand"),
    hourHand: document.querySelectorAll(".hour-hand")
  };
}

// Get UTC time (no shit sherlock)
function getUTCTime() {
  const now = new Date();
  return {
    hours: now.getUTCHours(),
    minutes: now.getUTCMinutes(),
    seconds: now.getUTCSeconds()
  };
}

function calculateOffset(value, isdst) {
  const totalMinutes = value * 60;
  let fixHours = 0;
  const offsetMinutes = totalMinutes % 60;
  // messy fix for incorrect display of time when offset also contains minutes
  const currentMinutes = getUTCTime().minutes;
  if (currentMinutes + offsetMinutes >= 60) {
    fixHours = 1;
  }
  const offsetHours = (totalMinutes - offsetMinutes) / 60 + fixHours;
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
  pauseTransition(seconds);
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

// Pause transition at 0 to fix weird glitch (this is rudimentary)
function pauseTransition(currentValue) {
  const allSeconds = getHands().secondHand;
  if (currentValue === 0) {
    allSeconds.forEach(hand => {
      hand.classList.remove("transition");
    });
  } else if (currentValue === 1) {
    allSeconds.forEach(hand => {
      hand.classList.add("transition");
    });
  } else {
    return;
  }
}

// Remove clock from DOM - but stylish

function terminateClock(e) {
  if (!e.target.classList.contains("terminate")) return;
  const thisClock = e.target.closest(".clock-container");
  thisClock.classList.add("fade-out");
  setTimeout(() => thisClock.parentNode.removeChild(thisClock), 1000);
}

searchInput.addEventListener("change", displayMatches);
searchInput.addEventListener("keyup", displayMatches);

suggestions.addEventListener("mousemove", addHighlight);
suggestions.addEventListener("mouseup", makeClock);

window.addEventListener("keydown", navigateSuggestions);
window.addEventListener("click", closeSuggestions);
window.addEventListener("click", terminateClock);

///* TO DO
// styling
// hand transitions
// info menu
//- handle daylight savings
//- terminate clock function
//- return strings from filter
// clean up conditionals
// clean up variable & parameter names
// prevent firing highlight too often
// add localstorage
// bonus:
// no double clocks?
// swicht to digital
// toggle secondhand
// color styles
// smooth loading of clocks
// am/pm
// continous rotation of secondhand
// hide menu bar
