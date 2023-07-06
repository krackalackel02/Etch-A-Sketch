let slider = document.getElementById("grid-size-slider");
slider.min = 1;
slider.max = 100;
slider.value = 20;
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

function handleColour(mode){
    let colour
    switch (mode) {
        case "btn-colour-select":
            colour = colourPick.value
            break;
        case "btn-rainbow":
            colour = randomColour()
            break;
        case "btn-eraser":
            colour = white
            break;
    }
    return colour
}

// ...
let mouseDown = false
document.body.onmousedown = () => (mouseDown = true)
document.body.onmouseup = () => (mouseDown = false)
function draw(e) {
    let pixel = e.target;
    if (e.type === 'mouseover' && !mouseDown) return
      let mode = handleButtonSelect(document.querySelector(".selected"));
      pixel.style.backgroundColor = handleColour(mode);
    
  }
  
  // Add event listener to each pixel
  grid.querySelectorAll(".pixel").forEach((pixel) => {
    pixel.addEventListener("mouseover", draw);
  });
  
  // ...
  

function makeGrid(){
    let size = slider.value;
    grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${size}, 1fr)`;
    
    
    for (let i = 0; i < size ** 2; i++) {
        let tempDiv = document.createElement("div");
        tempDiv.classList.add("pixel");
        tempDiv.style.backgroundColor = "white"
        grid.appendChild(tempDiv);
    }
    let radius = "10px "
    let innerRadius = "7px "
    grid.style.borderRadius = radius
    let pixels = document.querySelectorAll(".pixel")
    pixels[0].style.borderRadius = innerRadius+"0 "+"0 "+"0 "
    pixels[size-1].style.borderRadius = "0 "+innerRadius+"0 "+"0 "
    pixels[pixels.length-size].style.borderRadius = "0 "+"0 "+"0 "+innerRadius
    pixels[pixels.length-1].style.borderRadius = "0 "+"0 "+innerRadius+"0 "
    grid.querySelectorAll(".pixel").forEach((pixel) => {
        pixel.addEventListener("mouseover", draw);
        pixel.addEventListener("mousedown", draw);
    });
}
function handleSlide(e) {
    canvasHeight();
    let size = slider.value;
    
    let sizeString = `${size}x${size}`;
	handleClear();
    makeGrid()
    handleBorder();
	// handleColourChange();
	document.getElementById("grid-size").innerHTML = sizeString;
}

let borderBtn = document.getElementById("btn-border");
function handleBorder() {
	let isColorSelected = borderBtn.classList.contains("selected");
	for (let pixel of Array.from(document.getElementsByClassName("pixel"))) {
		isColorSelected
			? 
            (pixel.style.border = `1px solid black`)
            // (pixel.style.border = `1px solid ${invertColor(colourPick.value)}`)
			: (pixel.style.border = "none");
	}
}

slider.addEventListener("input", handleSlide);

window.addEventListener("DOMContentLoaded", handleSlide);



let colourPick = document.getElementById("colour-picker");

// function handleColourChange() {
// 	for (let pixel of Array.from(document.getElementsByClassName("pixel"))) {
// 		pixel.style.backgroundColor = colourPick.value;
// 	}
// }
// colourPick.addEventListener("input", handleColourChange);

function randomColour() {
	let rRed = Math.floor(Math.random() * 256);
	let rBlue = Math.floor(Math.random() * 256);
	let rGreen = Math.floor(Math.random() * 256);
	return "#" + rRed.toString(16) + rBlue.toString(16) + rGreen.toString(16);
}

window.addEventListener("resize", handleSlide);


let colourBtn = document.getElementById("btn-colour-select");
let rainbowBtn = document.getElementById("btn-rainbow");
let eraserBtn = document.getElementById("btn-eraser");
let drawButtons = [colourBtn,rainbowBtn,eraserBtn]
function handleButtonSelect(btn){
    if(btn.classList.contains("selected")){
        drawButtons.filter((button)=>{
            button.id!=btn.id
        }).forEach((button)=>{
            button.classList.remove("selected")
        })
        return btn.id
    }
    
}

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
                handleButtonSelect(btn)
                
                // handleBorder();
                break;
            case "btn-rainbow":
                handleButtonSelect(btn)
                // handleBorder();
                break;
            case "btn-eraser":
                handleButtonSelect(btn)
                // handleBorder();
                break;
            case "btn-clear":
                setTimeout(()=>{btn.classList.remove("selected")},500)
                for (let pixel of Array.from(document.getElementsByClassName("pixel"))) {
                    pixel.style.backgroundColor = "white";
                }
                // handleBorder();
                break;
        
            default:
                break;
        }
	});
});
