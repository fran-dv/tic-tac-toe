
function newGameboard (rows, columns) {
    const board = [];

    function newCell(){
        // the status can be index 0 (free) or 1 (occupied)
        const statusOptions = ['free', 'occupied']
        let status = statusOptions[0];
        // the symbol can be X, O or null if the cell is free
        const symbolOptions = [null, 'x', 'o'];
        let innerSymbol = symbolOptions[0];

        function isAvailable() {
            return status === statusOptions[0];
        }

        function toggleStatus() {
            status = status === statusOptions[0] ? statusOptions[1] : statusOptions[0];
        }

        const getStatus = () => {
            return status;
        }

        const setStatus = (aStatus) => {
            if (statusOptions.includes(aStatus)) {
                status = aStatus;
            } else {
                console.log(
                    `setStatus() ERROR: ${aStatus} is not a valid option
                    (valid options:'${symbolOptions[1]}', '${symbolOptions[2]} or null')`
                )
            }
        }

        const setSymbol = (symbol) => {
            if (!symbolOptions.includes(symbol)) {
                return console.log(
                    `setSymbol() ERROR: Invalid symbol options 
                    (valid options:'${symbolOptions[1]}', '${symbolOptions[2]} or null')`
                )
            } else if (isAvailable()) {
                innerSymbol = symbol;
                toggleStatus();
            } else if (!isAvailable() && symbol === symbolOptions[0]){ // to 'erase' the cell)
                innerSymbol = symbol;
                setStatus(statusOptions[0]);
            }  
        }

        const getSymbol = () => {
            return innerSymbol;
        }

        return { setStatus, getStatus, setSymbol, getSymbol };
    }

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(newCell());
        }
    }

    function isValidCell(row, col) {
        return (row < board.length && col < board[row].length);
    }

    const reset = () => {
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[i].length; col++) {
                if (board[row][col].getStatus() === 'occupied') {
                    board[row][col].setSymbol(null);
                }
            }
        }
    }

    const placeMarker = (row, col, symbol) => {
        if (isValidCell(row, col)){
            const currentCell = board[row][col];
            if (currentCell.getStatus() === 'free') {
                currentCell.setSymbol(symbol);
            }
        } else {
            return console.log(`placeMarker() ERROR: The cell in position [${row}, ${col}] does not exist`);
        }
        
    }

    const getCellStatus = (row, col) => {
        if (isValidCell(row, col)) {
            return board[row][col].getStatus();
        } else {
            return console.log(`getCellStatus() ERROR: The cell in position [${row}, ${col}] does not exist`);
        }
    }

    return { reset, placeMarker, getCellStatus }
}

