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
        cell.setAttribute('data-action', 'mark-cell');
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

const getSymbolUrl = (aSymbol) => {
    return getComputedStyle(document.documentElement).getPropertyValue(`--symbol-${aSymbol}`).trim()
}

const createSymbol = (aSymbol) => {
    aSymbol = String(aSymbol);
    if (aSymbol === 'x' || aSymbol === 'o') {
        const symbolImg = document.createElement('img');
        symbolImg.className = 'symbol';    
        symbolImg.src = getSymbolUrl(aSymbol);
        return symbolImg;
    } else {
        console.log(`createSymbol() ERROR: ${aSymbol} is not valid. (only 'x' or 'o' are allowed)`);
        return null;
    }
}

const updatePlayersInfo = (Game) => {
    const players = Game.getPlayers();
    if (players.length === 2) {
        for (let i = 0; i < players.length; i++) {
            const playerNumber = i === 0 ? 'one' : 'two';
            const playerDivClass = `.player-section.${playerNumber}`;
            const nameH2 = document.querySelector(`${playerDivClass} > .name-section > .name`);
            nameH2.textContent = players[i].getName();
            const avatarImg = document.querySelector(`${playerDivClass} > .avatar`);
            avatarImg.src = getSymbolUrl(Game.Session.getSymbolOfPlayer(players[i]));
            const scoreCounter = document.querySelector(`${playerDivClass} > .score-section > .score`);
            scoreCounter.textContent = players[i].getScore();
        }
    } else {
        return console.log('displayPlayersInfo() ERROR: The function supports only two players');
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
        updatePlayersInfo(Game);

        if (Game.getWinner()) {
            displayVictory(Game);
        }
    }
}

const editName = (Game, input, nameH2, editButton) => {
    const playerIndex = input.dataset.player === 'one' ? 0 : 1;
    if (input.value){
        Game.getPlayers()[playerIndex].setName(input.value);
        updatePlayersInfo(Game);
    } else {
        editButton.style.display = 'block'
    }
    input.style.display = 'none';
    nameH2.style.display = 'block';
}

const clickOnEditName = (buttonOrH2, Game) => {
    const playerNumber = buttonOrH2.dataset.player;
    const nameH2 = document.querySelector(`.player-section.${playerNumber} .name`);
    const input = document.querySelector(`.player-section.${playerNumber} .new-name`);
    const editButton = document.querySelector(`.player-section.${playerNumber} .edit`);
    editButton.style.display = 'none';
    nameH2.style.display = 'none';
    input.style.display = 'block';
    input.focus();

    if (input.dataset.listeners === 'false') {
        input.addEventListener('keydown', (key) => {
            if (input.style.display !== 'none' && key.code === 'Enter') {
                editName(Game, input, nameH2, editButton);
            }
        })
        input.addEventListener('blur', () => {
            editName(Game, input, nameH2, editButton);
        })
        input.dataset.listeners = 'true';
    }
}

// a Classic Tictactoe starts by default
let Game = (function (gameConfiguration){
    const defaultGame = newGame(gameConfiguration);
    displayBoard(defaultGame.getBoard());
    updatePlayersInfo(defaultGame);
    return defaultGame;
})();

const toggleTheme = () => {
    const root = document.documentElement;
    root.className = root.className === 'theme-dark' ? 'theme-light' : 'theme-dark';
}

// general event listener
document.querySelector('body').addEventListener('click', (event) => {
    const target = event.target.closest('[data-action]');
    if (target === null) { return };
    switch (target.dataset.action) {
        case 'toggle-theme':
            toggleTheme();
            break;
        case 'mark-cell':
            clickOnCell(target, Game);
            break;
        case 'edit-name':
            clickOnEditName(target, Game);
            break;
    }
})

