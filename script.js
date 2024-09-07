let options = [];
let spinning = false;
let currentAngle = 0;

const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;  // Adjusted to match the CSS width
canvas.height = 400;

const spinButton = document.getElementById('spinButton');
const addInputButton = document.getElementById('addInputButton');
const textInput = document.getElementById('textInput');
const inputList = document.getElementById('inputList');
const shuffleButton = document.getElementById('shuffleButton');
const clearButton = document.getElementById('clearButton');
const resultDisplay = document.getElementById('resultDisplay');
const celebrationBox = document.getElementById('celebrationBox');

let radius = 200; // Adjusted radius to match canvas size

// Add input to the list
addInputButton.addEventListener('click', () => {
  const value = textInput.value.trim();
  if (value) {
    options.push(value);
    renderInputList();
    drawWheel();
    textInput.value = '';
  }
});

// Render the input list
function renderInputList() {
  inputList.innerHTML = '';
  options.forEach((option, index) => {
    const li = document.createElement('li');
    li.textContent = option;
    inputList.appendChild(li);
  });
}

// Shuffle the inputs
shuffleButton.addEventListener('click', () => {
  options.sort(() => Math.random() - 0.5);
  renderInputList();
  drawWheel();
});

// Clear the inputs
clearButton.addEventListener('click', () => {
  options = [];
  renderInputList();
  drawWheel();
});

// Draw the wheel with larger text and centering single name
function drawWheel() {
  const sliceAngle = (2 * Math.PI) / options.length;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (options.length === 1) {
    // If only one name, place it at the center
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'gold';
    ctx.font = 'bold 40px Arial'; // Larger font size for a single name
    ctx.fillText(options[0], canvas.width / 2, canvas.height / 2);
  } else {
    // Draw multiple options on the wheel
    options.forEach((option, index) => {
      const angle = currentAngle + index * sliceAngle;
      ctx.beginPath();
      ctx.arc(200, 200, radius, angle, angle + sliceAngle);
      ctx.lineTo(200, 200);
      ctx.fillStyle = index % 2 === 0 ? '#FFDDC1' : '#FF6F61';
      ctx.fill();
      ctx.stroke();

      ctx.save();
      ctx.translate(200, 200);
      ctx.rotate(angle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#333';
      ctx.font = 'bold 24px Arial'; // Increased font size
      ctx.fillText(option, radius - 20, 10);
      ctx.restore();
    });
  }
}

// Spin the wheel
spinButton.addEventListener('click', () => {
  if (options.length === 0 || spinning) return;

  spinning = true;
  const randomSpeed = Math.random() * 5 + 5; // Random speed for unpredictability
  const randomDuration = Math.random() * 2000 + 3000; // Random duration between 3-5 seconds

  let duration = randomDuration;
  let rotation = Math.random() * 360 + randomSpeed * 360; // Randomize the total rotation

  let animation = setInterval(() => {
    currentAngle = (currentAngle + randomSpeed) % 360;
    drawWheel();
    if (duration <= 0) {
      clearInterval(animation);
      spinning = false;
      let finalAngle = (currentAngle + rotation) % 360;
      displayResult(finalAngle);
    }
    duration -= 50;
  }, 50);
});

// Display the result and celebrate
function displayResult(finalAngle) {
  const sliceAngle = 360 / options.length;
  const winningIndex = Math.floor(finalAngle / sliceAngle);
  const winningOption = options[winningIndex];

  resultDisplay.textContent = `Result: ${winningOption}`;
  
  // Show celebration message below the wheel
  celebrationBox.style.display = 'block';
  celebrationBox.textContent = `🎉 ${winningOption} 🎉`;

  // Hide the celebration after 2 seconds, remove the name, and redraw the wheel
  setTimeout(() => {
    celebrationBox.style.display = 'none';

    // Remove the selected option from the list
    options.splice(winningIndex, 1);
    renderInputList();
    drawWheel();

    if (options.length === 0) {
      resultDisplay.textContent = 'No more options to spin!';
    }
  }, 2000);  // Celebration for 2 seconds
}

// Initial drawing of the wheel
drawWheel();
