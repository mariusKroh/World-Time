const endpoint = "https://raw.githubusercontent.com/mariusKroh/timezones.json/master/timezones.json";
const timezones = [];
const secondHand = document.querySelector(".second-hand");
const minHand = document.querySelector(".min-hand");
const hourHand = document.querySelector(".hour-hand");
const container = document.querySelector(".clock-container")
const date = document.querySelector(".date")
const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector(".search");
const submitButton = document.querySelector(".make-clock")

fetch(endpoint)
  .then(blob => blob.json())
  .then(data => timezones.push(...data))
  .catch(err => console.log(err));

function findMatches(wordToMatch, timezones) {
  return timezones.filter(place => {
    const regex = new RegExp(wordToMatch, 'gi');
    return place.utc.match(regex) //|| place.state.match(regex)


  })
}

function pauseTransition(currentValue) {
  if (currentValue === 0) {
    secondHand.classList.remove("transition")
  } else {
    secondHand.classList.add("transition");
  }
  // needs update not to call each second, do we actually need seconds in a world clock?
}


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

function setSeconds(seconds) {

  let secondHandRotation = 90 + (seconds * 6);
  return secondHandRotation
}

function setTime() {
  const rotationOffset = 90;

  date.innerHTML = getUTCTime() + "timezone offset is: ";

  const seconds = getUTCTime().seconds;
  const minutes = getUTCTime().minutes;
  const hours = getUTCTime().hours;
  pauseTransition(seconds);



  secondHand.style.transform = `rotate(${setSeconds(seconds)}deg)`;

  const minutesDegrees = (minutes / 60) * 360 + 90;
  minHand.style.transform = `rotate(${minutesDegrees}deg)`;

  const hoursDegrees = (hours / 12) * 360 + 90;
  hourHand.style.transform = `rotate(${hoursDegrees}deg)`;

  // set Background
  //setBackground(minutes, seconds, hours);

}

function makeClock() {
  event.preventDefault()
  const userInput = searchInput.value;
  console.log(userInput);
}

// function setBackground(h, s, l) {
//   const hue = h * 6;
//   const saturation = s * (100 / 60);
//   const light = l * (100 / 60);
//   container.style = `background-color:hsl(${hue},${saturation}%,${light}%)`
// }

setInterval(setTime, 1000);

//searchForm.addEventListener("change", displayMatches);
//searchForm.addEventListener("keyup", displayMatches);
searchForm.addEventListener("submit", makeClock);