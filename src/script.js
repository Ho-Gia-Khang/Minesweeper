// danh sach cong viec du kien:
// 1. Populate a board with tiles/mines (done)
// 2. Left click on the titles
    // a. reveal titles (Done)
// 3. Right click on titles
    // a. Mark tiles (Partially done)
// 4. check for win/lose (Partially Done)

const TILE_STATUSES = {
    HIDDEN: "hidden",
    MINE: "mine",
    NUMBER: "number",
    MARKED: "marked"
}

// varialbles declaration
let boardSize = 8;
const NUMBER_OF_MINES = 10;

const board = createBoard(boardSize, NUMBER_OF_MINES);
const boardElement = document.querySelector(".board");
const minesLeftText = document.querySelector("[data-mine-count]")
const messageText = document.querySelector(".subtext");

minesLeftText.textContent = NUMBER_OF_MINES;
// initialize the game, the first move will always safe
generate(board, boardElement, boardSize);

// change the board size
let data;
const dropdown = document.getElementById('board-size');
dropdown.addEventListener('change', (e) => {
    data = e.target.value;
    console.log(data);
    switch(data){
        case '8x8':
            boardSize = 8;
            break;
        case '16x16':
            boardSize = 16;
            break;
    }

    const board = createBoard(boardSize, NUMBER_OF_MINES);
    const boardElement = document.querySelector(".board");
    
    render(board, boardElement, boardSize);
});

// generate the board
function generate(board, boardElement, boardSize){
    board.forEach(row => {
        row.forEach(tile => {
            boardElement.append(tile.element)
            tile.element.addEventListener("click", () => {
                revealTile(board, tile);
                checkGameEnd();
            })
            tile.element.addEventListener("contextmenu", e => {
                e.preventDefault();
                markTile(tile);
                //listMinesLeft();
            })
        })
    })
    boardElement.style.setProperty("--size", boardSize);
}

// re-render the board 
function render(board, boardElement, boardSize){
    document.getElementById('board').innerText = ''; // delete the old board
    board.forEach(row => {
        row.forEach(tile => {
            boardElement.append(tile.element);
            tile.element.addEventListener("click", () => {
                revealTile(board, tile);
                checkGameEnd()
            })
            tile.element.addEventListener("contextmenu", e => {
                e.preventDefault();
                markTile(tile);
                //listMinesLeft()
            })
        })
    })
    boardElement.style.setProperty("--size", boardSize);
}

// function to create the board
function createBoard(boardSize, numberOfMines){
    const board = [];
    const minePositions = getMinePositions(boardSize, numberOfMines);

    for (let x = 0; x < boardSize; x++) {
        const row = [];

        for (let y = 0; y < boardSize; y++) {
            const element = document.createElement("div");
            element.dataset.status = TILE_STATUSES.HIDDEN;

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
            };

            row.push(tile)
        }
        board.push(row);
    }

    return board;
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

//function to check game is over
function checkGameEnd() {
    const win = checkWin(board)
    const lose = checkLose(board)
    //Ngăn người dùng thao tác thêm
    if (win || lose) {
        boardElement.addEventListener('click', stopProp, {capture: true})
        boardElement.addEventListener('contextmenu', stopProp, {capture: true})
    }
    //Thắng
    if (win) {
        messageText.textContent = "You Win !!!"
    }
    //Thua
    if (lose) {
        messageText.textContent = "You Lost :<<"
        //Hàm này để hiện tất cả các mìn
        board.forEach(row => {
            row.forEach(tile => {
                if(tile.status === TILE_STATUSES.MARKED) markTile(tile)
                if(tile.mine) revealTile(board,tile)
           }) 
        })
    }
}

function stopProp(e) {
    e.stopImmediatePropagation()
}
//Thắng
function checkWin (board) {
    return board.every(row => {
        return row.every(tile => {
            return tile.status === TILE_STATUSES.NUMBER || 
            (tile.mine && // Nói tóm gọn là nếu số mìn bị dấu = số mìn ban đầu khi đã hết lượt bấm thì thắng
                (tile.status === TILE_STATUSES.HIDDEN ||
                    tile.status === TILE_STATUSES.MARKED))
        })
    })

}
 //Thua
function checkLose (board) {
    return board.some(row => {
        return row.some(tile => {
            return tile.status === TILE_STATUSES.MINE //Có mìn thì thua
        })
    })
}