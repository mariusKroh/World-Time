// S E T U P
const endpoint =
  "https://raw.githubusercontent.com/mariusKroh/simpleWorldTimeZones/master/timezones.json";
const timezones = [];
const wrapper = document.querySelector("#wrapper");
const searchInput = document.querySelector(".search-input");
const suggestions = document.querySelector(".suggestions");
const topBar = document.querySelector("#top-bar");
const title = document.querySelector(".title");
const dots = document.querySelector(".dots-icon");
const menu = document.querySelector("#slideout-menu");
const hideSecondLabel = document.querySelector("#hide-second");
const hideBackgroundLabel = document.querySelector("#plain-style");
const colorPicker = document.querySelector("#highlight-color");

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
  console.count("Add highlight");
  let target = e.type === "mousemove" ? e.target : e;

  // prevent highlighting of more than one result by first deactivating all
  const listElements = document.querySelectorAll(".suggestion");
  listElements.forEach(element => {
    element.classList.remove("highlight");
    element.removeAttribute("style");
  });
  target.classList.add("highlight");
  changeHighlightColor();
}

// Accessible menu with up,down and enter keys
function navigateSuggestions(e) {
  if (e.keyCode != 38 && e.keyCode != 40 && e.keyCode != 13) return;
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
  toggleTitleBackground();
}
// Switch title background for readability & check for all cases
function toggleTitleBackground() {
  if (
    window.innerWidth >= 768 &&
    title.classList.contains("background-bright")
  ) {
    return;
  }
  title.classList.toggle("background-dark");
  title.classList.toggle("color-bright");
  title.classList.toggle("background-bright");
  title.classList.toggle("color-dark");
}

// Check if title has to change background on window resize
function checkTitle() {
  if (
    window.innerWidth <= 767 &&
    title.classList.contains("background-bright") &&
    menu.classList.contains("active")
  ) {
    toggleTitleBackground();
  } else if (
    window.innerWidth >= 768 &&
    title.classList.contains("background-dark")
  ) {
    toggleTitleBackground();
  } else {
    return;
  }
}
// S E T T I N G S
// Hide all second hands
function hideSecondHand() {
  const allSecondHands = document.querySelectorAll(".second-hand");
  if (hideSecondLabel.checked) {
    allSecondHands.forEach(hand => hand.classList.add("display-none"));
  } else {
    allSecondHands.forEach(hand => hand.classList.remove("display-none"));
  }
}

// Hide clock backgrounds (hides clock frame as long as there is no custom backgrund function)
function hideClockBackground() {
  const allClocks = document.querySelectorAll(".clock");
  if (hideBackgroundLabel.checked) {
    allClocks.forEach(clock => clock.classList.add("no-border"));
  } else {
    allClocks.forEach(clock => clock.classList.remove("no-border"));
  }
}

// Custom highlight color
function changeHighlightColor() {
  const newColor = colorPicker.value;
  const picker = document.querySelector(".pick-color");
  const hourHands = document.querySelectorAll(".hour-hand");
  hourHands.forEach(hand => (hand.style.background = newColor));
  picker.style.backgroundColor = newColor;

  const highlight = document.querySelector(".highlight");
  highlight.style.backgroundColor = newColor;
}

// C L O C K   S T U F F
// Prepare clock data from suggestions drop-down
function makeClock(e) {
  let target = e.type === "mouseup" ? e.target : e;

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
  setTimeout(addHandTransition, 1000);
}

// Render clock to DOM - this can surely be written more compact? very long!
function renderClock(city, offset, isdst) {
  const name = city;
  const utcOffset = offset;
  //const daylightSavings = isdst;
  const container = document.createElement("div");
  const info = document.createElement("div");
  const clockName = document.createElement("div");
  const amPm = document.createElement("div");
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
  amPm.classList.add("am-pm");

  terminate.classList.add("terminate");
  clockFace.classList.add("clock-face");
  hourHand.classList.add("hand");
  hourHand.classList.add("hour-hand");
  // hourHand.classList.add("transition");
  hourHand.setAttribute(
    "utc-offset-hours",
    calculateOffset(utcOffset).offsetHours
  );
  //hourHand.setAttribute("daylight-savings");
  minHand.classList.add("hand");
  minHand.classList.add("min-hand");
  //minHand.classList.add("transition");
  minHand.setAttribute(
    "utc-offset-minutes",
    calculateOffset(utcOffset).offsetMinutes
  );
  secondHand.classList.add("hand");
  secondHand.classList.add("second-hand");
  //secondHand.classList.add("transition");
  wrapper.appendChild(container);
  container.appendChild(info);
  info.appendChild(clockName);
  info.appendChild(amPm);
  info.appendChild(terminate);
  container.appendChild(clock);
  clock.appendChild(clockFace);
  clockFace.appendChild(hourHand);
  clockFace.appendChild(minHand);
  clockFace.appendChild(secondHand);
  // check for user settings & apply
  hideSecondHand();
  hideClockBackground();
  // changeHighlightColor();

  clockName.innerHTML = `${name}`;
  terminate.innerHTML = `✕`;
}
// Check for transition class & add afterwards, to prevent weird loading glitch
function addHandTransition() {
  const allHands = getHands();
  allHands.forEach(hand => {
    if (hand.classList.contains("transition")) {
      return;
    } else {
      hand.classList.add("transition");
    }
  });
}

// Calculate offset from UTC
function calculateOffset(value, isdst) {
  const now = new Date();
  const currentMinutes = now.getUTCMinutes();
  const totalMinutes = value * 60;
  let fixHours = 0;
  const offsetMinutes = totalMinutes % 60;
  // messy fix for incorrect display of time when offset is not full hours
  if (currentMinutes + offsetMinutes >= 60) {
    fixHours = 1;
  }
  const offsetHours = (totalMinutes - offsetMinutes) / 60 + fixHours;
  return {
    offsetMinutes: offsetMinutes,
    offsetHours: offsetHours
  };
}

// Calculate and display AM/PM indicator
function getAmPm(hourHand, offsetByHour) {
  const UTCHours = Math.round(getUTCTime().UTCHours);
  const offset = parseInt(offsetByHour);
  const clockHours =
    UTCHours + offset < 0 ? 24 + (UTCHours + offset) : UTCHours + offset;
  const amPm = clockHours >= 12 && clockHours < 24 ? "PM" : "AM";
  const currentClockContainer = hourHand.closest(".clock-container");
  const indicator = currentClockContainer.querySelector(".am-pm");
  indicator.innerHTML = amPm;
}

// Get all hands of all clocksow
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

// Init UTC time with ms
function getUTCTime() {
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
  return {
    UTCHours: hours,
    UTCMinutes: minutes,
    UTCSeconds: seconds
  };
}

//Set time for all clocks, letting all come together here
function setTime() {
  const currentTime = getUTCTime();
  const allHands = getHands();
  allHands.forEach(hand => {
    if (hand.classList.contains("hour-hand")) {
      const offset = hand.getAttribute("utc-offset-hours");
      hand.style.transform = `rotate(${setHours(currentTime.UTCHours) +
        offset * 30}deg)`;
      //Set AmPm flag
      getAmPm(hand, offset);
    } else if (hand.classList.contains("min-hand")) {
      const offset = hand.getAttribute("utc-offset-minutes");
      hand.style.transform = `rotate(${setMinutes(currentTime.UTCMinutes) +
        offset * 6}deg)`;
    } else {
      hand.style.transform = `rotate(${setSeconds(currentTime.UTCSeconds)}deg)`;
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
window.addEventListener("resize", checkTitle);
hideSecondLabel.addEventListener("click", hideSecondHand);
hideBackgroundLabel.addEventListener("click", hideClockBackground);
colorPicker.addEventListener("change", changeHighlightColor);

searchInput.addEventListener("change", displayMatches);
searchInput.addEventListener("keyup", displayMatches);

suggestions.addEventListener("mousemove", addHighlight);
suggestions.addEventListener("mouseup", makeClock);

window.addEventListener("keydown", navigateSuggestions);
window.addEventListener("click", closeSuggestions);
window.addEventListener("click", terminateClock);

setInterval(setTime, 1000);
