# MineSweeper

This project is my version of the classic game "Minesweeper". The resulting game has a majority of the features of the original game with my own theme and layout and with a unique take on a scoring system. I designed several different game modes which each have different numbers of bombs hidden in the grid. For this project, I decided to keep track of the steps that I took in the creation process along with the challenges I faced along the way. You can play my version of [MineSweeper](https://bexcoding.github.io/minesweeper/ms-index.html) online, which is hosted live on my project website.

# Functionality

- Layout: There are three main sections: the header, which includes the title of the game; the display, which shows the high score, current score, odds multiplier, and the new game button; and the game board, which is a series of tiles that can be clicked on to reveal what lies beneath.
- Timer: There is a timer at the top of the display section. It gives the player 10 minutes to finish the game. If the time runs out, the board is revealed and the game is over. The last minute of time is displayed in red numbers.
- Scoreboard: The scoreboard shows the high score and the current score. Even if the game isn't won, if the current score is ever higher than the high score, the high score will update immediately. The high score will be remembered as long as the browser is not closed and the page is not reloaded.
- Scoring System: Each tile that is clicked earns the player ((10 + (10 * odds)) * difficulty) points. Odds is the odds of randomly choosing a bomb from the remaining tiles. In other words, if there are 11 tiles remaining and 10 of them are bombs, then the odds are 10 / 11. The difficulty bonus is based off of what difficulty the player chooses. Easy has a difficulty of 1 and nightmare mode has a difficulty of 4. If the player wins, they get two additional bonuses. First, they get (2 * remaining time) where the remaining time is in seconds (i.e. 200 seconds left gets 2 * 200 points). Second, there is additional bonus for completing the grid on harder difficulties. The entire score is multiplied by the difficulty level after all other points and bonuses are added. In this way, the player can increase their score by completing the grid faster or by increasing the difficulty.
- Odds Multiplier: This shows the current chances of randomly selecting a tile with a hidden bomb. It is displayed as a percentage.
- Difficulty Selectors: There are four different difficulties to choose from: easy, medium, hard, and nightmare. The total number of bombs in each level are shown next to each option. The selectors are radio buttons so that only one of the four options can be chosen at a time. The default for when the page loads is easy mode.
- New Game Button: The New Game button takes into consideration which difficulty is selected and resets the board with the correct number of bombs. 
- Game Board: The game board is a 10x10 grid with 100 tiles. Each tile is a button that can be clicked. When the tile is clicked, it shows whether it was a bomb or not. If the tile has a bomb, the whole board is shown and the game is immediately over. If the tile didn't have a bomb, the space is either clear or has a number that it shows. The number tells how many of the adjacent squares have bombs. If the space has no adjacent bombs and has no number, it automatically clicks on each adjacent square. This is continued until all adjacent blank spaces are shown along with the numbers next to the blank spaces. If the player wins, the whole board is shown and all of the squares that had bombs show hearts instead.

# Process and Challenges

After setting up the index, style, and script files and linking them together, I focused on getting the layout of the page correct before worrying about logic. Most importantly, I created the grid in the middle and made sure that I could get the script to create 100 uniform tiles. This was important because it saved time and space instead of hard-coding 100 individual tiles in my HTML page. Next, I made sure that I could assign bombs to random locations each time. When a bomb was clicked, the whole board would show all the spaces, including where the other bombs were.
At this point, much of the styling of the grid was completed, so I began working on the display area. I made a timer that would count down from 10 minutes. I had to change a couple lines of code so that there were leading zeros and the timer would stay in xx:xx format instead of going sometimes to a x:x format when the time changed. 
Adding the timer added two obstacles. First, my timer accelerated each time I clicked a tile. This meant that after a couple clicks, the timer would be running several times faster than it should have. The solution was in realizing that I had forgot to tell the program that the clock was running after the first click. This resulted in several timers running simultaneously with each timer decrementing the time individually. Second, my timer wouldn't stop after the game was over. It would appear to stop counting down, but I could tell in the console that it kept running. It turns out that the setInterval() function returns an ID every time that the function is called. If you want to have the clearInterval() function work correctly, you need to get the ID from the setInterval() function. This is accomplished by assigning the call of setInterval() to a variable and then later using that variable name as an argument for clearInterval(). 
After the timer was fixed, it was simple to create a scoreboard that would keep track of a high score. Next I added the odds multiplier and new game button without issue. After this, I finally needed to tackle one of the biggest logic pieces - assigning numbers to safe spaces. The first step to this problem was helping the tiles decide what counted as an adjacent tile. Unfortunately, I couldn't just use a range of numbers. I had to add a series of checks that would tell if the given tile was on the left, right, top, bottom edge or any combination of these. The tile could also be in the middle, which meant that there were nine total options of what kind of location that the tile had. After telling the tile where it was, the tile was assigned a checklist of places that were required to be checked. Each of the nine tile location types had a different checklist. This is because a tile in the center of the board has to check up to eight different other tiles while the top left tile only has to check three other spaces.

- each number is a different color; allow right click to mark with flags
- fixed recursion for blank spaces by changing recursive call from assign number to click tile
- fixed timer so that it stops on win
- split assigning numbers and showing numbers to different functions
- assign numbers once and added dict so they could be accessed later
- give points for extra time
- fixed scoring so that it doesnt give time or difficulty bonus to a loss
- winning turns bombs into red hearts
- added winning game message
- added difficulty buttons and logic
- comment on code


# Obstacles

- how to get content to act like button but show info when clicked
- how to get button to pass id when clicked so it can be disabled
- unsure how to get recursion to work without exceeding call stack
- trying to debug scoring so that score doesn't increase for recursive spots - but assign number and click tile call each other