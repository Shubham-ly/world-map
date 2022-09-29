import "./style.css";

const mapContainer = document.querySelector("#map-container");
const app = document.querySelector("#app");
const zoomInButton = document.querySelector('#zoom-in')
const zoomOutButton = document.querySelector('#zoom-out')
const countries = document.querySelectorAll('#map-container path');

const evCache = [];
let prevDiff = -1;

app.onpointerdown = pointerdownHandler;
app.onpointermove = pointermoveHandler;
app.onpointerup = pointerupHandler;
app.onpointercancel = pointerupHandler;
app.onpointerout = pointerupHandler;
app.onpointerleave = pointerupHandler;

function pointerdownHandler(ev) {
}
function pointermoveHandler(ev) {

}
function pointerupHandler(ev) {

}

let scale = 1,
  isPanning = false,
  pivotX = 0,
  pivotY = 0,
  start = { x: 0, y: 0 };

function setTransform(transitionDuration = null) {
  if (transitionDuration) {
    mapContainer.style.transition = `transform ease ${transitionDuration}ms`
  } else {
    mapContainer.style.transition = 'none'
  }
  mapContainer.style.transform = `translate(${pivotX}px, ${pivotY}px) scale(${scale})`;
}

app.addEventListener("mousedown", (e) => {
  e.preventDefault();
  start = { x: e.clientX - pivotX, y: e.clientY - pivotY };
  isPanning = true;
});
app.addEventListener('touchstart', e => {
  e.preventDefault();
  const touchPosition = e.targetTouches[0]
  start = { x: touchPosition.clientX - pivotX, y: touchPosition.clientY - pivotY };
  isPanning = true;
})
app.addEventListener("mouseleave", _ => {
  isPanning = false
})

app.addEventListener('touchend', e => {
  isPanning = false
})

app.addEventListener("mouseup", (e) => {
  isPanning = false;
});
app.addEventListener('touchcancel', e => {
  isPanning = false
})

app.addEventListener("mousemove", (e) => {
  e.preventDefault();
  if (!isPanning) return;

  pivotX = e.clientX - start.x;
  pivotY = e.clientY - start.y;
  setTransform();
});
app.addEventListener('touchmove', e => {
  e.preventDefault()
  const touchPosition = e.targetTouches[0]
  if (!isPanning) return;
  pivotX = touchPosition.clientX - start.x;
  pivotY = touchPosition.clientY - start.y
  setTransform()
})

app.addEventListener("wheel", (e) => {
  e.preventDefault();
  let xs = (e.clientX - pivotX) / scale,
    ys = (e.clientY - pivotY) / scale,
    delta = e.wheelDelta ? e.wheelDelta : -e.deltaY;
  delta > 0 ? (scale *= 1.1) : (scale /= 1.1);
  pivotX = e.clientX - xs * scale;
  pivotY = e.clientY - ys * scale;
  setTransform();
});

zoomInButton.addEventListener('click', _ => zoomIn())
zoomInButton.addEventListener('touchstart', e => { e.stopPropagation(); zoomIn() })
function zoomIn(factor = 1.4) {
  scale *= factor
  setTransform(350)
}
zoomOutButton.addEventListener('click', _ => zoomOut())
zoomOutButton.addEventListener('touchstart', e => { e.stopPropagation(); zoomOut() })
function zoomOut(factor = 1.4) {
  scale /= factor
  setTransform(350)
}
function moveAndZoom(currentCountry) {
  scale = 1
  const mapDimensions = mapContainer.getBoundingClientRect()
  pivotX = (mapDimensions.x + mapDimensions.width / 2) - currentCountry.x - currentCountry.width / 2
  pivotY = (mapDimensions.y + mapDimensions.height / 2) - currentCountry.y - currentCountry.height / 2
  if (currentCountry.width < 50) scale = 2.8
  else if (currentCountry.width < 140) scale = 1.6
  else if (currentCountry.width < 200) scale = 1.2
  else if (currentCountry.width < 300) scale = 1
  else if (currentCountry.width < 500) scale = 0.6
  // scale /= currentCountry.width * 0.01
  setTransform(350)
}

countries.forEach(country => {
  country.addEventListener('pointerdown', e => {
    e.stopPropagation()
    const currentCountry = e.currentTarget.getBoundingClientRect();
    moveAndZoom(currentCountry);
  })
})