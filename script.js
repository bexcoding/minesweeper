/*
Title: Minesweeper
Description: Classic game of minesweeper for browser
Last Updated: Sep 11, 2023
Developer: Alexander Beck
Email: beckhv2@gmail.com
Github: https://github.com/bexcoding
*/


const grid = document.getElementById('game-grid');
// grid size can change, but assignNumber would need edit to make universal
const gridSize = 10;
const numOfTiles = gridSize * gridSize;
// numOfBombs can be in range [1-100]
let numOfBombs = 10;
// difficulty ranges 1-4; defaults on load to easy
let difficulty = 1;
// remainingTiles used to decrement and count for odds
let remainingTiles = numOfTiles;
let timerStarted = false;
// default time is 10 minutes
let remainingTime = 600;
let safeLocations = [];
let bombLocations = [];
// assignedNumbers allows numbers to be assigned and only accessed after click
let assignedNumbers = {};
// checkListDict allows the checklist for each tile to be accessed globally
let checklistDict = {};
// initialize timerid here so that it can be accessed globally
let timerId;
let score = 0;
let highScore = 0;
// odds of randomly choosing a tile with a bomb
let odds = numOfBombs / numOfTiles;


// on load creates tiles, updates odds, and assigns bombs and numbers
window.addEventListener('load', () => {
    createGameTiles();
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


/**
 * Fisher-Yates sorting algorithm; for randomizing list during bomb assigning
 * @param {list} list - list to be shuffled randomly
 */
function shuffleArray(list) {
  for(let i = list.length - 1; i > 0; i--) { 
    const j = Math.floor(Math.random() * (i + 1)); 
    [list[i], list[j]] = [list[j], list[i]]; 
  };
  return list; 
} 


/**
 * creates the tiles where numbers and bombs are hidden
 */
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


/**
 * used to delete all tiles when a new game is created
 * @param {*} parent - parent item (i.e. game-grid)
 */
function resetTiles(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    };
}


/**
 * randomly assigns safe locations and bomb locations
 * @param {number} bombTotal - number of bombs in game
 * @param {number} tileTotal - number of tiles in grid
 */
function assignLocations(tileTotal, bombTotal) {
    let safe = [];
    //start with all locations as safe
    for(i = 0; i < tileTotal; i++) {
        safe.push(i);
    };
    //move some locations to unsafe bomb list
    for(i = 0; i < bombTotal; i++) {
        safe = shuffleArray(safe);
        let newBomb = safe.pop();
        bombLocations.push(newBomb);
    };
    // set safe locations as all remaining locations that are not bombs 
    safeLocations = safe;
}


/**
 * assigns numbers to safe locations
 * needs to be re-written if grid is different than 10x10
 * @param {number} id - id number of tile
 * @returns {number} bombCount - how many bombs are surrounding the tile
 */
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


/**
 * displays numbers when it is clicked or the game ends
 * @param {number} id - id for a particular tile
 */
function showNumber(id) {
    let current = document.getElementById(id);
    let tempChecklist = checklistDict[id];
    let num = assignedNumbers[id];
    // if tile has no adjacent bombs, click each surrounding tile
    if(num === 0) {
        // clear question marks or flags
        current.innerHTML = '';
        // recursion for adjacent empty tiles
        for(num in tempChecklist) {
            let potential = (id + tempChecklist[num]);
            // only click on adjacent tiles if they are not already clicked
            if(!document.getElementById(potential).getAttribute('disabled')) {
                // scoring marked as false to prevent extra points
                clickTile(potential, false);
            };
        };
    } else if(num > 0) {
        current.innerHTML = num;
        // change color of number based on number of bombs
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


/**
 * handles right click on game tiles; adds flag, ?, or changes to blank
 * @param {number} id - id for a particular tile
 */
function rightClick(id) {
    let current = document.getElementById(id);
    // will only place flag on non-disabled spaces
    if(!current.getAttribute('disabled')) {
        // if tile is blank, add flag
        if(current.innerHTML === '') {
            current.innerHTML = '&#9873';
        // if tile has ?, make blank
        } else if (current.innerHTML === '?') {
            current.innerHTML = '';
        // if tile has flag, add ?
        } else if(current.innerHTML != '') {
            current.innerHTML = '?';
        };
    };
}


/**
 * handles left mouse click on tile; either activates bomb or shows number
 * @param {string} id - id for a particular tile; is string for this function
 * @param {boolean} scoring - true or false; decides if click counts for points
 */
function clickTile(id, scoring) {
    let tile = document.getElementById(id);
    let tileNum = Number(id);
    if(timerStarted === false) {
        timerStarted = true;
        startTimer();
    };
    // makes tile clickable only once
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
        showNumber(tileNum);
        // only increase score if tile is clicked by user and is not auto click
        if(scoring === true) {
            // math outside of updateScore so no extra points on endgame
            score += ((10 + (Math.floor(10 * odds))) * difficulty);
            updateScore();
            checkWin();
        };
        // update odds after scoring, so bonus is not applied early
        updateOdds();
    };
}


/**
 * starts timer if not already started
 */
function startTimer() {
    let timer = document.getElementById('timer');
    // timerid carries return value for interval so timer can be stopped later
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
        };
    }, 1000);
}


/**
 * updates higscore and current score
 */
function updateScore() {
    let current = document.getElementById('score');
    let high = document.getElementById('hi-score');
    current.innerHTML = score;
    if(score > highScore) {
        highScore = score;
        high.innerHTML = highScore;
    };
}


/**
 * calculates odds of randomly choosing a tile with a bomb; displayed as percent
 */
function updateOdds() {
    odds = numOfBombs / remainingTiles;
    // convert odds to percentage form and display
    const percentage = Math.floor(odds * 100);
    document.getElementById('odds').innerHTML = `${percentage}%`;
}


/**
 * sequence to run when game is over
 */
function endGame() {
    for(i = 0; i < numOfTiles; i++){
        let current = document.getElementById(i);
        // clears flags and extra content from board first
        current.innerHTML = '';
        // show all numbers
        showNumber(i);
        // show all bomb locations
        if(bombLocations.includes(i)) {
            current.innerHTML = '&#128165';
            // changing front color to white makes bombs more visible
            current.style.color = 'white';
        };
        // set all tiles to disabled
        current.setAttribute('disabled', 'true');
    };
}


/**
 * check if game is won; victory if remaining tiles are all bombs
 */
function checkWin() {
    if(remainingTiles === numOfBombs) {
        // stop timer
        clearInterval(timerId);
        // time bonus
        score += (remainingTime * 2);
        // bonus for difficulty
        score *= difficulty;
        updateScore();
        // show the rest of the board
        endGame();
        // win turns bombs into red hearts
        for(i in bombLocations){
            let current = document.getElementById(bombLocations[i]);
            current.innerHTML = '&#10084';
            current.style.color = 'red';
        };
        // message on delay so all endgame elements complete before message
        setTimeout(() => {
            alert(`You Won!\nYour score was ${score}.\nYour high score is ${highScore}.\nIncrease your difficulty or go faster for a higher score.`);
        }, 1000);
    };
}


/**
 * resets all variables and creates a new game with selected difficulty
 */
function newGame() {
    // check for selected difficulty before starting game
    let dif = document.getElementsByName('difficulty');
    for(i = 0; i < dif.length; i++) {
        if(dif[i].checked) {
            difficulty = Number(dif[i].value);
        };
    };
    // change bomb numbers based on difficulty
    if(difficulty === 1) {
        numOfBombs = 10;
    } else if(difficulty === 2) {
        numOfBombs = 15;
    } else if(difficulty === 3) {
        numOfBombs = 20;
    } else if(difficulty === 4) {
        numOfBombs = 30;
    };
    // clear timer first in case previous game was not finished
    clearInterval(timerId);
    document.getElementById('timer').innerHTML = '10:00';
    remainingTiles = numOfTiles;
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