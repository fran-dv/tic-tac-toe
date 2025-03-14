const DEFAULT_NAMES = ['player one', 'player two'];
let firstClick = true;

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
    if (aSymbol !== 'x' && aSymbol !== 'o') {
        return console.log(`getSymbolUrl() ERROR: '${aSymbol}' is not a valid symbol. Valid options: 'x', 'o'`);
    }
    return getComputedStyle(document.documentElement).getPropertyValue(`--symbol-${aSymbol}`).trim()
}

const updatePlayersInfo = (Game) => {
    const players = Game.getPlayers();
    if (players.length === 2) {
        for (let i = 0; i < players.length; i++) {
            const playerNumber = i === 0 ? 'one' : 'two';
            const playerDivClass = `.player-section.${playerNumber}`;
            const nameH2 = document.querySelector(`${playerDivClass} > .name-section > .name`);
            nameH2.textContent = players[i].getName();
            const editNameButton = document.querySelector(`.player-section.${playerNumber} .edit`);
            if (nameH2.textContent.toLowerCase() === DEFAULT_NAMES[i]) {
                editNameButton.style.display = 'block';
            };
            const avatarImg = document.querySelector(`${playerDivClass} > .avatar`);
            avatarImg.src = getSymbolUrl(Game.Session.getSymbolOfPlayer(players[i]));
            const scoreCounter = document.querySelector(`${playerDivClass} > .score-section > .score`);
            scoreCounter.textContent = players[i].getScore();
        }
    } else {
        return console.log('displayPlayersInfo() ERROR: The function supports only two players');
    }
}

const updateTurnIndicator = (Game) => {
    const currentPlayerNumber = Game.Session.getCurrentPlayer() === Game.getPlayers()[1] ? 'two' : 'one';
    
    const otherPlayerNumber = currentPlayerNumber === 'one' ? 'two' : 'one';
    const currentPlayerDiv = document.querySelector(`.player-section.${currentPlayerNumber}`);
    const otherPlayerDiv = document.querySelector(`.player-section.${otherPlayerNumber}`);

    if (otherPlayerDiv.classList.contains('in-turn')){
        otherPlayerDiv.classList.remove('in-turn');
    }

    currentPlayerDiv.classList.add('in-turn');
} 

const initGame = (gameConfiguration) => {
    const aGame = newGame(gameConfiguration);
    displayBoard(aGame.getBoard());
    updatePlayersInfo(aGame);
    updateTurnIndicator(aGame);
    document.querySelector('.score-to-win').textContent = aGame.getScoreToWin();
    document.querySelector('.symbols-to-align').textContent = aGame.getBoard().getSymbolsToWin();
    return aGame;
}

// a Classic Tictactoe starts by default
let Game = initGame();

const setSymbolsStyle = (symbolStyle) => {
    const symbolStyles = ['default', 'genres', 'suits'];
    symbolStyle = symbolStyle.toLowerCase();
    const root = document.documentElement;
    if (symbolStyles.includes(symbolStyle)) {
        root.style.setProperty('--symbol-o', `images/o-${symbolStyle}.svg`);
        root.style.setProperty('--symbol-x', `images/x-${symbolStyle}.svg`);
    } else {
        return console.log(`setSymbolUrl() ERROR: '${symbolStyle}' is not a valid style. Valid options: ${symbolStyles.join(', ')}`);
    }
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

const randomInt = (max) => {
    return Math.floor(Math.random() * max);
}

const generateWinAnnouncement = (winner) => {
    const announcements = [
        `${winner} won the game!!`,
        `The competition is in therapy after ${winner}’s win.`,  
        `${winner}’s victory: quietly devastating.`,  
        `The board is writing about ${winner}’s win.`,  
        `${winner} made the game look like a tutorial.`,  
        `${winner}’s strategy? Exist. Profit.`,  
        `${winner} turned the game into a documentary.`,  
        `${winner}’s win: short and satisfying.`,   
        `${winner} gave the board a spicy makeover.`
    ];
    return announcements[randomInt(announcements.length)];
}

const getWinImgUrl = () => {
    const images = [
        'images/win-images/win-1.svg',
        'images/win-images/win-2.svg',
        'images/win-images/win-3.svg',
        'images/win-images/win-4.svg',
        'images/win-images/win-5.svg',
        'images/win-images/win-6.svg',
        'images/win-images/win-7.svg'
    ];
    return images[randomInt(images.length)];
}

const displayVictory = (Game) => {
    const winScreen = document.querySelector('#win-screen');
    const winAnnouncement = document.querySelector('.win-announcement');
    const winImg = document.querySelector('.win-img');
    winAnnouncement.textContent = generateWinAnnouncement(Game.getWinner().getName());
    winImg.src = getWinImgUrl();
    winScreen.show();
}

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
        updateTurnIndicator(Game);
        updatePlayersInfo(Game);
        if (Game.getWinner()) {
            displayVictory(Game);
        }
    }
}

const editName = (Game, input, nameH2, editButton) => {
    const playerIndex = input.dataset.player === 'one' ? 0 : 1;
    const otherPlayerIndex = (playerIndex + 1) % Game.getPlayers().length;
    if (input.value){
        if (input.value.toLowerCase() === Game.getPlayers()[otherPlayerIndex].getName().toLowerCase()){
            const playerSection = nameH2.parentElement.parentElement;
            const sameNameWarning = document.createElement('p');
            sameNameWarning.className = 'warning';
            sameNameWarning.textContent = 'The name is already in use';
            sameNameWarning.style.fontStyle = 'italic';
            playerSection.insertBefore(sameNameWarning, playerSection.firstChild);
            input.addEventListener('keydown', (key) => {
                sameNameWarning.remove();
            }, { once : true });
            return false;
        }
        Game.getPlayers()[playerIndex].setName(input.value);
        input.value = '';
        updatePlayersInfo(Game);
    }
    if (Game.getPlayers()[playerIndex].getName() === DEFAULT_NAMES[playerIndex]) {
        editButton.style.display = 'block';
    }
    input.style.display = 'none';
    nameH2.style.display = 'block';
    return true;
}

const listenForNameSubmit = (Game, input, nameH2, editButton) => {
    const controller = new AbortController();
    const submitName = (key = null, blur = false) => {
        if ((key !== null && key.code === 'Enter') || blur) {
            const success = editName(Game, input, nameH2, editButton);
            if (success) {
                controller.abort();
            }
        }
    }
    input.addEventListener('keydown', (key) => submitName(key), { signal : controller.signal });
    input.addEventListener('blur', () => submitName(null, true), { signal : controller.signal });
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
    listenForNameSubmit(Game, input, nameH2, editButton);
}

const toggleTheme = () => {
    const root = document.documentElement;
    root.className = root.className === 'theme-dark' ? 'theme-light' : 'theme-dark';
}

const pulseAnimation = (element, dialogToClose = null, modalToOpen = null) => {
    element.classList.add('pulse-animation');
    element.addEventListener('animationend', () => {
        element.classList.remove('pulse-animation');
        if (dialogToClose !== null) {
            dialogToClose.close();
        };
        if (modalToOpen !== null) {
            modalToOpen.showModal();
        };
    }, { once: true });
}

const clickOnNewGame = (button) => {
    const winScreen = document.querySelector('#win-screen');
    if (winScreen.open) {
        winScreen.close();
    }
    const mainMenu = document.querySelector('#main-menu');
    pulseAnimation(button, null, mainMenu);
}

const clickOnCounter = (arrow) => {
    const pointsInput = document.querySelector('.game-configuration #points');
    const pointsCounter = document.querySelector(`.${arrow.classList[0]} + p`);
    let pointsAmount = parseInt(pointsCounter.textContent);
    if (arrow.dataset.action === 'increment-counter' && pointsAmount < 10) {
        ++pointsAmount;
    } else if (arrow.dataset.action === 'decrement-counter' && pointsAmount > 1) {
        --pointsAmount;
    }
    pointsInput.value = pointsAmount;
    pointsCounter.textContent = pointsAmount;
    pulseAnimation(pointsCounter);
}

const clickOnRadio = (sizeRadio) => {
    pulseAnimation(sizeRadio.nextElementSibling);
}

const clickOnPlayInMenu = (button, Game) => {
    const config = new FormData(button.previousElementSibling);
    setSymbolsStyle(config.get('symbol'));
    const boardSize = parseInt(config.get('board-size'));
    const scoreToWin = parseInt(config.get('points'));
    Game = initGame(setGameConfig(newPlayer('player one'), newPlayer('player two'), newGameboard(boardSize), scoreToWin));
    pulseAnimation(button, document.querySelector('#main-menu'));
    return Game;
}

const clickOnPlayAgain = (button, Game) => {
    const [player1, player2] = Game.getPlayers();
    player1.resetScore();
    player2.resetScore(); 
    Game = initGame(setGameConfig(player1, player2, Game.getBoard(), Game.getScoreToWin()));
    pulseAnimation(button, document.querySelector('#win-screen'));
    return Game;
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
        case 'new-game':
            clickOnNewGame(target);
            break;
        case 'increment-counter':
            clickOnCounter(target);
            break;
        case 'decrement-counter':
            clickOnCounter(target);
            break;
        case 'set-board-size':
            clickOnRadio(target);
            break;
        case 'set-symbol':
            clickOnRadio(target);
            break;
        case 'start-new-game':
            Game = clickOnPlayInMenu(target, Game);
            break;
        case 'play-again':
            Game = clickOnPlayAgain(target, Game);
            break;
    }
});