var canvas = document.getElementById("main");
var ctx = canvas.getContext("2d");

var width = 10;
var height = 10;

var currentSquare = [0,0];

// EX: Path from (1,1) -> (1,2): [[1,1],[1,2]]
var paths = [];

// Contains squares traveled through to visit while backtracking
var squareStack = [currentSquare];

// 0 -> unchecked, 1 -> visited, 2 -> interior point
var squareStatus = []

function isFinished() {
    var j = 0;
    if (currentSquare == undefined) {
        return true;
    }
    for (var i = 0; i < squareStatus.length; i++) {
        if (squareStatus[i].includes(0) || squareStatus[i].includes(1)) {
            return false;
        }
    }
    return true;
}

function newMaze(mazeWidth, mazeHeight) {
    width = mazeWidth;
    height = mazeHeight;
    
    canvas.width = 80+40*width;
    canvas.height = 80+40*height;

    currentSquare = [0,0];
    squareStack = [currentSquare];
    squareStatus = [];
    paths = [];

    for (var i = 0; i < width; i++) {
        var column = [];
        for (var j = 0; j < height; j++) {
            column.push(0);
        }
        squareStatus.push(column);
    }

    ctx.fillStyle = "Black";
    ctx.fillRect(30,30,10+40*width,10+40*height);
    ctx.fillStyle = "Green";
    ctx.fillRect(40,40,30,30);
    ctx.fillStyle = "White";

    while (!isFinished()) {

        // Find available cardinal directions (1 up, 2 right, 3 down, 4 left)
        var available = [];
        if (currentSquare[1]>0 && squareStatus[currentSquare[0]][currentSquare[1]-1] == 0) {
            available.push(1);
        } 
        if (currentSquare[0]>0 && squareStatus[currentSquare[0]-1][currentSquare[1]] == 0) {
            available.push(4);
        }
        if (currentSquare[1]<height-1 && squareStatus[currentSquare[0]][currentSquare[1]+1] == 0) {
            available.push(3);
        }
        if (currentSquare[0]<width-1 && squareStatus[currentSquare[0]+1][currentSquare[1]] == 0) {
            available.push(2);
        }
    
        if (available.length == 0 || (currentSquare[0] == width-1 && currentSquare[1] == height-1)) {
    
            // Back tracks if terminal square has been reached, or if at a dead end
            squareStatus[currentSquare[0]][currentSquare[1]] = 2;
            var orig = squareStack.pop();
            currentSquare = squareStack[squareStack.length-1];
    
        } else {
    
            // Chooses a radnom available direction to go
            squareStatus[currentSquare[0]][currentSquare[1]] = 1;;
            var rand = Math.floor(Math.random() * (available.length-1e-7));
            var orig = [currentSquare[0],currentSquare[1]];
    
            if (available[rand] == 1) {
                currentSquare[1]--;
            } else if (available[rand] == 2) {
                currentSquare[0]++;
            } else if (available[rand] == 3) {
                currentSquare[1]++;
            } else if (available[rand] == 4) {
                currentSquare[0]--;
            }
    
            paths.push([[currentSquare[0],currentSquare[1]],[orig[0],orig[1]]]);
            squareStack.push([currentSquare[0],currentSquare[1]]);
    
            ctx.fillRect(currentSquare[0]*40+40,currentSquare[1]*40+40,30,30);
            // EX: Path from (1,1) -> (1,2): [[1,1],[1,2]]
            if (paths[paths.length-1][0][0] != paths[paths.length-1][1][0]) {
                //Change in x
                ctx.fillRect(Math.min(paths[paths.length-1][0][0],paths[paths.length-1][1][0])*40+70,paths[paths.length-1][0][1]*40+40,10,30);
            } else {
                //Change in y
                ctx.fillRect(paths[paths.length-1][0][0]*40+40,Math.min(paths[paths.length-1][0][1],paths[paths.length-1][1][1])*40+70,30,10);
            }
    
        }
        
    }
    ctx.fillStyle = "Red";
    ctx.fillRect(40*width,40*height,30,30);
}

function redraw() {
    ctx.fillStyle = "Black";
    ctx.fillRect(30,30,10+40*width,10+40*height);
    ctx.fillStyle = "White";
    for (var i = 0; i < width; i++) {
        for (var j = 0; j < height; j++) {
            ctx.fillRect(i*40+40,j*40+40,30,30);
        }
    }
    paths.forEach(path => {
        // EX: Path from (1,1) -> (1,2): [[1,1],[1,2]]
        if (path[0][0] != path[1][0]) {
            //Change in x
            ctx.fillRect(Math.min(path[0][0],path[1][0])*40+70,path[0][1]*40+40,10,30);
        } else {
            //Change in y
            ctx.fillRect(path[0][0]*40+40,Math.min(path[0][1],path[1][1])*40+70,30,10);
        }
    });
    ctx.fillStyle = "Green";
    ctx.fillRect(40,40,30,30);
    ctx.fillStyle = "Red";
    ctx.fillRect(40*width,40*height,30,30);
}

function isValidMove(move) {
    if (move[0][0]==move[1][0]) {
        var moveX = move[0][0];
        var minY = Math.min(move[0][1],move[1][1]);
        for (var i = 0; i < paths.length; i++) {
            var path=paths[i];
            if (path[0][0] == moveX && ((path[0][1] == minY && path[1][1] == minY+1) || (path[0][1] == minY+1 && path[1][1] == minY))) {
                return true;
            }
        }
    } else {
        var moveY = move[0][1];
        var minX = Math.min(move[0][0],move[1][0]);
        for (var i = 0; i < paths.length; i++) {
            var path = paths[i];
            if (path[0][1] == moveY && ((path[0][0] == minX && path[1][0] == minX+1) || (path[0][0] == minX+1 && path[1][0] == minX))) {
                return true;
            }
        }
    }
}

var size = 5;
newMaze(size,size);

var x = 0;
var y = 0;

ctx.fillStyle = "Blue";
ctx.fillRect(45+x*40,45+y*40,20,20);

addEventListener("keydown", (key) => {
    if (key.key == "ArrowLeft" || key.key == "a") {
        if (x>0 && isValidMove([[x,y],[x-1,y]])) {
            x--;
        }
    } else if (key.key == "ArrowRight" || key.key == "d") {
        if (x<width-1 && isValidMove([[x,y],[x+1,y]])) {
            x++;
        }
    } else if (key.key == "ArrowUp" || key.key == "w") {
        if (y>0 && isValidMove([[x,y],[x,y-1]])) {
            y--;
        }
    } else if (key.key == "ArrowDown" || key.key == "s") {
        if (y<height-1 && isValidMove([[x,y],[x,y+1]])) {
            y++;
        }
    } 
    redraw();
    ctx.fillStyle = "Blue";
    ctx.fillRect(45+x*40,45+y*40,20,20);

    if (x==width-1 && y==height-1) {
        size+=2;
        newMaze(size,size);
        x=0;
        y=0;
        ctx.fillStyle = "Blue";
        ctx.fillRect(45+x*40,45+y*40,20,20);
    }
});