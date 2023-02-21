// varialbles declaration
let isLightSquare;
let squareColor;
let lightCol;
let darkCol;
let position;
const whiteIndex = 0;
const blackIndex = 1;

// main function to create the board
function createGraphicalBoard(){
    for (file = 0; file < 8; file++){
        for(rank = 0; rank < 8; rank++){
            isLightSquare = (file + rank) % 2 != 0; // check the color of the square
            if(isLightSquare){
                squareColor = lightCol;
            }
            else{
                squareColor = darkCol;
            }
            position = [file*64, rank*64]
            
            drawSquares(color, position)
        }
    }
}

// function to draw the board
function drawSquares(color, position){
    this.squareColor = color;
    this.position = position;
}