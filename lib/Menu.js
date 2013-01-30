// Actually loads the menu elements and registers the handlers.

var initializeMenu = function(){
	showStartWindows();
	var menuImg = new Image();
    menuImg.src = game_configs["menuImg"];
	var canvas = document.getElementById(game_configs["menu"]);
	
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
			showGameWindows();
			gameStart();
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
	
	// Turns on click capability.
	eventHandlers["menuClickOn"]();	
}

initializeMenu();

