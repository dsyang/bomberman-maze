var displayScores = function(){
	var canvas = document.getElementById(game_configs["endCanvas"]);

	var p1stats = game.map.player1.objects;
	var p2stats = game.map.player2.objects;

	var p1off = [300, 150];
	var p2off = [600, 150];

	var bombCountoff = 75;
	var coinCountoff = 150;
	var keyCountoff = 225;
	var blockoff = 300;

	var ctx = canvas.getContext("2d");
	ctx.font = "50px Arial";
	ctx.fillStyle = "rgba(0, 0, 0, 1.0)";
	ctx.textAlign = "center";

	ctx.fillText("Player 1", p1off[0], p1off[1]);
	ctx.fillText("Player 2", p2off[0], p2off[1]);

	ctx.font = "40px Arial";
	//ctx.fillStyle = "rgba(255, 255, 255, 1.0)";
	ctx.textAlign = "center";

	//ctx.fillStyle = "rgba(255, 0, 0, 1.0)";

	ctx.fillText("Bombs: " + p1stats.bombCount, p1off[0], p1off[1] + bombCountoff);
	ctx.fillText("Bombs: " + p2stats.bombCount, p2off[0], p2off[1] + bombCountoff);

	//ctx.fillStyle = "rgba(255, 255, 0, 1.0)";

	ctx.fillText("Coins: " + p1stats.coinCount, p1off[0], p1off[1] + coinCountoff);
	ctx.fillText("Coins: " + p2stats.coinCount, p2off[0], p2off[1] + coinCountoff);

	//ctx.fillStyle = "rgba(0, 0, 255, 1.0)";

	ctx.fillText("Keys: " + p1stats.keyCount, p1off[0], p1off[1] + keyCountoff);
	ctx.fillText("Keys: " + p2stats.keyCount, p2off[0], p2off[1] + keyCountoff);

	//ctx.fillStyle = "rgba(255, 0, 255, 1.0)";

	ctx.fillText("Blocks: " + p1stats.blocks, p1off[0], p1off[1] + blockoff);
	ctx.fillText("Blocks: " + p2stats.blocks, p2off[0], p2off[1] + blockoff);
}

// This function is separate from initialize because it only exposes the menu and its associated handlers.
// You can call this to switch to the menu screen, but it won't stop the game.
var runMenu = function(){
	showStartWindows();
	eventHandlers["menuClickOn"]();
}

// Use this to start the game:          Menu -> Game
var runGame = function(){
	game = new Game(game_configs["numPlayer"], tileImg,{});
	game.initialize(view1, view2);
	game.start(game_configs["fps"]);

	showGameWindows();

	eventHandlers["acceptKeysOn"]();
}

// Use this to show the ending screen: Game -> Scorescreen
var runScores = function(){
	game.displayScores();
	showEndWindows();
	eventHandlers["scoresClickOn"]();
}

// This function is used to initialize all the menu elements. It should registers the handlers with eventHandlers (a global var in config)
// This is only meant to run once!
var initializeMenu = function(){
	var menuImg = new Image();
    menuImg.src = game_configs["menuImg"];
	var canvas = document.getElementById(game_configs["menuCanvas"]);

	menuImg.onload = function(){
		var ctx = canvas.getContext("2d");
		ctx.drawImage(menuImg, 0, 0);  // draw image at (0, 0)
	};

	var onMouseDown = function(event) {
		var x = event.pageX - canvas.offsetLeft;
		var y = event.pageY - canvas.offsetTop;
		if((x > canvas.width/3) && (x < canvas.width*2/3)
			&& (y > canvas.height/3) && (y < canvas.height*2/3)){
			eventHandlers["menuClickOff"]();
			runGame();
		}
	}

	// eventHandlers is a global object which gives you the power to
	// access past key events and stuff. Whenever you register a key function, I would use this. Then we can turn it on and off at whim.
	eventHandlers["menuClickOn"] = function(){
		canvas.addEventListener('mousedown', onMouseDown, false);
	}
	eventHandlers["menuClickOff"] = function(){
		canvas.removeEventListener('mousedown', onMouseDown, false);
	}
}

var initializeGame = function(){
	tileImg = new Image();
	tileImg.src = game_configs["tilesImg"];
	view1 = new View(document.getElementById(game_configs["p1Canvas"]),
						 { viewLeft: game_configs["p1Start"].i,
						   viewTop: game_configs["p1Start"].j,
						   player: 1});
	view2 = new View(document.getElementById(game_configs["p2Canvas"]),
						 { viewLeft: game_configs["p2Start"].i,
						   viewTop: game_configs["p2Start"].j,
						   player: 2});

	function onKeyup (event) {
		console.log(event.keyCode+" registered.");
		game.keyQueue.push(event.keyCode);
	};

	eventHandlers["acceptKeysOn"] = function(){
		document.addEventListener("keyup", onKeyup, false);
	}
	eventHandlers["acceptKeysOff"] = function(){
		document.removeEventListener("keyup", onKeyup, false);
	}
};

var initializeScores = function(){
	var scoresImg = new Image();
    scoresImg.src = game_configs["scoresImg"];
	var canvas = document.getElementById(game_configs["endCanvas"]);

	scoresImg.onload = function(){
		var ctx = canvas.getContext("2d");
		ctx.drawImage(scoresImg, 0, 0);  // draw image at (0, 0)
	};

	var returnToStart = function(event) {
		var x = event.pageX - canvas.offsetLeft;
		var y = event.pageY - canvas.offsetTop;
		if((x > canvas.width/3) && (x < canvas.width*2/3)
			&& (y > canvas.height/3) && (y < canvas.height*2/3)){
			eventHandlers["scoresClickOff"]();
			runMenu();
		}
	}

	// eventHandlers is a global object which gives you the power to
	// access past key events and stuff. Whenever you register a key function, I would use this. Then we can turn it on and off at whim.
	eventHandlers["scoresClickOn"] = function(){
		canvas.addEventListener('mousedown', returnToStart, false);
	}
	eventHandlers["scoresClickOff"] = function(){
		canvas.removeEventListener('mousedown', returnToStart, false);
	}
}
