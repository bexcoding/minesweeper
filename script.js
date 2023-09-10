/*
Title: Minesweeper
Description: Classic game of minesweeper for browser
Last Updated: Sep 9, 2023
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
// dictionary to hold numbers for board
let assignedNumbers = {};
// dictionary of adjacent tiles
let checklistDict = {};
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
    // fill dictionary with preassigned numbers
    for(i = 0; i < numOfTiles; i++){
        if(!bombLocations.includes(i)){
            assignedNumbers[i] = assignNumber(i);
        };
    };
    updateOdds();
});

// prevents a right click on a game tile from opening context menu
document.getElementById('game-grid').addEventListener('contextmenu', (e) => {
    e.preventDefault();
})

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
        let square = document.createElement('button');
        square.setAttribute('class', 'game-tile');
        square.setAttribute('id', i);
        square.setAttribute('type', 'button');
        square.setAttribute('onclick', 'clickTile(id, true)');
        square.setAttribute('oncontextmenu', 'rightClick(id)');
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
}


// assign numbers but do not show
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
    // add the checklist to the global dictionary
    checklistDict[id] = checklist;
    // check all appropriate locations for bombs
    for(num in checklist) {
        if(bombLocations.includes((id + checklist[num]))) {
            bombCount += 1;
        };
    };
    return bombCount;
}


// show numbers
function showNumber(id) {
    let current = document.getElementById(id);
    let tempChecklist = checklistDict[id];
    let num = assignedNumbers[id];
    // assign number on board to make visible
    if(num === 0) {
        current.innerHTML = '';
        // attempt at recursion for empty spots
        for(num in tempChecklist) {
            let potential = (id + tempChecklist[num]);
            if(!document.getElementById(potential).getAttribute('disabled')) {
                clickTile(potential, false);
            };
        };
    } else if(num > 0) {
        current.innerHTML = num;
        // change color of text based on number of bombs
        if(num === 1) {
            current.style.color = '#098500';
        } else if(num === 2) {
            current.style.color = '#CC6300';
        } else if(num === 3) {
            current.style.color = '#D10000';
        } else {
            current.style.color = '#97203E';
        };
    };
}


// makes right click put flag on space
function rightClick(id) {
    let current = document.getElementById(id);
    // will only place flag on non-disabled spaces
    if(!current.getAttribute('disabled')) {
        if(current.innerHTML === '') {
            current.innerHTML = '&#9873';
        } else if (current.innerHTML === '?') {
            current.innerHTML = '';
        } else if(current.innerHTML != '') {
            current.innerHTML = '?';
        };
    };
}

// what to do when a tile is clicked
function clickTile(id, scoring) {
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
        remainingTiles -= 1;
        updateOdds();
        showNumber(tileNum);
        // scoring variable allows true clicks to increase score and auto clicks to not score
        if(scoring === true) {
            // do score math outside of update score so that it doesnt give extra points on endgame
            score += (10 + (Math.floor(10 * odds)));
            updateScore();
            checkWin();
        };
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
    current.innerHTML = score;
    if(score > highScore) {
        highScore = score;
        high.innerHTML = highScore;
    };
}


// update the odds
function updateOdds() {
    odds = numOfBombs / remainingTiles;
    // convert odds to percentage form and display
    const percentage = Math.floor(odds * 100);
    document.getElementById('odds').innerHTML = `${percentage}%`;
}


// sequence for game end
function endGame() {
    // go through each tile and disable tile
    for(i = 0; i < numOfTiles; i++){
        let current = document.getElementById(i);
        // clears flags and extra content from board first
        current.innerHTML = '';
        showNumber(i);
        // show all bomb locations
        if(bombLocations.includes(i)) {
            current.innerHTML = '&#128165';
            // changing front color to white makes bombs more visible
            current.style.color = 'white';
        };
        current.setAttribute('disabled', 'true');
    };
    // bonus for completing quickly
    score += (remainingTime * 3);
    updateScore();
}


// check for win
function checkWin() {

    console.log('check')
    if(remainingTiles === numOfBombs) {
        // stop timer
        clearInterval(timerId);
        // show the rest of the board
        endGame();
    };
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
    assignedNumbers = {};
    checklistDict = {};
    score = 0;
    document.getElementById('score').innerHTML = 0;
    resetTiles(document.getElementById('game-grid'));
    createGameTiles();
    assignLocations(numOfTiles, numOfBombs);
    for(i = 0; i < numOfTiles; i++){
        if(!bombLocations.includes(i)){
            assignedNumbers[i] = assignNumber(i);
        };
    };
    updateOdds();
}