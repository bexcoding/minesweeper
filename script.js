/*
Title: Minesweeper
Description: Classic game of minesweeper for browser
Last Updated: Aug 31, 2023
Developer: Alexander Beck
Email: beckhv2@gmail.com
Github: https://github.com/bexcoding
*/

const grid = document.getElementById('game-grid');
const gridSize = 10;

for(i = 0; i < (gridSize * gridSize); i++) {
    let square = document.createElement('div');
    square.setAttribute('class', 'game-tile');
    square.setAttribute('id', i);
    grid.appendChild(square);
}