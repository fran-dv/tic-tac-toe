const newGameboard = (sizeInput) => {
    const MAX_BOARD_SIZE = 9;
    const DEFAULT_SIZE = 3;

    function newCell(){
    
        // the symbol can be null [0], X [1] or O [2]
        const symbolOptions = [null, 'x', 'o'];

        let innerSymbol = symbolOptions[0];

        const isAvailable = () => {
            return innerSymbol === symbolOptions[0];
        }

        const setSymbol = (symbol) => {
            if (!symbolOptions.includes(symbol)) {
                return console.log(
                    `setSymbol() ERROR: Invalid symbol options 
                    (valid options:'${symbolOptions[1]}', '${symbolOptions[2]} or null')`
                )
            } else if (isAvailable()) {
                innerSymbol = symbol;
            } else if (!isAvailable() && symbol === symbolOptions[0]){ // to 'erase' the cell)
                innerSymbol = symbol;
            }  
        }

        const getSymbol = () => {
            return innerSymbol;
        }

        return { isAvailable, setSymbol, getSymbol };
    }

    // board size validation
    const _validateBoardSize = (size) => {
        if (
            typeof size !== 'number' || 
            size < 0 ||
            size > MAX_BOARD_SIZE ||
            size % 3 !== 0
        ) {
            return DEFAULT_SIZE;
        }
        return size;
    }

    const boardSize = _validateBoardSize(sizeInput);


    const _getRows = () => boardSize;

    const _getCols = () => boardSize;

    const getBoardSize =  () => boardSize;

    const board = [];

    const MIN_BOARD_POINT = 0;
    const MAX_BOARD_POINT = getBoardSize();

    for (let i = 0; i < _getRows(); i++) {
        board[i] = [];
        for (let j = 0; j < _getCols(); j++) {
            board[i].push(newCell());
        }
    }

    // winner line for each board size
    const WIN_CONDITIONS = {
        3 : 3,
        5 : 4,
        7 : 5,
        9 : 6
    }

    const getSymbolsToWin = () => {
        return WIN_CONDITIONS[getBoardSize()];
    }

    function isValidCell(row, col) {
        return (row < _getRows() && col < _getCols());
    }

    const reset = () => {
        for (let row = 0; row < _getRows(); row++) {
            for (let col = 0; col < _getCols(); col++) {
                if (!board[row][col].isAvailable()) {
                    board[row][col].setSymbol(null);
                }
            }
        }
    }

    const placeMarker = (row, col, symbol) => {
        if (isValidCell(row, col)){
            const currentCell = board[row][col];
            if (currentCell.isAvailable()) {
                currentCell.setSymbol(symbol);
            } else {
                return null;
            }
        } else {
            return console.log(`placeMarker() ERROR: The cell in position [${row}, ${col}] does not exist`);
        }
        
    }

    const isCellEmpty = (row, col) => {
        if (isValidCell(row, col)) {
            return board[row][col].isAvailable();
        } else {
            return console.log(`isCellEmpty() ERROR: The cell in position [${row}, ${col}] does not exist`);
        }
    }

    const _isCellSymbolDifferent = (row, col, symbol) => {
        return board[row][col].getSymbol() !== symbol;
    }


    const _checkRowInLine = (row, symbol) => {
        let inLineAmount = 0;
        let col = 0;
        while(col < getBoardSize() && inLineAmount < getSymbolsToWin()){
            if(
                !_isCellSymbolDifferent(row, col, symbol) &&
                col + 1 < getBoardSize() && 
                !_isCellSymbolDifferent(row, col + 1, symbol) // the next one
            ) {
                ++inLineAmount;
            } else if (
                !_isCellSymbolDifferent(row, col, symbol) &&
                inLineAmount === getSymbolsToWin() - 1
            ) {
                ++inLineAmount;
            } else {
                inLineAmount = 0;
            }

            ++col;
        }
        return inLineAmount === getSymbolsToWin();
    }

    const _checkColumnInLine = (col, symbol) => {
        let inLineAmount = 0;
        let row = 0;
        while(row < getBoardSize() && inLineAmount < getSymbolsToWin()){
            if(
                !_isCellSymbolDifferent(row, col, symbol) &&
                row + 1 < getBoardSize() && 
                !_isCellSymbolDifferent(row + 1, col, symbol) // the next one
            ) {
                ++inLineAmount;
            } else if (
                !_isCellSymbolDifferent(row, col, symbol) &&
                inLineAmount === getSymbolsToWin() - 1
            ) {
                ++inLineAmount;
            } else {
                inLineAmount = 0;
            }

            ++row;
        }

        return inLineAmount === getSymbolsToWin();
    }

    // check the diagonal of the current position
    const _checkDiagonalInLine = (row, col, symbol) => {
        const checkDiagonalAbove = () => {
            let inLineAmount = 0;
            for (let [x, y] = [row, col]; x >= 0 && y < getBoardSize(); x--, y++){
                if (
                    !_isCellSymbolDifferent(x, y, symbol) &&
                    x - 1 >= 0 && y + 1 < getBoardSize() &&
                    !_isCellSymbolDifferent(x - 1, y + 1, symbol) // the consecutive cell
                ) {
                    ++inLineAmount;
                } else if (
                    !_isCellSymbolDifferent(x, y, symbol) &&
                    inLineAmount === getSymbolsToWin() - 1
                ) {
                    ++inLineAmount;
                } else {
                    inLineAmount = 0;
                }

                if (inLineAmount >= getSymbolsToWin()) {
                    break;
                }
            }
            return inLineAmount;
        }

        const checkDiagonalBelow = () => {
            let inLineAmount = 0;
            for (let [x, y] = [row, col]; x < getBoardSize() && y >= 0; x++, y--){
                if (
                    !_isCellSymbolDifferent(x, y, symbol) &&
                    x + 1 < getBoardSize() && y -1 >= 0 &&
                    !_isCellSymbolDifferent(x +1, y -1, symbol) // the consecutive cell
                ) {
                    ++inLineAmount;
                } else if (
                    !_isCellSymbolDifferent(x, y, symbol) &&
                    inLineAmount === getSymbolsToWin() - 1
                ) {
                    ++inLineAmount;
                } else {
                    inLineAmount = 0;
                }

                if (inLineAmount >= getSymbolsToWin()) {
                    break;
                }
            }
            return inLineAmount;
        }

        const symbolsInLine = checkDiagonalAbove() + checkDiagonalBelow();

        return symbolsInLine === getSymbolsToWin();

    }

    const _checkAntiDiagonalInLine = (row, col, symbol) => {        
        const checkAntiDiagonalAbove = () => {
            let inLineAmount = 0;
            for (let [x, y] = [row, col]; x < getBoardSize() && y < getBoardSize(); ++x, ++y) {
                if (
                    !_isCellSymbolDifferent(x, y, symbol) &&
                    x + 1 < getBoardSize() &&
                    y + 1 < getBoardSize() &&
                    !_isCellSymbolDifferent(x + 1, y + 1, symbol)
                ) {
                    ++inLineAmount;
                } else if (
                    !_isCellSymbolDifferent(x, y, symbol) &&
                    inLineAmount === getSymbolsToWin() - 1
                ) {
                    ++inLineAmount;
                } else {
                    inLineAmount = 0;
                }

                if (inLineAmount >= getSymbolsToWin()) {
                    break;
                }
            }
            return inLineAmount;
        }

        const checkAntiDiagonalBelow = () => {
            let inLineAmount = 0;
            for (let [x, y] = [row, col]; x >= 0 && y >= 0; --x, --y) {
                if (
                    !_isCellSymbolDifferent(x, y, symbol) &&
                    x - 1 >= 0 &&
                    y - 1 >= 0 &&
                    !_isCellSymbolDifferent(x - 1, y - 1, symbol)
                ) {
                    ++inLineAmount;
                } else if (
                    !_isCellSymbolDifferent(x, y, symbol) &&
                    inLineAmount === getSymbolsToWin() - 1
                ){
                    ++inLineAmount;
                } else {
                    inLineAmount = 0;
                }

                if (inLineAmount >= getSymbolsToWin()) {
                    break;
                }
            }
            return inLineAmount;
        }

        const symbolsInLine = checkAntiDiagonalAbove() + checkAntiDiagonalBelow();

        return symbolsInLine === getSymbolsToWin();
    }

    const checkLineWin = (symbol, row, col) => {
        if (!isValidCell(row, col)) {
            console.log(`checkLineWin() ERROR: [${row}, ${col}] is not a valid cell`)
            return false;
        }

        return (
            _checkRowInLine(row, symbol) ||
            _checkColumnInLine(col, symbol) ||
            _checkDiagonalInLine(row, col, symbol) ||
            _checkAntiDiagonalInLine(row, col, symbol)
        );
    }

    

    return { reset, placeMarker, isCellEmpty, getBoardSize, checkLineWin };
}

const newPlayer = (aName) => {
    let score = 0;
    let name = aName;

    const getName = () => name;
    const setName = (otherName) => {
        name = otherName;
    }
    const getScore = () => score;
    const incrementScore = () => ++score;

    return { getName, setName, getScore, incrementScore };
}

const setGameConfig = (player1, player2, Gameboard, scoreToWin) => {
    return {player1, player2, Gameboard, scoreToWin};
}

const newGame = (configuration) => {
    
    const defaultConfig = {
        player1 : newPlayer('player one'),
        player2 : newPlayer('player two'),
        Gameboard : newGameboard(3, 3), // classic 3x3 grid
        scoreToWin : 3,
    }

    const  _isValidPlayer = (player) => {
        return (
                player &&
                player.getName() &&
                player.getScore() &&
                player.incrementScore()
        );
    }

    const _isValidGameConfig = (config) => {
        return (
                config && 
                (config.player1 && _isValidPlayer(config.player1)) &&
                (config.player2 && _isValidPlayer(config.player2)) &&
                config.Gameboard &&
                (config.scoreToWin && typeof config.scoreToWin === 'number' && config.scoreToWin > 0)
            );
    }

    const config = _isValidGameConfig(configuration) ? configuration : defaultConfig;

    const { player1, player2, Gameboard, scoreToWin } = config;
    let winner = null;
    let playerInTurn = player1;

    const getBoard = () => Gameboard;

    const _isValidRow = (row) => {
        return row < Gameboard.getBoardSize();
    }

    const _isValidColumn = (col) => {
        return col < Gameboard.getBoardSize();
    }

    const getScoreToWin = () => scoreToWin;

    const getWinner = () => winner;

    const getPlayerInTurn = () => playerInTurn; 

    const _toggleTurn = () => {
        playerInTurn = playerInTurn === player1 ? player2 : player1;
    }

    const _resetTurn = (previousStarter) => {
        playerInTurn = previousStarter === player1 ? player2 : player1;
    }

    const _isWinner = (player) => {
        return player.getScore() === getScoreToWin();
    }
    
    const markCell = (row, col) => {
        const player = getPlayerInTurn();
        let previousRoundStarter = player1;
        const togglePreviousStarter = () => {
            previousRoundStarter = previousRoundStarter === player1 ? player2 : player1;
        }
        if (
            _isValidRow(row) &&
            _isValidColumn(col)
        ) {
            const symbol = player === player1 ? 'x' : 
                           player === player2 ? 'o' :
                           undefined;

            if (Gameboard.placeMarker(row, col, symbol) === null) {
                return;
            }

            Gameboard.placeMarker(row, col, symbol);

            if (Gameboard.checkLineWin(symbol, row, col)) {
                player.incrementScore();
                Gameboard.reset();
                _resetTurn(previousRoundStarter);
                togglePreviousStarter();
                if (_isWinner(player)) {
                    winner = player;
                    return console.log(getWinner(), ' Won the game');
                }
                return;
            }

            _toggleTurn(); 
        } else {
            console.log('markCell() ERROR: One or more parameters are invalid values.')
        }
    }

    return { getBoard, getScoreToWin, getWinner, getPlayerInTurn, markCell };

};