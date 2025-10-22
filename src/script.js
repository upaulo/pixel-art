function selectColor(event) {
  const selectedColor = document.querySelector('.color.selected');
  if (selectedColor) selectedColor.classList.remove('selected');
  const clickedColor = event.target;
  clickedColor.classList.add('selected');
}

function paintPixel(event) {
  const selectedColor = document.querySelector('.color.selected');
  const pixels = document.getElementsByClassName('pixel');
  const pixel = event.target;
  pixel.style.backgroundColor = selectedColor.style.backgroundColor;
  const pixelColors = Array.from(pixels).map((p) => p.style.backgroundColor);
  localStorage.setItem('pixelBoard', JSON.stringify(pixelColors));
}

function populateColorPalette() {
  const palette = document.getElementById('colors');
  const savedPalette = localStorage.getItem('colorPalette');

  const colors = savedPalette ? JSON.parse(savedPalette)
    : ['black', 'white', 'red', 'green', 'blue'];

  for (let i = 0; i < colors.length; i += 1) {
    const color = document.createElement('div');
    color.classList.add('color');
    color.style.backgroundColor = colors[i];
    color.addEventListener('click', selectColor);
    palette.appendChild(color);
  }
  const firstColor = palette.querySelector('.color');
  firstColor.classList.add('selected');
}

function populatePixelBoard(size) {
  const board = document.getElementById('pixel-board');
  const savedPixelColors = localStorage.getItem('pixelBoard');
  const pixelColors = savedPixelColors ? JSON.parse(savedPixelColors) : [];

  board.innerHTML = '';
  board.style.gridTemplateColumns = `repeat(${size}, 42px)`;
  board.style.gridTemplateRows = `repeat(${size}, 42px)`;

  for (let i = 0; i < size * size; i += 1) {
    const pixel = document.createElement('div');
    pixel.style.backgroundColor = pixelColors[i] || 'white';
    pixel.classList.add('pixel');
    pixel.classList.add('with-border');
    pixel.addEventListener('click', paintPixel);
    board.appendChild(pixel);
  }
}

function generateRandomColor() {
  const characters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i += 1) {
    color += characters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function randomizeColors() {
  const colors = document.getElementsByClassName('color');
  for (let i = 0; i < colors.length; i += 1) {
    let newColor = generateRandomColor();
    if (i === 0) newColor = 'black';
    if (i === 1) newColor = 'white';
    colors[i].style.backgroundColor = newColor;
  }
  const savedColors = Array.from(colors).map((color) => color.style.backgroundColor);
  localStorage.setItem('colorPalette', JSON.stringify(savedColors));
}

function customColor() {
  const colorInput = document.getElementById('input-custom-color');
  const palette = document.getElementById('colors');
  const colors = document.getElementsByClassName('color');

  function handleColorInput() {
    const chosenColor = colorInput.value;
    const newColor = document.createElement('div');
    newColor.classList.add('color');
    newColor.addEventListener('click', selectColor);
    newColor.style.backgroundColor = chosenColor;
    palette.appendChild(newColor);
    const savedColors = Array.from(colors).map((color) => color.style.backgroundColor);
    localStorage.setItem('colorPalette', JSON.stringify(savedColors));
  }

  colorInput.addEventListener('input', handleColorInput);
}

function customBoardSize() {
  const boardSizeInput = document.getElementById('board-size-input');
  const errorMessage = document.getElementById('error-message');
  const inputValue = boardSizeInput.value.trim();

  const boardSize = parseInt(inputValue, 10);

  if (!inputValue || Number.isNaN(boardSize) || boardSize < 5 || boardSize > 32) {
    errorMessage.textContent = 'Valor inválido! O tamanho deve ser um número entre 5 e 32.';
    errorMessage.style.display = 'flex'
  } else {
    errorMessage.textContent = '';
    errorMessage.style.display = 'none'
    populatePixelBoard(boardSize);
    localStorage.setItem('boardSize', boardSize);
    boardSizeInput.value = '';
  }
}

function toggleBorder() {
  const pixels = document.querySelectorAll('.pixel');
  const board = document.getElementById('pixel-board');
  const borderToggleBtn = document.getElementById('border-toggle');

  const boardSize = Math.sqrt(pixels.length);

  pixels.forEach((pixel) => {
    pixel.classList.toggle('with-border');
    pixel.classList.toggle('borderless');
  });

  const gridSize = board.style.gridTemplateColumns === `repeat(${boardSize}, 42px)` ? 40 : 42;

  board.style.gridTemplateColumns = `repeat(${boardSize}, ${gridSize}px)`;
  board.style.gridTemplateRows = `repeat(${boardSize}, ${gridSize}px)`;

  const imgTag = borderToggleBtn.querySelector('img');
  if (imgTag.src.includes('borderless.png')) {
    imgTag.src = './assets/border.png';
  } else {
    imgTag.src = './assets/borderless.png';
  }
}

function clearBoard() {
  const pixels = document.getElementsByClassName('pixel');
  for (let i = 0; i < pixels.length; i += 1) {
    const pixel = pixels[i];
    pixel.style.backgroundColor = 'white';
  }
  localStorage.removeItem('pixelBoard');
  populatePixelBoard(5);
  localStorage.removeItem('boardSize');
}

const borderControlButton = document.getElementById('border-toggle');
borderControlButton.addEventListener('click', toggleBorder);

const buttonRandomColor = document.getElementById('button-random-color');
buttonRandomColor.addEventListener('click', randomizeColors);

const boardSizeInput = document.getElementById('board-size-input');
boardSizeInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') customBoardSize();
});

const clearButton = document.getElementById('clear-board');
clearButton.addEventListener('click', clearBoard);

window.addEventListener('load', () => {
  customColor();
  populateColorPalette();
  const savedBoardSize = localStorage.getItem('boardSize');

  if (savedBoardSize) {
    populatePixelBoard(parseInt(savedBoardSize, 10));
    boardSizeInput.value = savedBoardSize;
  } else {
    populatePixelBoard(5);
  }
  boardSizeInput.value = '';
});
