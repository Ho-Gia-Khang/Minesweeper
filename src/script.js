// danh sach cong viec du kien:
    // 1. Populate a board with tiles/mines
    // 2. Left click on the titles
        // a. reveal titles
    // 3. Right click on titles
        // a. Mark tiles
    // 4. check for win/lose

document.addEventListener('DOMContentLoaded',() =>{
    // varialbles declaration
    const dropdown = document.getElementById("board-size");
    let boardSize = "8x8";
    let width = 10;
    let height = 10;
    let bombAmount = 20;
    let flags = 0;
    let squares = [];
    let isGameOver = false;

    // initialize the game, the first move will always safe
    function init(){
        setBoardSize();
        createBoard();
    };

    // set the size to the board
    function setBoardSize(){
        dropdown.addEventListener('change', (e) => {
            boardSize = e.target.value;
        });
    }

    // main function to create the board
    function createBoard(boardSize){
        let board = document.getElementById("board");
        board.appendChild(document.createElement('button'));
    };

    // function to draw the board
    function drawSquares(color, position){
        this.squareColor = color;
        this.position = position;
    };

    // function to handle the click event
    function click(){

    };

    // function to check whether the square is a bomb, or any bomb near by the square to calculate the display number
    function checkSquare(){

    };

    // function to add the flag onto the square
    function addFlag(){
        
    };

    // function to draw the added flags
    function drawFlags(position){
        this.position = position;
    };
})