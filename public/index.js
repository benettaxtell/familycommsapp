/** DRAWING CANVAS ADAPTED FROM: https://codepen.io/honmanyau/pen/OoOMQR **/

// =======================
// == Various Variables ==
// =======================
let piece_i = 0
let hasMsgPiece = false;
let buildingMsg = false;
const state = {
  mousedown: false,
  movingpiece: null
};

// ==========================
// == Canvas Configuration ==
// ==========================
const canvas = document.getElementById('drawing-area');
const canvasContext = canvas.getContext('2d');
canvasContext.fillStyle = "white";
canvasContext.fillRect(0, 0, canvas.width, canvas.height);

const lineWidth = 10;
const halfLineWidth = lineWidth / 2;
let strokeStyle = '#111';
let shadowColor = '#333';

// =============
// == Buttons ==
// =============
const clearDrawing = $('#clear-drawing');
const doneDrawing = $('#done-drawing');
const drawButton = $('#new-drawing-btn');
const colourButton = $('#crayons .crayon');

// =====================
// == Event Listeners ==
// =====================
clearDrawing.on('click', clearAndHideCanvas);
doneDrawing.on('click', finishDrawingAndClose);
drawButton.on('click', openNewDrawing);
colourButton.on('click', changeColour);
$('#message').on('click', openBuildOptions);

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', keepDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchmove', keepDrawing);
canvas.addEventListener('touchend', stopDrawing);

// ====================
// == Event Handlers ==
// ====================

//Show drawing canvas
function openNewDrawing(event) {
  event.preventDefault();
  if (buildingMsg) {
    return false;
  }
  $('#drawing').css('display', 'flex');
}

//Set canvas stroke and set mousedown
function startDrawing(event) {
  event.preventDefault();

  const mousePos = getMousePosition(event);
  
  canvasContext.beginPath();
  canvasContext.moveTo(mousePos.x, mousePos.y);

  canvasContext.lineWidth = lineWidth;
  canvasContext.strokeStyle = strokeStyle;
  canvasContext.shadowColor = shadowColor;
  canvasContext.lineCap = 'round';
  canvasContext.shadowBlur = 3;
  canvasContext.fill();
  
  state.mousedown = true;
}

//Draw ongoing stroke on canvas
function keepDrawing(event) {
  event.preventDefault();
  
  if (state.mousedown) {
    let mousePos = getMousePosition(event);

    canvasContext.lineTo(mousePos.x, mousePos.y);
    canvasContext.stroke();
  }
}

//Set mousedown to false
function stopDrawing(event) {
  event.preventDefault();
  
  if (state.mousedown) {
    canvasContext.stroke();
  }
  
  state.mousedown = false;
}

//Empty canvas and hide
function clearAndHideCanvas(event) {
  event.preventDefault();
  
  clearCanvas();
  $('#drawing').css('display', 'none');
}

//Add drawing border, "save" as img, add as message piece, then clear and hide canvas
function finishDrawingAndClose(event) {
  event.preventDefault();
  canvasContext.strokeStyle = '#111';
  canvasContext.shadowColor = '#333';
  //add a drawing border
  canvasContext.beginPath();
  canvasContext.rect(0, 0, 1000, 500);
  canvasContext.stroke();
  //make a jpeg of the canvas
  let canvasUrl = canvas.toDataURL("image/jpeg", 0.5);
  addMsgPiece(canvasUrl)
  //reset canvas for next drawing
  clearDrawing.click()
}

//set stroke style to the chosen colour based on data-fill attr (#RGB)
function changeColour(event) {
  event.preventDefault()
  $('.crayon-paper, #eraser').removeClass('selected');
  
  if ($(this).attr('id') == 'eraser') {
    canvasContext.globalCompositeOperation = 'destination-out';
    $(this).addClass('selected');
	return
  }

  //turn off eraser effect
  canvasContext.globalCompositeOperation = 'source-over'

  strokeStyle = $(this).attr('data-fill');
  shadowColor = $(this).attr('data-shadow');
  
  $(this).find('.crayon-paper').addClass('selected');
}

//Display build options
function openBuildOptions(event) {
  event.preventDefault()
  if(!hasMsgPiece || buildingMsg) {
	  return false;
  }
  
  $('#message .msg_piece').clone().appendTo('#pieces');
  $('#choose-blocks').css('display', 'flex');
  setBuildMessageEvents()  
  
  //to stop cloning msg pieces on again and again
  buildingMsg = true;
}

//Select the message piece to move and save in state
function selectPiece(event) {
  event.preventDefault();
  // get right target (if touch on drawing, get the container)
  let $target = $(event.target);
  if (!$target.hasClass('msg_piece')) {
    $target = $($target.parent()[0]);
  }
  state.movingpiece = $target
  state.movingpiece.addClass('moving')
}

//Move the currently selected piece to current coords
function movePiece(event) {
  event.preventDefault();
  
  const mousePos = getMousePosition(event);
  state.movingpiece.css({'top': mousePos.y, 'left': mousePos.x})
}

//Drop the currently selected piece where it is and reset state
function dropPiece(event) {
  event.preventDefault();
  
  state.movingpiece.removeClass('moving');
  state.movingpiece = null;
}

// ======================
// == Helper Functions ==
// ======================

//Add new divs for a msg piece showing the given msg
function addMsgPiece(msg) {
  hasMsgPiece = true;
  piece_i += 1
  $('#message').append("<div class='msg_piece' id='msg_piece"+piece_i+"'><img class='block_piece' src='img/blockpiece.png' /><img class='drawing_msg' src='" + msg + "' /></div>");  
}

//Set the touch events for message pieces in the build message frame after they're added
function setBuildMessageEvents() {
  $('#pieces .msg_piece').on('mousedown', selectPiece)
  $('#pieces .msg_piece').on('mousemove', movePiece)
  $('#pieces .msg_piece').on('mouseup', dropPiece)

  $('#pieces .msg_piece').on('touchstart', selectPiece)
  $('#pieces .msg_piece').on('touchmove', movePiece)
  $('#pieces .msg_piece').on('touchend', dropPiece)
}

//Return current x, y coord of mouse
function getMousePosition(event) {
  let clientX = event.clientX || event.touches[0].clientX;
  let clientY = event.clientY || event.touches[0].clientY;
  let { offsetLeft, offsetTop } = event.target;
  let canvasX = clientX - offsetLeft;
  let canvasY = clientY - offsetTop;

  return { x: canvasX, y: canvasY };
}

//Erase everything on canvas and refill white background, reset selected brush to black crayon
function clearCanvas() {
  //reset to black crayon
  $('#black-crayon').click()
  //refill white for next drawing
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  canvasContext.fillStyle = "white";
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);
}