
/** DRAWING CANVAS ADAPTED FROM: https://codepen.io/honmanyau/pen/OoOMQR **/
// =============
// == Globals ==
// =============

//DRAWING
const canvas = document.getElementById('drawing-area');
const canvasContext = canvas.getContext('2d');
canvasContext.fillStyle = "white";
canvasContext.fillRect(0, 0, canvas.width, canvas.height);

//BUTTONS
const clearDrawing = $('#clear-drawing');
const doneDrawing = $('#done-drawing');
const drawButton = $('#new-drawing-btn');
const colourButton = $('#colours>button');


const state = {
  mousedown: false
};

// ===================
// == Configuration ==
// ===================
const lineWidth = 10;
const halfLineWidth = lineWidth / 2;
let strokeStyle = '#333';

// =====================
// == Event Listeners ==
// =====================

canvas.addEventListener('mousedown', handleWritingStart);
canvas.addEventListener('mousemove', handleWritingInProgress);
canvas.addEventListener('mouseup', handleDrawingEnd);
canvas.addEventListener('mouseout', handleDrawingEnd);

canvas.addEventListener('touchstart', handleWritingStart);
canvas.addEventListener('touchmove', handleWritingInProgress);
canvas.addEventListener('touchend', handleDrawingEnd);

clearDrawing.on('click', handleClearButtonClick);
doneDrawing.on('click', finishDrawingAndClose);
drawButton.on('click', openNewDrawing);
colourButton.on('click', changeColour);


// ====================
// == Event Handlers ==
// ====================
function openNewDrawing(event) {
  event.preventDefault();
  document.getElementById('drawing').style.display = 'flex';
}

function handleWritingStart(event) {
  event.preventDefault();

  const mousePos = getMousePositionOnCanvas(event);
  
  canvasContext.beginPath();

  canvasContext.moveTo(mousePos.x, mousePos.y);

  canvasContext.lineWidth = lineWidth;

  canvasContext.strokeStyle = strokeStyle;

  canvasContext.fill();
  
  state.mousedown = true;
}

function handleWritingInProgress(event) {
  event.preventDefault();
  
  if (state.mousedown) {
    let mousePos = getMousePositionOnCanvas(event);

    canvasContext.lineTo(mousePos.x, mousePos.y);
    canvasContext.stroke();
  }
}

function handleDrawingEnd(event) {
  event.preventDefault();
  
  if (state.mousedown) {
    canvasContext.stroke();
  }
  
  state.mousedown = false;
}

function handleClearButtonClick(event) {
  event.preventDefault();
  
  clearCanvas();
  $('#drawing').attr('style',{'display':'none'});
}

function finishDrawingAndClose(event) {
  event.preventDefault();
  canvasContext.beginPath();
  canvasContext.rect(0, 0, 1000, 500);
  canvasContext.stroke();
  
  let canvasUrl = canvas.toDataURL("image/jpeg", 0.5);
  $('#message').append("<div class='msg_piece'><img class='block_piece' src='img/blockpiece.png' /><img class='drawing_msg' src='" + canvasUrl + "' /></div>");
  
  clearDrawing.click()
}

//set stroke style to the chosen colour based on data-fill attr (#RGB)
function changeColour(event) {
  event.preventDefault()
  let colour = $(this).attr('data-fill');
  strokeStyle = colour;
}

// ======================
// == Helper Functions ==
// ======================
function getMousePositionOnCanvas(event) {
  let clientX = event.clientX || event.touches[0].clientX;
  let clientY = event.clientY || event.touches[0].clientY;
  let { offsetLeft, offsetTop } = event.target;
  let canvasX = clientX - offsetLeft;
  let canvasY = clientY - offsetTop;

  return { x: canvasX, y: canvasY };
}

function clearCanvas() {
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
}