const secondHand = document.querySelector(".second-hand");
const minHand = document.querySelector(".min-hand");
const hourHand = document.querySelector(".hour-hand");
const container = document.querySelector(".clock-container")

function setDate() {
  const now = new Date();
  const seconds = now.getSeconds();
  const secondsDegrees = (seconds / 60) * 360 + 90;
  secondHand.style.transform = `rotate(${secondsDegrees}deg)`;
  const minutes = now.getMinutes();
  const minutesDegrees = (minutes / 60) * 360 + 90;
  minHand.style.transform = `rotate(${minutesDegrees}deg)`;
  const hours = now.getHours();
  const hoursDegrees = (hours / 12) * 360 + 90;
  hourHand.style.transform = `rotate(${hoursDegrees}deg)`;
  // set Background
  setBackground(minutes, seconds, hours);

}

function setBackground(h, s, l) {
  const hue = h * 6;
  const saturation = s * (100 / 60);
  const light = l * (100 / 60);
  container.style = `background-color:hsl(${hue},${saturation}%,${light}%)`
}

setInterval(setDate, 1000);