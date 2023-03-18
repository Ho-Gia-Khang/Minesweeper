// danh sach cong viec du kien:
    // 1. Populate a board with tiles/mines
    // 2. Left click on the titles
        // a. reveal titles (Done)
    // 3. Right click on titles
        // a. Mark tiles (Partially done)
    // 4. check for win/lose

document.addEventListener('DOMContentLoaded',() =>{
    // varialbles declaration
    const dropdown = document.getElementById("board-size");
    const TILE_STATUSES = {
        HIDDEN: 'hidden',
        MINE: 'mine',
        NUMBER: 'number',
        MARKED: 'marked'
    }
    let board;
    let boardSize = 8;
    let width = 10;
    let height = 10;
    let bombAmount = 10;
    let flags = 0;
    let squares = [];
    let isGameOver = false;

    // initialize the game, the first move will always safe
    function init(){
        setBoardSize();
        board = createBoard(boardSize, bombAmount);
        const boardElement = document.querySelector('.board');
        board.forEach(row => {
            row.forEach(tile =>{
                boardElement.append(tile.element);
                tile.element.addEventListener("click", () => {
                    revealTile(board,tile)
                })
                tile.element.addEventListener("contextmenu", e => {
                    e.preventDefault()
                    markTile(tile)
                })
            })
        })
    };

    // set the size to the board
    function setBoardSize(){
        dropdown.addEventListener('change', (e) => {
            boardSize = e.target.value;
        });
    }

    // main function to create the board
    function createBoard(boardSize, bombAmount){
        minePositions = getMinepositions(boardSize,bombAmount)
        const board = [];
        for(let x = 0; x < boardSize; x++){
            const row = [];
            const element = document.createElement('div');
            element.dataset.status = TILE_STATUSES.HIDDEN;
            for(let y = 0; y < boardSize; y++){
                const tile = {
                    element, 
                    mine: minePositions.some(positionMatch.bind(null,{x,y})),
                    x, 
                    y};
            }
            row.push(tile);
        }
        board.push(row);

        return board;
    };

    // function to draw the board
    function drawSquares(color, position){
        this.squareColor = color;
        this.position = position;
    };

    // function to handle the click event
    function click(){

    };

    //function to mark tile 
    function markTile(tile){
        if(tile.status !== TILE_STATUSES.HIDDEN && 
           tile.status !== TILE_STATUSES.MARKED){
           return //end if it's already reveal
        }

        if (tile.status === TILE_STATUSES.MARKED){
            tile.status = TILE_STATUSES.HIDDEN //if it's marked unmark it
        }
        else {tile.status = TILE_STATUSES.MARKED} //mark it otherwise
    }   
    
    //function to reveal the clicked tile
    function revealTile(board, tile){
        if (tile.status !== TILE_STATUSES.HIDDEN){
            return //end if tile is already reveal
        }

        if(tile.mine){
            tile.status = TILE_STATUSES.MINE
            return //end if the tile is a mine
        }

        tile.status = TILE_STATUSES.NUMBER
        const adjacentTiles = adjacentTiles(board,tile)
        const mines = adjacentTiles.filter(t => t.mine)

        if (mines.length === 0){ //reveal nearby tiles that are not adjacent to any mines
            adjacentTiles.forEach(revealTile.bind(null,board))
        }
        else{ //show number of mines nearby
            tile.element.textContent = mines.length
        }
    }

    //function to check how many bombs are around the clicked tile
    function adjacentTiles(board, {x,y}){
        const tiles = []

        for(let xOff = -1; xOff<=1; xOff++){ //nearby postions on left and right
            for(let yOff = -1; yOff<=1; yOff++){ //nearby positions upper and bellow
                const tile = board[x+xOff]?.[y+yOff]
                if (tile){
                 tiles.push(tile)
                }
            }
        }

        return tiles
    }
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

    //function to generate Mines positions
    function getMinepositions(boardSize, bombAmount){
        const positions = []

        //Loop until enough Mines
        while (positions.length < bombAmount){ 
            const position = {
                x: random(boardSize),
                y: random(boardSize),
            }

            if (!positions.some(p => positionMatch(p,position))){
                positions.push(position)
            }
        }

        return positions
    }

    //return true if the two positions are the same
    function positionMatch(a,b){
        return a.x === b.x && a.y === b.y
    }

    //return a random integer
    function random(boardSize){ 
        return Math.floor(Math.random() * boardSize)
    }
})