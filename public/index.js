
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

// ==========================
// == Canvas Configuration ==
// ==========================
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

//Show drawing canvas
function openNewDrawing(event) {
  event.preventDefault();
  document.getElementById('drawing').style.display = 'flex';
}

//Set canvas stroke and set mousedown
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

//Draw ongoing stroke on canvas
function handleWritingInProgress(event) {
  event.preventDefault();
  
  if (state.mousedown) {
    let mousePos = getMousePositionOnCanvas(event);

    canvasContext.lineTo(mousePos.x, mousePos.y);
    canvasContext.stroke();
  }
}

//Set mousedown to false
function handleDrawingEnd(event) {
  event.preventDefault();
  
  if (state.mousedown) {
    canvasContext.stroke();
  }
  
  state.mousedown = false;
}

//Empty canvas and hide
function handleClearButtonClick(event) {
  event.preventDefault();
  
  clearCanvas();
  $('#drawing').attr('style',{'display':'none'});
}

//Add drawing border, "save" as img, add as message piece, then clear and hide canvas
function finishDrawingAndClose(event) {
  event.preventDefault();
  canvasContext.strokeStyle = '#333';
  canvasContext.beginPath();
  canvasContext.rect(0, 0, 1000, 500);
  canvasContext.stroke();
  
  let canvasUrl = canvas.toDataURL("image/jpeg", 0.5);
  addMsgPiece(canvasUrl)
  
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

//Add new divs for a msg piece showing the given msg
function addMsgPiece(msg) {
  $('#message').append("<div class='msg_piece'><img class='block_piece' src='img/blockpiece.png' /><img class='drawing_msg' src='" + msg + "' /></div>");
}

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
  canvasContext.fillStyle = "white";
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);
}