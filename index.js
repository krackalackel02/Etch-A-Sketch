let slider = document.getElementById("grid-size-slider");
slider.min = 1;
slider.max = 100;
slider.value = 64;
slider.step = 1;
let grid = document.getElementById("canvas");

function canvasHeight() {
	let windowHeight = window.innerHeight;
	windowHeight -= document.querySelector("div h1").clientHeight;
	let windowWidth = window.innerWidth;
	windowWidth -= document.querySelector(".options").clientWidth;

	if (windowWidth >= windowHeight) {
		// Landscape orientation
		grid.style.width = "auto";
		grid.style.height = `${0.7 * windowHeight}px`;
	} else {
		// Portrait orientation
		grid.style.width = `80vw`;
		grid.style.height = "auto";
	}
}

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
    canvasHeight();
	let size = slider.value;
	let sizeString = `${size}x${size}`;
    
	handleClear();
	grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
	grid.style.gridTemplateRows = `repeat(${size}, 1fr)`;
    
	grid.style.gridTemplateRows = `repeat(${size}, 1fr)`;
	let containerWidth = grid.clientWidth;
	let containerHeight = grid.clientHeight;
	let smallestDimension = Math.min(containerWidth, containerHeight);
	let pixelWidth = Math.floor(smallestDimension / size);
    
	for (let i = 0; i < size ** 2; i++) {
        let tempDiv = document.createElement("div");
		tempDiv.classList.add("pixel");
		grid.appendChild(tempDiv);
	}
    
    handleBorder();
	handleColourChange();
	document.getElementById("grid-size").innerHTML = sizeString;
}

let borderBtn = document.getElementById("btn-border");
function handleBorder() {
	let isColorSelected = borderBtn.classList.contains("selected");
	for (let pixel of Array.from(document.getElementsByClassName("pixel"))) {
		isColorSelected
			? (pixel.style.border = `1px solid ${invertColor(colourPick.value)}`)
			: (pixel.style.border = "none");
	}
}

slider.addEventListener("input", handleSlide);

window.addEventListener("DOMContentLoaded", handleSlide);

let clear = document.getElementById("btn-clear");
clear.onclick = handleClear;

let colourPick = document.getElementById("colour-picker");

function handleColourChange() {
	for (let pixel of Array.from(document.getElementsByClassName("pixel"))) {
		pixel.style.backgroundColor = colourPick.value;
	}
}
colourPick.addEventListener("input", handleColourChange);

function randomColour() {
	let rRed = Math.floor(Math.random() * 256);
	let rBlue = Math.floor(Math.random() * 256);
	let rGreen = Math.floor(Math.random() * 256);
	return "#" + rRed.toString(16) + rBlue.toString(16) + rGreen.toString(16);
}

window.addEventListener("resize", handleSlide);

document.querySelectorAll(".btn").forEach((btn) => {
	btn.addEventListener("click", () => {
        btn.classList.contains("selected")
        ? btn.classList.remove("selected")
        : btn.classList.add("selected");
        switch (btn.id) {
            case "btn-border":
                handleBorder();
                break;
            case "btn-colour-select":
                // handleBorder();
                break;
            case "btn-rainbow":
                // handleBorder();
                break;
            case "btn-eraser":
                // handleBorder();
                break;
            case "btn-clear":
                // handleBorder();
                break;
        
            default:
                break;
        }
	});
});
