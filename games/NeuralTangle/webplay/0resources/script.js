function satisfactory() {
	return pointsList.length > 15;
}

var state = 0;
/*
	0: initial
	1: drawing loop
	2: loop completed
	3: error
	4: neural tangle image
*/

var snapDistance = 150;

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();

var mousedown = false;
canvas.addEventListener('mousedown', function(evt) {
  mousedown = true;
  if (state == 0)
  	state = 1;
}, false);
canvas.addEventListener('mouseup', function(evt) {
  mousedown = false;
  if (state == 1) {
  	if (isClosedLoop() && satisfactory()) {
  		state = 2;
  		playRandomBell();
  		document.getElementById('body').style.cursor = 'initial';
  		window.setTimeout(changeCurrentActivatedNode, waitTime);
  	} else {
  		state = 3;
  		error.play();
  		window.setTimeout(reset, 4000);
  	}
  }
}, false);

var mousePos;
canvas.addEventListener('mousemove', function(evt) {
  if (mousedown) {
  	if (state == 1) {
	  	//when mouse is down and moved
	    mousePos = getMousePos(canvas, evt);
	    tryToAddPoint(new Point(mousePos.x, mousePos.y));
	}
  }
}, false);
function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	}
}

function reset() {
	pointsList = new Array();
	state = 0;
}

function distanceBetweenPoints(p1, p2) {
	return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

function isClosedLoop() {
	if (pointsList.length <= 3)
		return false;
	var start = pointsList[0];
	var end = pointsList[pointsList.length - 1];
	return start.x == end.x && start.y == end.y;
}

var pointsList = new Array();
function Point(x, y) {
  this.x = x;
  this.y = y;
}
function tryToAddPoint(point) {
	if (pointsList.length == 0) {
		pointsList.push(point);
		playRandomBell();
	} else if (pointsList.length >= 3 && distanceBetweenPoints(pointsList[pointsList.length - 1], pointsList[0]) <= snapDistance) {
		if (isClosedLoop())
			return;
		pointsList.push(pointsList[0]);
		playRandomBell();
	} else {
		var lastPoint = pointsList[pointsList.length - 1];
		if (distanceBetweenPoints(lastPoint, point) >= snapDistance) {
			pointsList.push(point);
			playRandomBell();
		}
	}
}

var startedFade = false;
var brickOrStatic = 0;
var waitTime = 600;
var currentActivatedNode = -1;
function changeCurrentActivatedNode() {
	playRandomBell();
	waitTime -= 20;
	brickOrStatic = (brickOrStatic + 1) % 5;
	currentActivatedNode = (currentActivatedNode + 1) % pointsList.length;
	if (currentActivatedNode == 0)
		currentActivatedNode++;
	if (waitTime <= 35) {
		waitTime = 35;
		if (! startedFade) {
			startedFade = true;
			window.setInterval(doFade, 1);
		}
	}
	if (state == 2)
		window.setTimeout(changeCurrentActivatedNode, waitTime);
}

var fade = 0;
var fadeBackNow = false;
var fadeBackNowOneMoreTime = false;
function doFade() {
	decreaseBellVolumes();
	if (!fadeBackNowOneMoreTime) {
		if (!fadeBackNow) {
			fade += 0.0007;
			if (fade >= 1.1) {
				state = 4;
				fadeBackNow = true;
				ringing.play();
			}
		} else {
			fade -= 0.0007;
			if (fade <= -0.1) {
				fadeBackNowOneMoreTime = true;
			}
		}
	} else {
		fade += 0.0007;
		if (fade >= 1.1) {
			window.location.replace('1artbook/artbook.html');
		}
	}
}

var redStatic = false;
var smallestPixel = 15;
function drawStatic() {
    for (var v=0; v < canvas.offsetHeight; v += smallestPixel){
        for (var h=0; h < canvas.offsetWidth; h += smallestPixel){
            if (redStatic) {
            	lum = Math.floor( Math.random() * 5 + 20 );
            	ctx.fillStyle = "hsl(360, 100%," + lum + "%)";
            }
            else {
            	lum = Math.floor( Math.random() * 5 + 95 );
            	ctx.fillStyle = "hsl(0, 0%," + lum + "%)";
            }
            ctx.fillRect(h,v, smallestPixel, smallestPixel);
      }
   }
}

function playRandomBell() {
	switch (Math.floor(Math.random() * 5)) {
		case 0:
			bells1[bells1Count].play();
			bells1Count = (bells1Count + 1) % 6;
			break;
		case 1:
			bells2[bells2Count].play();
			bells2Count = (bells2Count + 1) % 6;
			break;
		case 2:
			bells3[bells3Count].play();
			bells3Count = (bells3Count + 1) % 6;
			break;
		case 3:
			bells4[bells4Count].play();
			bells4Count = (bells4Count + 1) % 6;
			break;
		case 4:
			bells5[bells5Count].play();
			bells5Count = (bells5Count + 1) % 6;
			break;
		
	}
}
function setAllBellVolumes(vol) {
	for (var i = 0; i < bells1.length; i++) {
		bells1[i].volume = vol;
		bells2[i].volume = vol;
		bells3[i].volume = vol;
		bells4[i].volume = vol;
		bells5[i].volume = vol;
	}
}
function decreaseBellVolumes() {
	var currentVol = bells1[0].volume;
	currentVol -= 0.000035;
	if (currentVol < 0)
		currentVol = 0;
	setAllBellVolumes(currentVol);
}
var bells1Count = 0;
var bells1 = [new Audio("0resources/sounds/bells/one.mp3"), new Audio("0resources/sounds/bells/one.mp3"), new Audio("0resources/sounds/bells/one.mp3"), new Audio("0resources/sounds/bells/one.mp3"), new Audio("0resources/sounds/bells/one.mp3"), new Audio("0resources/sounds/bells/one.mp3")];
var bells2Count = 0;
var bells2 = [new Audio("0resources/sounds/bells/two.mp3"), new Audio("0resources/sounds/bells/two.mp3"), new Audio("0resources/sounds/bells/two.mp3"), new Audio("0resources/sounds/bells/two.mp3"), new Audio("0resources/sounds/bells/two.mp3"), new Audio("0resources/sounds/bells/two.mp3")];
var bells3Count = 0;
var bells3 = [new Audio("0resources/sounds/bells/three.mp3"), new Audio("0resources/sounds/bells/three.mp3"), new Audio("0resources/sounds/bells/three.mp3"), new Audio("0resources/sounds/bells/three.mp3"), new Audio("0resources/sounds/bells/three.mp3"), new Audio("0resources/sounds/bells/three.mp3")];
var bells4Count = 0;
var bells4 = [new Audio("0resources/sounds/bells/four.mp3"), new Audio("0resources/sounds/bells/four.mp3"), new Audio("0resources/sounds/bells/four.mp3"), new Audio("0resources/sounds/bells/four.mp3"), new Audio("0resources/sounds/bells/four.mp3"), new Audio("0resources/sounds/bells/four.mp3")];
var bells5Count = 0;
var bells5 = [new Audio("0resources/sounds/bells/five.mp3"), new Audio("0resources/sounds/bells/five.mp3"), new Audio("0resources/sounds/bells/five.mp3"), new Audio("0resources/sounds/bells/five.mp3"), new Audio("0resources/sounds/bells/five.mp3"), new Audio("0resources/sounds/bells/five.mp3")];
setAllBellVolumes(0.05);

var error = new Audio("0resources/sounds/error.mp3");
var ringing = new Audio("0resources/sounds/ringing.mp3");

var brick = new Image();
brick.src = "1artbook/images/4.jpeg";

var tangle = new Image();
tangle.src = "1artbook/images/10.png";

var time = 0;
function updateView(timestamp) {
	time += 0.01;

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	if (state != 4) {

		if (brickOrStatic == 1 || waitTime <= 35) {
			try {
				ctx.drawImage(brick, -canvas.offsetWidth*.1 ,-canvas.offsetHeight*.1, canvas.offsetWidth * 1.2, canvas.offsetHeight * 1.2);
				redStatic = true;
			} catch (error) {}
		} else {
			drawStatic();
		}

		ctx.lineWidth = 5;
		if (pointsList && pointsList.length != 0) {
			if (state == 1 && !isClosedLoop()) { //line segment while drawing
				ctx.strokeStyle = "black";
				ctx.fillStyle = "black";
		    	ctx.beginPath();
		    	ctx.moveTo(pointsList[pointsList.length-1].x, pointsList[pointsList.length-1].y);
		    	ctx.lineTo(mousePos.x, mousePos.y);
		    	ctx.stroke();
		    }

		    for (i = 0; i < pointsList.length; i++) { //all lines
		      var previousPointIndex = Math.abs((i - 1) % pointsList.length)

		      var currentPoint = pointsList[i];
		      var previousPoint = pointsList[previousPointIndex];

		      	if (i == currentActivatedNode || previousPointIndex == currentActivatedNode) {
		   			ctx.strokeStyle = "white";
					ctx.fillStyle = "white";
		   		} else {
		   			ctx.strokeStyle = "black";
					ctx.fillStyle = "black";
		   		}

		   		if (currentActivatedNode == pointsList.length-1 && i == 1) {
		   			ctx.strokeStyle = "white";
					ctx.fillStyle = "white";
		   		}

		      ctx.beginPath();
		      ctx.moveTo(previousPoint.x, previousPoint.y);

		      ctx.lineTo(currentPoint.x, currentPoint.y);
		      ctx.stroke();
		    }
		   	for (i = 0; i < pointsList.length; i++) { //all nodes
		   		if (i == currentActivatedNode) {
		   			ctx.strokeStyle = "white";
					ctx.fillStyle = "white";
		   		} else {
		   			ctx.strokeStyle = "black";
					ctx.fillStyle = "black";
		   		}
		      currentPoint = pointsList[i];
		      ctx.beginPath();
		      ctx.arc(currentPoint.x, currentPoint.y, 20, 0, 2*Math.PI);
		      ctx.fill();
		    }
		}

		if (state == 0 || state == 1 || state == 3) {
			ctx.font = '60px "handwritten"';
			ctx.textAlign = "center";
			ctx.fillStyle = "black";

			var rotation = Math.sin(time) - 0.5;
			ctx.save();
			ctx.rotate(rotation*(Math.PI/180));
			ctx.fillText("Draw a loop", canvas.width/2, 65);
			ctx.restore();

			var rotation = Math.sin(time + 1) - 0.5;
			ctx.save();
			ctx.rotate(rotation*(Math.PI/180));
			ctx.fillText("Tip: Make it complex", canvas.width/2, 130);
			ctx.restore();
		}
		if (state == 2) {
			ctx.font = '60px "handwritten"';
			ctx.textAlign = "center";
			ctx.fillStyle = "black";

			var rotation = Math.sin(time) - 0.5;
			ctx.save();
			ctx.rotate(rotation*(Math.PI/180));
			ctx.fillText("Thinking...", canvas.width/2, 65);
			ctx.restore();
		}
		if (state == 3) {
			ctx.font = '60px "handwritten"';
			ctx.textAlign = "center";
			ctx.fillStyle = "black";

			if (isClosedLoop()) {
				var rotation = Math.sin(time + 2) - 0.5;
				ctx.save();
				ctx.rotate(rotation*(Math.PI/180));
				ctx.fillText("Not complex enough", canvas.width/2, canvas.height/2 - 32.5);
				ctx.restore();

				var rotation = Math.sin(time + 3) - 0.5;
				ctx.save();
				ctx.rotate(rotation*(Math.PI/180));
				ctx.fillText("Need at least 15 neurons", canvas.width/2, canvas.height/2 + 32.5);
				ctx.restore();
			} else {
				var rotation = Math.sin(time + 2) - 0.5;
				ctx.save();
				ctx.rotate(rotation*(Math.PI/180));
				ctx.fillText("Must be a closed loop", canvas.width/2, canvas.height/2);
				ctx.restore();
			}
		}

	}

	if (state == 4) {
		try {
			ctx.drawImage(tangle, 0 ,0, canvas.offsetWidth, canvas.offsetHeight);
		} catch (error) {}
	}

	if (fade != 0) {
		ctx.fillStyle = "rgba(0,0,0," + fade + ")";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}

	window.requestAnimationFrame(updateView);
}
window.requestAnimationFrame(updateView);