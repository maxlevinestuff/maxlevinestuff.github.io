//global dictionary: pass data to/from highest parent (add in req for dialogue chat?)
//make chat responses require certain entries in this dictionary, will need an event system so that new entries will add in a new response option, if the user is waiting there
//floating islands could be linked from an obscure text message
//pluswave linked from obscure txt message
//project involves creating greater AI intelligence to spur the singularity
//game where have to adjust two exponential curves so they meet. the initial conditions mean so much, chaos theory
//the .onnx file contents of a killer AI
//bootup text is neural net code
//edit css for font and such in text message program
//make it so that a page can wait until after its children are complete, then display itself w/ threshold of 1. (to reverse order of traversal)

var params = new URLSearchParams(window.location.search); //set again in a bunch of loading places below...

//this page's content. will fill <main> with another file and be treated as this page's content
//should be used in conjunction w/ and called before setLoadAndWaitAfterCompleted or loadAndWaitAndThenLoadSelf
//shouldn't be used with loadAndWait
function loadSelf(file) {
	params = new URLSearchParams(window.location.search);
	file += "&self=true"; //self files simply pass propagation control to parent. see function propagate()
	document.getElementById("main").innerHTML = "";
	appendPiece(file);
}
//loads all files as frames, waits for them to finish, and then finishes itself
//parms:
//list of html file names (number of which determine wait threshold)
//bool: column or row
//divide percentages: how much each file should take up. will be evenly divided by default. format: "50%, 50%, ..."
//num: amount to subtract from threshold (0 is user has to complete all)
function loadAndWait(fileList=[], columnOrRow=true, dividePercentages="", numNotRequired=0) {
	params = new URLSearchParams(window.location.search);

	document.getElementById("main").innerHTML = "";
	document.getElementById("main").style.flexDirection = (columnOrRow ? "row" : "column");
	fileList.forEach(element => appendPiece(element));

	var percentageStringRepeated = dividePercentages;

	if (dividePercentages == "") {
		var percentageSpace = 100 / fileList.length;
		var percentageString = percentageSpace + "%,";
		percentageStringRepeated = percentageString.repeat(fileList.length);
	}

	if (!columnOrRow) {
		document.getElementById("main").setAttribute("rows", percentageStringRepeated);
		document.getElementById("main").setAttribute("cols", "*");
	}
	else {
		document.getElementById("main").setAttribute("rows", "*");
		document.getElementById("main").setAttribute("cols", percentageStringRepeated);
	}

	console.log(percentageStringRepeated);


	totalThreshold = fileList.length;
	waiting = true;
	if (totalThreshold == 0) IAmCompleted();
}
var totalThreshold;
var currentThreshold = 0;

//waits for self to finish, loads files and waits for them to finish, then finish
function setLoadAndWaitAfterCompleted(f=[], c=true, d="", n=0) {
	params = new URLSearchParams(window.location.search);

	fileList = f; columnOrRow = c; dividePercentages = d; numNotRequired = n;
	shouldLoadAfterComplete = true;
}
var fileList; var columnOrRow; var dividePercentages; var numNotRequired;
var shouldLoadAfterComplete = false;

//waits for child frames to finish, then loads self and waits for self to finish
function loadAndWaitAndThenLoadSelf(f=[], c=true, d="", n=0) {
	params = new URLSearchParams(window.location.search);

	myContent = document.getElementById("main").innerHTML;
	loadAndWait(f, c, d, n);
	shouldLoadSelfWhenDone = true;

	console.log("efwaefadefw");
}
var shouldLoadSelfWhenDone = false;
var myContent;

var waiting = false;

function IAmCompleted() {
	if (shouldLoadAfterComplete) {
		loadAndWait(fileList, columnOrRow, dividePercentages, numNotRequired);
	} else if (! waiting) {
		propagate();
	} else {
		currentThreshold++;
		if (reachedThreshold())
			propagate();
	}
}

function IAmCompletedAndDeclareInDictionary(entry) {
	DeclareInDictionary(entry);
	IAmCompleted();
}

function reachedThreshold() {
	return (currentThreshold >= totalThreshold);
}

function propagate() {
	console.log(nextTop);

	if (params.has('self')) {
		parent.IAmCompleted();
	} else {
		if (shouldLoadSelfWhenDone) {
			document.getElementById("main").innerHTML = myContent;
			document.getElementById("main").setAttribute("cols", "*");
			document.getElementById("main").setAttribute("rows", "*");
			totalThreshold++; //abusive but works. maybe make more sense to currentThreshold=0; totalThreshold=1;
			shouldLoadSelfWhenDone = false; //abusive
		} else {

			//make page uninteractable here
			var inputs = document.getElementsByTagName('input');
				for (var i = 0; i < inputs.length; i += 1) {
				inputs[i].readOnly = true;
				inputs[i].style.pointerEvents = "none";
			}
			var inputs = document.getElementsByTagName('button');
				for (var i = 0; i < inputs.length; i += 1) {
				inputs[i].readOnly = true;
				inputs[i].style.pointerEvents = "none";
			}
			document.body.style.cssText = "cursor: not-allowed !important"; //doesn't work well

			if (isTop) {
				//alert("won the section!");
				document.getElementById("main").innerHTML = "";
				document.getElementById("main").setAttribute("cols", "*");
				document.getElementById("main").setAttribute("rows", "*");
				appendPiece(nextTop);
			}

			//document.getElementById("main").innerHTML = "completed";

			if (! isTop)
				parent.receivePropagate();

			if (params.has('clearStatic') && params.get('clearStatic') == "true") {
				window.location = "../frame/static/static.html";
			}
		}
	}
}

function receivePropagate() {
	currentThreshold++;
	if (reachedThreshold())
		propagate();
}

function appendPiece(filename) {
	var div = document.createElement('div');
	div.className = "piece";
	var piece = document.createElement('frame');
	piece.src = filename;

	//delete these if doesnt solve iframe spacing/scrolling issue
	//try using overflow hidden
	piece.setAttribute("border", 0);
	piece.setAttribute("framespacing", 0);
	piece.setAttribute("frameborder", 0);
	piece.setAttribute("scrolling", "yes");
	piece.setAttribute("marginwidth", 0);
	piece.setAttribute("marginheight", 0);

	div.appendChild(piece);
	document.getElementById("main").appendChild(piece);
}

// function load(filename) {
// 	document.getElementById("main").innerHTML = "";
// 	appendPiece(filename);
// }

// Stuff concerning the global dictionary //

var nextTop;
var isTop = false; //for knowing when to start pass-down. set to true on top index.html

window.globalDic = {};
if (window.parent.globalDic != null)
	window.globalDic = window.parent.globalDic;

function DeclareInDictionary(key) {
	if (isTop)
		receivePassUp(key);
	else
		parent.receivePassUp(key);
}
function GetFromDictionary(key) {
	return window.globalDic[key] == 5;
}

function setInDictionary(key) {
	window.globalDic[key] = 5;
	try {
		newEntryInDictionaryToChild(key);
	} catch (error) {}
	var childFrames = document.querySelectorAll('frame');
	childFrames.forEach(frame => {
		frame.contentWindow.receivePassDown(key);
	});
}

function receivePassUp(key) {
	if (isTop) {
		setInDictionary(key);
	} else {
		parent.receivePassUp(key);
	}
}

function receivePassDown(key) {
	setInDictionary(key);
}