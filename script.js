/*
Title: Minesweeper
Description: Classic game of minesweeper for browser
Last Updated: Aug 31, 2023
Developer: Alexander Beck
Email: beckhv2@gmail.com
Github: https://github.com/bexcoding
*/

// bombs will be signified by skull '&#9760'

const grid = document.getElementById('game-grid');
const gridSize = 10;
const numOfTiles = gridSize * gridSize;
const numOfBombs = 10;
let safeLocations = [];
let bombLocations = [];

//sets up new tiles and game on reload
window.addEventListener('load', () => {
    //create tiles
    createGameTiles();
    assignLocations(numOfTiles, numOfBombs);
    for (i in bombLocations) {
        let tempId = bombLocations[i];
        console.log(tempId)
        document.getElementById(tempId).innerHTML = '&#9760';
    }
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
        let square = document.createElement('div');
        square.setAttribute('class', 'game-tile');
        square.setAttribute('id', i);
        grid.appendChild(square);
    };
}


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