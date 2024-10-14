//establish the canvases, contexts, and images
var mainCanvas = document.getElementById("mainCanvas");
var mainCanvasCTX = mainCanvas.getContext("2d");

var HUDCanvas = document.getElementById("HUDCanvas");
var HUDCanvasCTX = HUDCanvas.getContext("2d");

mainCanvas.addEventListener('mousedown', function (event) {
                                          upgradeTile(event);
                                     });
mainCanvas.addEventListener('mousemove', function (event) {
                                          seeTile(event);
                                     });
var towerImage = document.getElementById("tower");
var antImage = document.getElementById("ant");
var waterImage = document.getElementById("water");
var sandImage = document.getElementById("sand");

//constants
var startingHealth = 15;
var startingMoney = 135;
//important inline functions with adjustable number settings
function costToUpgrade(level) { //cost to build
  return 50 + 10*level;
}
function damageDealt(level) { //damage per tower per instant
  return .6 + .8*(level-1);
}
function fireRadius(level) { //radius of tower reach
  return 140 + level*10;
}
function newEnemy() {
  var startingEnemyHealth = 100 + Math.random()*score*3 + score/4; //ant strength
  enemies.push(
  {
    x: Math.random()*mainCanvas.width*0.9 + mainCanvas.width*0.05,
    y: 0,
    maxHealth: startingEnemyHealth,
    health: startingEnemyHealth
  });
}

//global variables
var tileData = new Array(11);
for (var i = 0; i < tileData.length; i++) { 
    tileData[i] = new Array(11); 
}
var money = startingMoney;
var health = startingHealth;
var score = 0;
var highScore = 0;
var enemies = [];
var shotLines = []; //for making laser animation
var currentSelectionX = 0;
var currentSelectionY = 0;

reset(); //reset on page load

function reset() { //resets the game
  for (var i = 0; i < 11; i++) { 
    for (var j = 0; j < 11; j++) {
      if (Math.random() >= .2)
        var l = 0;
      else
        var l = -1;
        tileData[i][j] = {
        	level: l,
        	ammo: 1
        }; 
    } 
  }
  money = startingMoney;
  health = startingHealth;
  score = 0;
  enemies = [];
  shotLines = [];
}

//finds the distance between a tower and a point, taking into account the different
//tower coordinates
function distanceToTower(towerX, towerY, pointX, pointY) {
	towerX = towerX * 50 + 25;
	towerY = towerY * 50 + 25;
	return Math.sqrt((towerX - pointX)*(towerX - pointX) + (towerY - pointY)*(towerY - pointY));
}

//main game loop, consists of step and then draw
function repeat() {

  //step //////////////////////////

  //enemies and tower shots
  var shotLines = [];
  for (var i = 0; i < 11; i++) { 
    for (var j = 0; j < 11; j++) {
      if (health > 0)
    	 tileData[i][j].ammo = 1; //each tower has 1 ammo as it can only fire at 1 ant per step
    } 
  }
  for (var i = 0; i < enemies.length; i++) {
    enemies[i].y += .5;
    for (var k = 0; k < 11; k++) { 
    	for (var l = 0; l < 11; l++) {
        //if the ant is within radius of the tower, a tower even exists on that tile, AND the tower has its ammo,
        //then the tower fires at the ant
    		if (distanceToTower(k,l,enemies[i].x,enemies[i].y) <= fireRadius(tileData[k][l].level) && tileData[k][l].level > 0 && tileData[k][l].ammo > 0) {
    			tileData[k][l].ammo -= 1;
    			enemies[i].health -= damageDealt(tileData[k][l].level);
    			shotLines.push({
    				x1: k*50 + 25,
    				y1: l*50 + 25,
    				x2: enemies[i].x,
    				y2: enemies[i].y,
            //logarithms are used to scale enemy size & castle size
    				thickness: Math.log(tileData[k][l].level*2) + tileData[k][l].level/2
    			});
    		}
    	} 
  	}
    //if the ant reaches the end or dies
    if (enemies[i].health <= 0 || enemies[i].y > mainCanvas.height) {
    	if (enemies[i].health <= 0) {
    		score += 5;
    		money += 5;
    	} else
        if (health > 0)
    		  health -= 1;
    	enemies.splice(i,1);
    }
  }

  //score
  if (score > highScore)
    highScore = score;

  //draw //////////////////////////

  //clear
  mainCanvasCTX.fillStyle = "white";
  mainCanvasCTX.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
  HUDCanvasCTX.fillStyle = "white";
  HUDCanvasCTX.fillRect(0, 0, HUDCanvas.width, HUDCanvas.height);

  //ground tiles
    for (var i = 0; i < 11; i++) { 
      for (var j = 0; j < 11; j++) {
        if (tileData[i][j].level == -1)
          mainCanvasCTX.drawImage(waterImage,i*50,j*50);
        else
          mainCanvasCTX.drawImage(sandImage,i*50,j*50);
      } 
    }

    //fire radius
    if (tileData[currentSelectionX][currentSelectionY].level > 0 && health > 0) {
      mainCanvasCTX.lineWidth = 2;
      mainCanvasCTX.globalAlpha = 0.4;
      mainCanvasCTX.strokeStyle = "red";
      mainCanvasCTX.beginPath();
      //convert to tower coordinates, finds the radius of the selected tower, and draws it
      mainCanvasCTX.arc(currentSelectionX*50+25,currentSelectionY*50+25,fireRadius(tileData[currentSelectionX][currentSelectionY].level), 0, 2*Math.PI);
      mainCanvasCTX.stroke();
      mainCanvasCTX.globalAlpha = 1;
    }

    //lasers (shotLines)
      mainCanvasCTX.lineCap = "round";
      for (var i = 0; i < shotLines.length; i++) {
        mainCanvasCTX.beginPath();
        mainCanvasCTX.lineWidth = shotLines[i].thickness;
        mainCanvasCTX.strokeStyle = "red";
        mainCanvasCTX.moveTo(shotLines[i].x1,shotLines[i].y1);
        mainCanvasCTX.lineTo(shotLines[i].x2,shotLines[i].y2);
        mainCanvasCTX.stroke();
      }

  //towers
    for (var i = 0; i < 11; i++) { 
      for (var j = 0; j < 11; j++) { 
        if (tileData[i][j].level != 0) {
          //scales the tower size based on its level, I know it could be less ugly
        	var scaling = 40+10*Math.log(tileData[i][j].level);
          mainCanvasCTX.drawImage(towerImage,i*50-scaling/2+25,j*50-scaling/2+25,scaling,scaling);
        }
      } 
    }

    //enemies
      for (var i = 0; i < enemies.length; i++) {
        //scales the ant size based on its max health
        var scaling = 20*Math.log(enemies[i].maxHealth / 40);
          mainCanvasCTX.drawImage(antImage,enemies[i].x-scaling/2,enemies[i].y-scaling/2,scaling,scaling);
      }

    //game over
    if (health <= 0) {
      mainCanvasCTX.shadowColor = "black";
      mainCanvasCTX.shadowOffsetX = 2;
      mainCanvasCTX.shadowOffsetY = 2;
      mainCanvasCTX.shadowBlur = 4;

      mainCanvasCTX.textAlign = "center";
      mainCanvasCTX.font = "60px Helvetica";
      mainCanvasCTX.fillStyle = "black";
      mainCanvasCTX.fillText("Game Over", 275,250);
      mainCanvasCTX.font = "20px Helvetica";
      mainCanvasCTX.fillText("Final Score: " + score, 275,290);
      mainCanvasCTX.fillText("Press Reset to Try Again", 275,330);

      mainCanvasCTX.shadowOffsetX = 0;
      mainCanvasCTX.shadowOffsetY = 0;
      mainCanvasCTX.shadowBlur = 0;

    }

    //HUD
    HUDCanvasCTX.textAlign = "left";
    HUDCanvasCTX.font = "17px Helvetica";
    HUDCanvasCTX.fillStyle = "green";
    HUDCanvasCTX.fillText("$ " + money, 10,13);
    HUDCanvasCTX.fillStyle = "red";
    HUDCanvasCTX.fillText("<3 " + health, 10,30);
    HUDCanvasCTX.fillStyle = "black";
    HUDCanvasCTX.fillText("score: " + score, 210+90,13);
    HUDCanvasCTX.fillText("high score: " + highScore, 210+90,30);

    HUDCanvasCTX.fillStyle = "black";
    HUDCanvasCTX.textAlign = "left";
    HUDCanvasCTX.fillText("current selection:",100,13)
    var cost = costToUpgrade(tileData[currentSelectionX][currentSelectionY].level);
    if (tileData[currentSelectionX][currentSelectionY].level == -1) {
      HUDCanvasCTX.fillText("water", 100+10,30);
    } else if (tileData[currentSelectionX][currentSelectionY].level == 0) {
      HUDCanvasCTX.fillText("sand", 100+10,30);
      if (cost <= money)
        HUDCanvasCTX.fillStyle = "green";
      else
        HUDCanvasCTX.fillStyle = "red";
      HUDCanvasCTX.fillText("cost to build: " + cost, 100+10,47);
    } else {
      HUDCanvasCTX.fillText("level " + tileData[currentSelectionX][currentSelectionY].level + " castle", 100+10,30);
            if (cost <= money)
        HUDCanvasCTX.fillStyle = "green";
      else
        HUDCanvasCTX.fillStyle = "red";
      HUDCanvasCTX.fillText("cost to build: " + cost, 100+10,47);
    }
}

//check if can build/upgrade a tile and do so
function upgradeTile(event) {
  if (health > 0) {
    var mousePos = getMousePos(mainCanvas, event);
    var x = Math.floor(mousePos.x / 50);
    var y = Math.floor(mousePos.y / 50);
    if (tileData[x][y].level >= 0 && money >= costToUpgrade(tileData[x][y].level)) {
      money -= costToUpgrade(tileData[x][y].level);
      tileData[x][y].level += 1;
    }
  }
}

//changes current selection on mouse-move
function seeTile(event) {
  var mousePos = getMousePos(mainCanvas, event);
  var x = Math.floor(mousePos.x / 50);
  var y = Math.floor(mousePos.y / 50);
  currentSelectionX = x;
  currentSelectionY = y;
}

//start the main loop and enemy spawner
function start() {
	setInterval(repeat, 10);
  setInterval(newEnemy, 2500);
}

/**
 * 
 * @param {HTML5 canvas object} canvas
 * @param {DOM event} event
 * @returns {an object with two attributes x and y coors}
 * author Dr. Mec
 */
function getMousePos(canvas, event) {
    var box = canvas.getBoundingClientRect(); //Screen coordinates of bounding box
    return {
        x: event.clientX - box.left,
        y: event.clientY - box.top
    };
}//getMousePos