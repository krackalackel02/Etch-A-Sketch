let slider = document.getElementById("grid-size-slider");
slider.min = 1;
slider.max = 100;
slider.value = 64;
slider.step = 1;
let grid = document.getElementById("canvas");

function invertColor(hex) {
	if (hex.indexOf("#") === 0) {
		hex = hex.slice(1);
	}
	// convert 3-digit hex to 6-digits.
	if (hex.length === 3) {
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
	}
	if (hex.length !== 6) {
		throw new Error("Invalid HEX color.");
	}
	// invert color components
	var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
		g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
		b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
	// pad each with zeros and return
	return "#" + padZero(r) + padZero(g) + padZero(b);
}

function padZero(str, len) {
	len = len || 2;
	var zeros = new Array(len).join("0");
	return (zeros + str).slice(-len);
}

function handleClear(e) {
	while (grid.firstChild) {
		grid.firstChild.remove();
	}
}
function handleSlide(e) {
	let size = slider.value;
	let sizeString = `${size}x${size}`;

	handleClear();
    grid.style.gridTemplateColumns =  `repeat(${size}, 1fr)`
	grid.style.gridTemplateColumns =  `repeat(auto-fit, minmax(10px, 1fr));`
	grid.style.gridTemplateRows =  `repeat(auto-fit, minmax(10px, 1fr));`

    grid.style.gridTemplateRows =  `repeat(${size}, 1fr)`
	let containerWidth = grid.clientWidth;
	let containerHeight = grid.clientHeight;
	let smallestDimension = Math.min(containerWidth, containerHeight);
	let pixelWidth = Math.floor(smallestDimension / size);

	for (let i = 0; i < size ** 2; i++) {
		let tempDiv = document.createElement("div");
		tempDiv.classList.add("pixel");
		tempDiv.style.width = `${pixelWidth}px`;
		tempDiv.style.height = `${pixelWidth}px`;
		grid.appendChild(tempDiv);
	}

	handleColourChange();
	document.getElementById("grid-size").innerHTML = sizeString;
}





slider.addEventListener("input", handleSlide);

window.addEventListener("DOMContentLoaded", handleSlide);

let clear = document.getElementById("btn-clear");
clear.onclick = handleClear;

let colourPick = document.getElementById("colour-picker");

function handleColourChange() {
	for (let pixel of Array.from(document.getElementsByClassName("pixel"))) {
		pixel.style.backgroundColor = colourPick.value;
		pixel.style.border = `2px solid ${invertColor(colourPick.value)}`;
	}
}
colourPick.addEventListener("input", handleColourChange);

function randomColour() {
	let rRed = Math.floor(Math.random() * 255);
	let rBlue = Math.floor(Math.random() * 255);
	let rGreen = Math.floor(Math.random() * 255);
	return "#" + rRed.toString(16) + rBlue.toString(16) + rGreen.toString(16);
}

window.addEventListener("resize", handleSlide);
