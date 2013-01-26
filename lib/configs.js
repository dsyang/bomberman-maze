var game_configs = { tileSize: 40,
                     tilesImg: "/img/tiles.png",
                     numPlayer: 2,
                     fps: 15,
                     canvasId: "gameCanvas",
                     p1Start: {x: 1, y:1},
                     p2Start: {x: 13, y:1}
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
    bomb: 73, // q
    use: 80 // p
};
