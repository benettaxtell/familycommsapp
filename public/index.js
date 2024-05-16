/** DRAWING CANVAS ADAPTED FROM: https://codepen.io/honmanyau/pen/OoOMQR **/

// =======================
// == Various Variables ==
// =======================
let piece_i = 0
let hasMsgPiece = false;
const state = {
  mousedown: false,
  movingmessage: false,
  movingblock: null,
  sendingblocks: []
};

const castle_pieces = ['blockpiece_crop.png', 'tower_crop.png', 'castle1tower_crop.png', 'castle_crop.png']

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

//TODO: to fix wonky click events, just have it click to select,
//then move, then click to deselect
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', keepDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchmove', keepDrawing);
canvas.addEventListener('touchend', stopDrawing);

$('.block').on('mousedown', selectBlock)
$('.block').on('mousemove', moveBlock)
$('.block').on('mouseup', dropBlock)

$('.block').on('touchstart', selectBlock)
$('.block').on('touchmove', moveBlock)
$('.block').on('touchend', dropBlock)
//need to set these after we add the div
function setMoveTouches(){
  $('#msg_range').on('mousedown', selectMessage)
  $('#msg_range').on('mousemove', moveMessage)
  $('#msg_range').on('mouseup', dropMessage)

  $('#msg_range').on('touchstart', selectMessage)
  $('#msg_range').on('touchmove', moveMessage)
  $('#msg_range').on('touchend', dropMessage)
}
// ====================
// == Event Handlers ==
// ====================

//Show drawing canvas
function openNewDrawing(event) {
  event.preventDefault();
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

//Select the block piece to move and save in state
function selectBlock(event) {
  event.preventDefault();
  
  state.movingblock = $(event.target);
  state.movingblock.addClass('moving')
}
//Select the message to move and save in state
function selectMessage(event) {
  event.preventDefault();
  
  state.movingmessage = true
  $('#castle, #pieces').addClass('moving')
}

//Move the currently selected block to current coords
function moveBlock(event) {
  event.preventDefault();
  
  if (state.movingblock == null) return
  moveThing(event, state.movingblock)
}
//Move the message to current coords
function moveMessage(event) {
  event.preventDefault();
  
  if (!state.movingmessage) return
  moveThing(event, $('#castle, #pieces'))
}
//Move the current thing to current coords
function moveThing(event, thing) {
  thing.css({'top': getY(event, thing.height()), 'left': getX(event)})
  
  if (isOverDiv({'y': getY(event, 0), 'x': getX(event)}, $('#tube'), ':before'))
    $('#tube').addClass('hasmsg')
  else
    $('#tube').removeClass('hasmsg')
}

//Drop the currently selected block where it is and reset state
function dropBlock(event) {
  event.preventDefault();
  
  state.sendingblocks.push(state.movingblock)
  state.movingblock = null
  let send = state.sendingblocks[state.sendingblocks.length - 1]
  let send_i = state.sendingblocks.length - 1
  dropThing(event, send, send_i)
}

//Drop the message where it is and reset state
function dropMessage(event) {
  event.preventDefault();
  
  dropThing(event, $('#castle, #pieces'), -1)
  state.movingmessage = false
}

//Drop the currently selected thing where it is and reset state
function dropThing(event, thing, send_i) {
  thing.removeClass('moving')
  if ($('#tube').hasClass('hasmsg')) {
    //"send" message (not actually sending yet, but it'll look pretty)
	thing.animate({'left':'85%', 'top':'90vh', 'opacity': 1}, 1500, function() {
      $(this).animate({'left':'85%', 'top':'80vh', 'opacity': 0}, 1000, function() {resetBlock($(this), send_i)})
	})
  } else {
    resetBlock(thing, send_i)
  }
  
  $('#tube').removeClass('hasmsg')
}

// ======================
// == Helper Functions ==
// ======================

//Add new divs for a msg piece showing the given msg
function addMsgPiece(msg) {
  if (!hasMsgPiece) {
    $('#message').append("<img id='castle' class='castle_size"+piece_i+"' src='img/"+castle_pieces[piece_i]+"' /><div id='pieces'><img id='drawing_msg"+piece_i+"' class='drawing_msg' src='" + msg + "' /></div><div id='msg_range' class='msg_range"+piece_i+"'></div>");
    setMoveTouches()
  } else {
    //replace img source with next, and place next image (msg)
	$('#message #castle').attr('src', 'img/' + castle_pieces[piece_i])
	  .removeClass('castle_size' + (piece_i-1))
	  .addClass('castle_size' + piece_i)
	$('#message #pieces').append("<img id='drawing_msg"+piece_i+"' class='drawing_msg' src='" + msg + "' />")
	$('#msg_range').removeClass('msg_range'+(piece_i-1)).addClass('msg_range'+piece_i)
  }
  piece_i += 1

  hasMsgPiece = true;
}

//return the raw click/touch X without doing math
function getX(event) {
  return event.clientX || event.touches[0].clientX;
}

//return the raw click/touch Y without doing math
function getY(event, height) {
  return (event.clientY || event.touches[0].clientY) - parseInt(height);
}

//Return current x, y coord of mouse
function getMousePosition(event) {
  let clientX = getX(event);
  let clientY = getY(event, 0);
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

//Move sent block back to its starting place and clear out vars
function resetBlock(send, send_i, replace){
  send.css('top', "")
  send.css('left', "")
  send.css('opacity', 1)
  
  if (send_i >= 0)
    state.sendingblocks.splice(send_i, 1)
}

//Return true iff given point is over given div
// (optionally handles :before and :after by passing that string to bef)
// a-------b
// |       |
// |  div  |
// | x     |
// c-------d
// between a and b (top,left) and (top, left+w)
// AND
// between a and c (top,left) and (top-h, left)
// l < x < l + w
// t < y < t + h
let x, y, t, l, w, h, s = 0 
function isOverDiv(pos, div, bef) {
  s = window.getComputedStyle(div[0], bef);
  x = parseInt(pos.x)
  y = parseInt(pos.y)
  t = parseInt(div.offset().top)
  l = parseInt(div.offset().left)
  w = parseInt(s.width)
  h = parseInt(s.height)
  //console.log('l ' +l +'<' + x +'<'+ l +'+'+ w)
  //console.log('t ' +t +'<' + y +'<'+ t +'+'+ h)
  return l < x && x < l+w && t < y && y < t+h
}