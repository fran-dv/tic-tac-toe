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
