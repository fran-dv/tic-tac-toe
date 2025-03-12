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
            size % 2 === 0
        ) {
            console.log(`_validateBoardSize(): ${size} is an invalid size`);
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
            console.log(`placeMarker() ERROR: The cell in position [${row}, ${col}] does not exist`);
            return null;
        }
        
    }

    const getCellSymbol = (row, col) => {
        if (isValidCell(row, col)) {
            return board[row][col].getSymbol();
        } else {
            console.log(`getCellSymbol() ERROR: [row: ${row}, col: ${col}] is not a valid cell`)
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

    const isBoardEmpty = () => {
        for (let row = 0; row < _getRows(); row++) {
            for (let col = 0; col < _getCols(); col++) {
                if (!isCellEmpty(row, col)) {
                    return false;
                }
            }
        }
        return true;
    }

    const isBoardFull = () => {
        for (let row = 0; row < _getRows(); row++) {
            for (let col = 0; col < _getCols(); col++) {
                if (isCellEmpty(row, col)) {
                    return false;
                }
            }
        }
        return true;
    }
    

    return { 
        reset, 
        placeMarker, 
        getCellSymbol, 
        isCellEmpty, 
        getBoardSize, 
        checkLineWin, 
        isBoardEmpty, 
        isBoardFull 
    };
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
        Gameboard : newGameboard(3, 3),
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
    const players = [player1, player2];

    const getBoard = () => Gameboard;

    const getPlayers = () => players;

    const _isValidRow = (row) => {
        return row < Gameboard.getBoardSize();
    }

    const _isValidColumn = (col) => {
        return col < Gameboard.getBoardSize();
    }

    const getScoreToWin = () => scoreToWin;

    const getWinner = () => winner;

    const _isWinner = (player) => {
        return player.getScore() === getScoreToWin();
    }

    const newSession = () => {
        const symbols = ['x', 'o'];
        let currentRound = 1;
        let currentPlayer = null;
        let roundActive = false;
        let roundWinner = null;
        let tied = false;
        let firstTurnOfRound = true;

        const startNewRound = () => {
            currentPlayer = players[0];
            roundActive = true;
            roundWinner = null;
            tied = false;
            firstTurnOfRound = true;
        }

        const switchTurn = () => {
            currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
            firstTurnOfRound = false;
        }

        const endRound = (winner = null, isTied = false) => {
            roundActive = false;
            roundWinner = winner;
            tied = isTied;
            currentRound++;
        }

        const getCurrentRound = () => currentRound;
        const isRoundActive = () => roundActive;
        const isFirstTurnOfRound = () => firstTurnOfRound;
        const isTied = () => tied;
        const getCurrentPlayer = () => currentPlayer;
        const getSymbolOfPlayer = (aPlayer) => {
            return aPlayer === players[0] ? 'x' :
                   aPlayer === players[1] ? 'o' : 
                   null;
        };
        const getCurrentPlayerSymbol = () => {
            return getSymbolOfPlayer(getCurrentPlayer());
        };
        const getRoundWinner = () => roundWinner;

        return { 
            startNewRound,
            switchTurn,
            endRound,
            getCurrentRound,
            isRoundActive,
            isFirstTurnOfRound,
            isTied,
            getCurrentPlayer,
            getRoundWinner,
            getSymbolOfPlayer,
            getCurrentPlayerSymbol
        };
        
    };

    const Session = newSession(); 
    
    const markCell = (row, col) => {

        if (!Session.isRoundActive() && !getWinner()) {
            Session.startNewRound();
        }

        if (Session.isRoundActive()) {
            const symbol = Session.getCurrentPlayerSymbol();
            const player = Session.getCurrentPlayer();
            const placeMarked = Gameboard.placeMarker(row, col, symbol);

            if (placeMarked !== null) { // cell was succesfully marked
                if (Gameboard.checkLineWin(symbol, row, col)) {
                    Session.endRound(player);
                    player.incrementScore();
                    Gameboard.reset();
                    if (_isWinner(player)){
                        winner = player;
                    }
                } else if (Gameboard.isBoardFull()) {
                    Session.endRound(null, true);
                    Gameboard.reset();
                }
            }
        } else {
            console.log('markCell() ERROR: round was not started');
        }
    }

    
    return { getBoard, getPlayers, getScoreToWin, getWinner, Session, markCell };

};