

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();

setInterval(updateView, 100);

var smallestPixel = 20;
function drawStatic() {
    for (var v=0; v < canvas.offsetHeight; v += smallestPixel){
        for (var h=0; h < canvas.offsetWidth; h += smallestPixel){
            if (Math.random() < 0.1)
            	ctx.fillStyle = "#003311";
            else
            	ctx.fillStyle = "black";
            ctx.fillRect(h,v, smallestPixel, smallestPixel);
      }
   }
}

function updateView() {

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawStatic();

}