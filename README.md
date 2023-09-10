# Minesweeper

Game in the style of classic minesweeper.

# Functionality

# Process

- create index, readme, style, and script and link them together
- create grid in middle
- create tiles to fit into grid
- create function to assign locations to safe spaces and bombs
- display skulls at bomb locations
- removed skulls and turned divs into buttons
- disables button on click
- shows explosion if it is a bomb
- if bomb occurs, show all squares with bombs and disable all buttons
- changed min width
- added color to tile hover
- change main layout to grid
- created display area
- finish grid layout
- added basic timer
- fixed leading zero for timer
- fixed error for timer double counting. forgot to set timerstarted to true
- time running out ends game and throws message
- stylized timer and made larger
- styled scoreboard and add logic to track score and high score
- added odds multiplier
- added newgame button and ability to reset all game components
- add function to assign numbers; only done as revealed so that the entire board does not need to be calculated on load.
- each number is a different color; allow right click to mark with flags
- fixed recursion for blank spaces by changing recursive call from assign number to click tile
- fixed timer so that it stops on win
- split assigning numbers and showing numbers to different functions
- assign numbers once and added dict so they could be accessed later
- give points for extra time


# Obstacles

- how to get content to act like button but show info when clicked
- how to get button to pass id when clicked so it can be disabled
- how to get timer to space correctly and stop when wanted. also timer runs multiple times
- couldnt get timer to stop. needed setinterval. also needed to get the return value by assigning the interval start to a variable
- unsure how to get recursion to work without exceeding call stack
- trying to debug scoring so that score doesn't increase for recursive spots - but assign number and click tile call each other