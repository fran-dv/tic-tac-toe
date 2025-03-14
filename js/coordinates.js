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