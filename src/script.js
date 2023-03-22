// danh sach cong viec du kien:
// 1. Populate a board with tiles/mines
// 2. Left click on the titles
    // a. reveal titles (Done)
// 3. Right click on titles
    // a. Mark tiles (Partially done)
// 4. check for win/lose

const TILE_STATUSES = {
    HIDDEN: "hidden",
    MINE: "mine",
    NUMBER: "number",
    MARKED: "marked"
}

// initialize the game, the first move will always safe
function init(){
    // varialbles declaration
    const BOARD_SIZE = setBoardSize();
    const NUMBER_OF_MINES = 20

    const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES)
    const boardElement = document.querySelector(".board")
    const minesLeftText = document.querySelector("[data-mine-count]")
    const messageText = document.querySelector(".subtext")
    
    board.forEach(row => {
        row.forEach(tile => {
            console.log(tile)
            boardElement.append(tile.element)
            tile.element.addEventListener("click", () => {
                revealTile(board, tile)
                //checkGameEnd()
            })
            tile.element.addEventListener("contextmenu", e => {
                e.preventDefault()
                markTile(tile)
                //listMinesLeft()
            })
        })
    })
    boardElement.style.setProperty("--size", BOARD_SIZE)
    minesLeftText.textContent = NUMBER_OF_MINES
}

// set the size to the board
function setBoardSize(){
    const boardSize = 10;
    // dropdown.addEventListener('change', (e) => {
    //     boardSize = e.target.value;
    // });
    return boardSize;
}

export function createBoard(boardSize, numberOfMines){
    const board = []
    const minePositions = getMinePositions(boardSize, numberOfMines)

    for (let x = 0; x < boardSize; x++) {
        const row = []
        for (let y = 0; y < boardSize; y++) {
        const element = document.createElement("div")
        element.dataset.status = TILE_STATUSES.HIDDEN

        const tile = {
            element,
            x,
            y,
            mine: minePositions.some(positionMatch.bind(null, { x, y })),
            get status() {
            return this.element.dataset.status
            },
            set status(value) {
            this.element.dataset.status = value
            },
        }

        row.push(tile)
        }
        board.push(row)
    }

    return board
};

// function to mark tile 
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
        tile.status = TILE_STATUSES.MINE;
        return //end if the tile is a mine
    }

    tile.status = TILE_STATUSES.NUMBER;
    const nearbyTiles = adjacentTiles(board,tile);
    const mines = nearbyTiles.filter(t => t.mine);

    if (mines.length === 0){ //reveal nearby tiles that are not adjacent to any mines
        nearbyTiles.forEach(revealTile.bind(null,board));
    }
    else{ //show number of mines nearby
        tile.element.textContent = mines.length;
    }
}

// function to calculate the number of bombs surround the square
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

//function to generate Mines positions
function getMinePositions(boardSize, bombAmount){
    const positions = []

    //Loop until enough Mines
    while (positions.length < bombAmount){ 
        const position = {
            x: random(boardSize),
            y: random(boardSize),
        };

        if (!positions.some(p => positionMatch(p,position))){
            positions.push(position);
        }
    }

    return positions
}

//return true if the two positions are the same
function positionMatch(a,b){
    return a.x === b.x && a.y === b.y
}

//return a random integer
function random(size){ 
    return Math.floor(Math.random() * size);
}

init()