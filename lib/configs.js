/*
 * Authors
 * -------
 * Anand Pattabiraman (apattabi)
 * Dan Yang (dsyang)
 * Shikhara Nalla (snalla)
 */
var game_configs = { tileSize: 40,
                     tilesImg: "img/tiles.png",
                     menuImg: "img/menu.png",
					           scoresImg: "img/scores.png",
                     numPlayer: 2,
                     fps: 45,
					           startScreen: "opening", //element start screen
					           endScreen: "ending", //element holding end canvas
					           game: "game", //element holding canvas
					           menuCanvas: "startscreen",  //name of menu canvas
					           endCanvas: "endscreen",  //name of end canvas
                     p1Canvas: "p1Canvas", //name of player 1 canvas
                     p2Canvas: "p2Canvas", //name of player 2 canvas
                     p1Color: "red",
                     p2Color: "blue",
                     p1Start: {i: 1, j:1, dir:0},
                     p2Start: {i: 13, j:1, dir: 0},
                     mapWidth: 920,
                     mapHeight: 920,
                     blockGen: 0.8,
                     coinGen: 0.4,
                     keyGen: 0.05,
                     firePower: 3,
                     bombLimit: 3
                   };

var p1_controls = {
    up: 87, // w
    left: 65, // a
    down: 83, // s
    right: 68, // d
    bomb: 81, // q
    use: 69 // e
};

var p2_controls = {
    up: 79, // o
    left: 75, // k
    down: 76, // l
    right: 186, // ;
    bomb: 73, // i
    use: 80 // p
};

var p1_images = { bomb: "img/bomb-red.png",
                  fireX: "img/fire-X.png",
                  fireY: "img/fire-Y.png",
                //key
                //body
                //fire
                }

var p2_images = { bomb: "img/bomb-blue.png",
                  fireX: "img/fire-X.png",
                  fireY: "img/fire-Y.png",

                }

// Explicit globals we are using.
var game;
var tileImg;
var view1;
var view2;
var viewDebug;

var eventHandlers = {}
