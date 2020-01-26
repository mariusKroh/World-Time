// S E T U P
// avoid globals?
const endpoint =
  "https://raw.githubusercontent.com/mariusKroh/simpleWorldTimeZones/master/timezones.json";
const timezones = [];
const wrapper = document.querySelector("#wrapper");
const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector(".search-input");
const suggestions = document.querySelector(".suggestions");
const topBar = document.querySelector("#top-bar");
const title = document.querySelector(".title");
const dots = document.querySelector(".dots-icon");
const menu = document.querySelector("#slideout-menu");

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

// Toggle slideout-menu
function toggleMenu() {
  const topBarHeight = topBar.offsetHeight;
  menu.style.paddingTop = topBarHeight + "px";

  menu.classList.toggle("active");
  dots.classList.toggle("color-dark");
  title.classList.toggle("background-dark");
  title.classList.toggle("color-bright");
  title.classList.toggle("background-bright");
  title.classList.toggle("color-dark");
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
  //console.log(daylightSavings);

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

function calculateOffset(value, isdst) {
  const now = new Date();
  const currentMinutes = now.getUTCMinutes();
  const totalMinutes = value * 60;
  let fixHours = 0;
  const offsetMinutes = totalMinutes % 60;
  // messy fix for incorrect display of time when offset also contains minutes
  if (currentMinutes + offsetMinutes >= 60) {
    fixHours = 1;
  }
  const offsetHours = (totalMinutes - offsetMinutes) / 60 + fixHours;
  return {
    offsetMinutes: offsetMinutes,
    offsetHours: offsetHours
  };
}

// Get all hands of all clocks
function getHands() {
  const hands = document.querySelectorAll(".hand");
  return hands;
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

// Set time for each of the clocks by initializing with UTC time in ms
// still need to include daylight savings
function setTime() {
  const now = new Date();
  const utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
  const then = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0
  );
  const milliSeconds = utc.getTime() - then.getTime();
  const hours = milliSeconds / (1000 * 60 * 60);
  const minutes = hours * 60;
  const seconds = minutes * 60;
  const allHands = getHands();
  allHands.forEach(hand => {
    if (hand.classList.contains("hour-hand")) {
      const offset = hand.getAttribute("utc-offset-hours");
      hand.style.transform = `rotate(${setHours(hours) + offset * 30}deg)`;
    } else if (hand.classList.contains("min-hand")) {
      const offset = hand.getAttribute("utc-offset-minutes");
      hand.style.transform = `rotate(${setMinutes(minutes) + offset * 6}deg)`;
    } else {
      hand.style.transform = `rotate(${setSeconds(seconds)}deg)`;
    }
  });
  // setBackground();
}

// // Set background according to current time - trying to visualise day/night here
// function setBackground() {
//   const allClocks = document.querySelectorAll(".clock");
//   // Need each clock seperatly
//   allClocks.forEach((clock, index) => {
//     clock.id = `clock-${index}`;
//     const currentClock = document.querySelector(`#clock-${index}`);
//     const hourHand = currentClock.querySelector(".hour-hand");
//     const minHand = currentClock.querySelector(".min-hand");
//     const secondHand = currentClock.querySelector(".second-hand");
//     // Get rotation values for each hand by stripping the string down to only the number
//     const hourHandRotation = hourHand.style.transform.replace(/\D/g, "");
//     const minHandRotation = minHand.style.transform.replace(/\D/g, "");
//     const secondHandRotation = secondHand.style.transform.replace(/\D/g, "");
//     // Now do something with the background property
//     // But rotation is an ever increasing ms value!
//     // Needs a way to display time passed since beginning of current day!
//     console.table([hourHandRotation, minHandRotation, secondHandRotation]);
//     const colorDark = "#001c00";
//     const colorBright = "#f8f8f8";
//     currentClock.style.background = `linear-gradient(${hourHandRotation}deg, ${colorDark} 50%, ${colorBright} 100%`;
//   });
// }

// Remove clock from DOM - but stylish
function terminateClock(e) {
  if (!e.target.classList.contains("terminate")) return;
  const thisClock = e.target.closest(".clock-container");
  thisClock.classList.add("fade-out");
  setTimeout(() => thisClock.parentNode.removeChild(thisClock), 1000);
}
dots.addEventListener("click", toggleMenu);
searchInput.addEventListener("change", displayMatches);
searchInput.addEventListener("keyup", displayMatches);

suggestions.addEventListener("mousemove", addHighlight);
suggestions.addEventListener("mouseup", makeClock);

window.addEventListener("keydown", navigateSuggestions);
window.addEventListener("click", closeSuggestions);
window.addEventListener("click", terminateClock);

setInterval(setTime, 1000);
