import "./style.css";

const mapContainer = document.querySelector("#map-container");
const app = document.querySelector("#app");
let scale = 1,
  isPanning = false,
  pivotX = 0,
  pivotY = 0,
  start = { x: 0, y: 0 };
console.log(mapContainer);

function setTransform() {
  mapContainer.style.transform = `translate(${pivotX}px, ${pivotY}px) scale(${scale})`;
}

app.addEventListener("mousedown", (e) => {
  e.preventDefault();
  start = { x: e.clientX - pivotX, y: e.clientY - pivotY };
  isPanning = true;
});

app.addEventListener("mouseup", (e) => {
  isPanning = false;
});

app.addEventListener("mousemove", (e) => {
  e.preventDefault();
  if (!isPanning) return;

  pivotX = e.clientX - start.x;
  pivotY = e.clientY - start.y;
  setTransform();
});

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
