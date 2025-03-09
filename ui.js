// The internal board positioning system in 'tic-tac-toe.js' (logic) differs from the 'ui.js' (UI) coordinate system:
// - Logic System: 'board[row][col]' (array of arrays), where '[0, 0]' represents the top-left corner.
// - UI System: Cartesian coordinates '(x, y)', where '[0, n-1]' represents the top-left corner (x = horizontal axis, y = vertical axis).
//
// Use the functions below to convert between coordinate systems:
// - 'toUiCoordinates()': Converts logic coordinates '[row, col]' to UI coordinates '(x, y)'.
// - 'toLogicCoordinates()': Converts UI coordinates '(x, y)' to logic coordinates '[row, col]'.

const toUiCoordinates = (row, column, boardSize) => {
    const x = column;
    const y = boardSize - 1 - row;
    return [x, y];
}

const toLogicCoordinates = (x, y, boardSize) => {
    const row = boardSize - 1 - y;
    const column = x;
    return [row, column];
}

const displayBoard = (Gameboard) => {
    const createCell = (x, y) => {
        const cell = document.createElement('div');
        cell.setAttribute('class', 'cell');
        cell.setAttribute('data-x', String(x));
        cell.setAttribute('data-y', String(y));
        return cell;
    }

    const clearCurrentBoard = (parentDiv) => {
        while (parentDiv.firstChild) {
            parentDiv.removeChild(parentDiv.firstChild);
        }
    }

    const root = document.documentElement;
    root.style.setProperty('--board-size', String(Gameboard.getBoardSize()));
    const gameboardDiv = document.querySelector('#gameboard');
    let cell;
    clearCurrentBoard(gameboardDiv);

    for (let y = Gameboard.getBoardSize() - 1; y >= 0; y--) {
        for (let x = 0; x < Gameboard.getBoardSize(); x++) {
            cell = createCell(x, y);
            gameboardDiv.appendChild(cell);
        }
    }
}

const symbolStyles = () => {

    const styles = {
        xDefault : './images/x-symbol-default.svg',
        oDefault : './images/o-symbol-default.svg',
    }

    let [currentX, currentO] = [styles.xDefault, styles.oDefault];

    const getSymbolImgUrl = (symbol) => {
        return symbol === 'x' ? currentX :
               symbol === 'o' ? currentO :
               null;
    }

    return { getSymbolImgUrl }
}


const appearance = symbolStyles();


const createSymbol = (aSymbol) => {
    aSymbol = String(aSymbol);
    if (aSymbol === 'x' || aSymbol === 'o') {
        const symbolImg = document.createElement('img');
        symbolImg.setAttribute('class', 'symbol');
        
        const symbolImgUrl = appearance.getSymbolImgUrl(aSymbol);

        symbolImg.setAttribute('src', symbolImgUrl);
        return symbolImg;
    } else {
        console.log(`createSymbol() ERROR: ${aSymbol} is not valid. (only 'x' or 'o' are allowed)`);
        return null;
    }
}

const displayVictory = (Game) => {
    console.log(Game.getWinner().getName() + ' won the game!!');
}

let firstClick = true;

const clickOnCell = (cell, Game) => {

    const [x, y] = [parseInt(cell.dataset.x), parseInt(cell.dataset.y)];
    
    const [row, col] = toLogicCoordinates(x, y, Game.getBoard().getBoardSize());
    
    if (Game.getBoard().isCellEmpty(row, col)) {

        if (
            Game.getBoard().isBoardEmpty() && 
            !Game.Session.isFirstTurnOfRound()
        ) {
            displayBoard(Game.getBoard());
            Game.Session.startNewRound();
            return;
        };

        Game.markCell(row, col);
        // handle UI
        const symbolImg = createSymbol(Game.Session.getCurrentPlayerSymbol());
        cell.appendChild(symbolImg);

        Game.Session.switchTurn();

        if (Game.getWinner()) {
            displayVictory(Game);
        }
    }

}


const Game = newGame();
displayBoard(Game.getBoard());
const gameboardDiv = document.querySelector('#gameboard');

gameboardDiv.addEventListener('click', function(event) {
    const cell = event.target.closest('.cell');
    if (cell === null) { return };
    clickOnCell(cell, Game);
})

