/*
Title: Minesweeper
Description: Classic game of minesweeper for browser
Last Updated: Sep 7, 2023
Developer: Alexander Beck
Email: beckhv2@gmail.com
Github: https://github.com/bexcoding
*/


const grid = document.getElementById('game-grid');
const gridSize = 10;
const numOfTiles = gridSize * gridSize;
const numOfBombs = 10;
// remainingtiles will be used to decrement and count for odds
let remainingTiles = numOfTiles;
let timerStarted = false;
let remainingTime = 600;
let safeLocations = [];
let bombLocations = [];
// initialize timerid here so that it can be accessed globally. it is changed within a local setting
let timerId;
let score = 0;
let highScore = 0;
let odds = numOfBombs / numOfTiles;


//sets up new tiles and game on reload
window.addEventListener('load', () => {
    //create tiles
    createGameTiles();
    //decide which tiles have bombs
    assignLocations(numOfTiles, numOfBombs);
});


//Fisher-Yates Sorting Algorithm
function shuffleArray(list) {
  for(let i = list.length - 1; i > 0; i--) { 
    const j = Math.floor(Math.random() * (i + 1)); 
    [list[i], list[j]] = [list[j], list[i]]; 
  };
  return list; 
} 

// creates the tiles on the screen
function createGameTiles(){
    for(i = 0; i < numOfTiles; i++) {
        // trying to use button instead of div for tiles
        /*
        let square = document.createElement('div');
        square.setAttribute('class', 'game-tile');
        square.setAttribute('id', i);
        grid.appendChild(square);
        */
        let square = document.createElement('button');
        square.setAttribute('class', 'game-tile');
        square.setAttribute('id', i);
        square.setAttribute('type', 'button');
        square.setAttribute('onclick', 'clickTile(id)');
        grid.appendChild(square);
    };
}


// delete tiles
function resetTiles(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild)
    };
}


// decides which tiles are safe and which are bombs
function assignLocations(tileTotal, bombTotal) {
    let safe = [];
    //start with all locations as safe
    for(i = 0; i < tileTotal; i++) {
        safe.push(i);
    };
    //move some locations to unsafe bomb list
    for(i = 0; i < bombTotal; i++) {
        // shuffle list before removing last item
        safe = shuffleArray(safe);
        let newBomb = safe.pop();
        bombLocations.push(newBomb);
    };
    // set safe locations as all remaining locations that are not bombs 
    safeLocations = safe;
    console.log(bombLocations);
}


// assign numbers
function assignNumber(id) {
    let bombCount = 0;
    let left = false;
    let right = false;
    let top = false;
    let bottom = false;
    let checklist = [];
    // locate which part of the board the tile is in; multiple can be true
    if(id % 10 === 0) {
        left = true;
    };
    if((id + 1) % 10 === 0) {
        right = true;
    };
    if(id < 10) {
        top = true;
    };
    if(id > 89) {
        bottom = true;
    };
    // check the surroundings for bombs; there are 9 options
    // top of board
    if(top) {
        if(left) {
            checklist = [1, 10, 11];
        } else if(right) {
            checklist = [-1, 9, 10];
        } else {
            checklist = [-1, 1, 9, 10, 11];
        };
    // bottom of board
    } else if(bottom) {
        if(left) {
            checklist = [-10, -9, 1];
        } else if(right) {
            checklist = [-11, -10, -1];
        } else {
            checklist = [-11, -10, -9, -1, 1];
        };
    // left, middle, or right of board 
    } else {
        if(left) {
            checklist = [-10, -9, 1, 10, 11];
        } else if(right) {
            checklist = [-11, -10, -1, 9, 10];
        // all non-edge pieces
        } else {
            checklist = [-11, -10, -9, -1, 1, 9, 10, 11];
        };
    };
    // check all appropriate locations for bombs
    for(num in checklist) {
        if(bombLocations.includes((id + checklist[num]))) {
            bombCount += 1;
        };
    };
    // assign number on board to make visible
    if(bombCount > 0) {
        document.getElementById(id).innerHTML = bombCount;
    };
}


// what to do when a tile is clicked
function clickTile(id) {
    let tile = document.getElementById(id);
    let tileNum = Number(id);
    if(timerStarted === false) {
        timerStarted = true;
        startTimer();
    };
    // sets tile to be disabled
    tile.setAttribute('disabled', 'true');
    // check if square is bomb and display explosion
    if(bombLocations.includes(tileNum)) {
        tile.innerHTML = '&#128165';
        // highlights the bomb that was hit
        tile.style.backgroundColor = 'var(--color-1)';
        // changing front color to white makes bombs more visible
        tile.style.color = 'white';
        // clear interval here stops time if bomb explodes
        clearInterval(timerId);
        endGame();
    } else {
        updateScore();
        updateOdds();
        assignNumber(tileNum);
    };
}


// timer function
function startTimer() {
    let timer = document.getElementById('timer');
    // calls anonymous function every 1 sec
    // timerid variable carries return value for interval so that program knows how to stop interval
    timerId = setInterval(() => {
        // decrement time and change to min and sec
        remainingTime -= 1;
        let min = Math.floor(remainingTime / 60);
        let sec = remainingTime % 60;
        // changes time to red in last minute
        if(remainingTime < 60) {
            timer.style.color = 'var(--color-1)';
        };
        // create leading zero for seconds
        if(sec < 10) {
            sec = `0${sec}`;
        };
        // formats time and adds leading zero for minutes
        if(remainingTime >= 0) {
            timer.innerHTML = `0${min}:${sec}`;
        } else {
            clearInterval(timerId);
            endGame();
        }
    }, 1000);
}

// updates scoreboard
function updateScore() {
    let current = document.getElementById('score');
    let high = document.getElementById('hi-score');
    // adds 10 points per tile times the odds multiplier
    score += (10 + (Math.floor(10 * odds)));
    current.innerHTML = score;
    if(score > highScore) {
        highScore = score;
        high.innerHTML = highScore;
    };
}


// update the odds
function updateOdds() {
    remainingTiles -= 1;
    odds = numOfBombs / remainingTiles;
    // convert odds to percentage form and display
    const percentage = Math.floor(odds * 100);
    document.getElementById('odds').innerHTML = `${percentage}%`;
}


// sequence for game end
function endGame() {
    // send message to console
    console.log('Game Over');
    // go through each tile and disable tile
    for(i = 0; i < numOfTiles; i++){
        // show all bomb locations
        if(bombLocations.includes(i)) {
            document.getElementById(i).innerHTML = '&#128165';
            // changing front color to white makes bombs more visible
            document.getElementById(i).style.color = 'white';
        };
        document.getElementById(i).setAttribute('disabled', 'true');
    };
    // show message that says that the game is over
    // timeout so that alert doesnt show up before board is disabled
    setTimeout(() => {
        window.alert('Game Over');
    }, 1000);
}


// start new game
function newGame() {
    clearInterval(timerId);
    document.getElementById('timer').innerHTML = '10:00';
    remainingTiles = 100;
    timerStarted = false;
    remainingTime = 600;
    safeLocations = [];
    bombLocations = [];
    score = 0;
    document.getElementById('score').innerHTML = 0;
    updateOdds();
    resetTiles(document.getElementById('game-grid'));
    createGameTiles();
    assignLocations(numOfTiles, numOfBombs);
}