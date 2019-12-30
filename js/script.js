const secondHand = document.querySelector(".second-hand");
const minHand = document.querySelector(".min-hand");
const hourHand = document.querySelector(".hour-hand");
const container = document.querySelector(".clock-container")
const date = document.querySelector(".date")



function pauseTransition(currentValue) {
  if (currentValue === 0) {
    secondHand.classList.remove("transition")
  } else {
    secondHand.classList.add("transition");
  }
  // needs update not to call eacht second
}

function getUTCTime() {
  const now = new Date()
  const utcHours = now.getUTCHours();
  const utcMinutes = now.getUTCMinutes();
  const utcSeconds = now.getUTCSeconds();
  return {
    utcHours: utcHours,
    utcMinutes: utcMinutes,
    utcSeconds: utcSeconds
  }
}

function setSeconds(seconds) {

  let secondHandRotation = 90 + (seconds * 6);
  return secondHandRotation
}

function setDate() {
  const rotationOffset = 90;

  date.innerHTML = getUTCTime() + "timezone offset is: ";

  const seconds = getUTCTime().utcSeconds;


  pauseTransition(seconds);



  secondHand.style.transform = `rotate(${setSeconds(seconds)}deg)`;

  const minutes = getUTCTime().utcMinutes;
  const minutesDegrees = (minutes / 60) * 360 + 90;
  minHand.style.transform = `rotate(${minutesDegrees}deg)`;

  const hours = getUTCTime().utcHours;
  const hoursDegrees = (hours / 12) * 360 + 90;
  hourHand.style.transform = `rotate(${hoursDegrees}deg)`;
  // set Background
  //setBackground(minutes, seconds, hours);

}

// function setBackground(h, s, l) {
//   const hue = h * 6;
//   const saturation = s * (100 / 60);
//   const light = l * (100 / 60);
//   container.style = `background-color:hsl(${hue},${saturation}%,${light}%)`
// }

setInterval(setDate, 1000);