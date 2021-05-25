// Helpers

const scores = {
  X: -10,
  O: 10,
  tie: 0
};

const equals3 = (a, b, c) => {
  return a == b && b == c && a != '';
};

// Handle turns

const initialScore = () => {
  const scoreboard = document.getElementById('scoreboard');
  scoreboard.innerHTML = scoreboardText();
};

const updateTurn = () => {
  const result = document.getElementById('result');
  result.innerHTML = `It's ${game.currentPlayer}'s Turn`
};

const updateScore = (winner) => {
  const scoreboard = document.getElementById('scoreboard');
  scoreboard.innerHTML = scoreboardText();

  const result = document.getElementById('result');
  result.innerHTML = resultText(winner);
};

const scoreboardText = () => {
  if (game.gameMode === 'single') return `Player: ${game.score.X}
    | Computer: ${game.score.computer}`;

  return `Player X: ${game.score.X} | Player O: ${game.score.O}`;
};

const resultText = (winner) => {
  const text = '';

  if (winner === 'tie') return 'Tie...';

  if (game.gameMode === 'single') return winner === 'X' ?
    'Player wins!' : 'Computer wins...'

  return `${winner} wins!`;

};

const checkWinner = (board=game.board) => {
  let winner = null;

  // horizontal
  for (let i = 0; i < 3; i++) {
    if (equals3(board[i][0], board[i][1], board[i][2])) {
      winner = board[i][0];
    }
  }

  // Vertical
  for (let i = 0; i < 3; i++) {
    if (equals3(board[0][i], board[1][i], board[2][i])) {
      winner = board[0][i];
    }
  }

  // Diagonal
  if (equals3(board[0][0], board[1][1], board[2][2])) {
    winner = board[0][0];
  }
  if (equals3(board[2][0], board[1][1], board[0][2])) {
    winner = board[2][0];
  }

  let openSpots = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] == '') {
        openSpots++;
      }
    }
  }

  if (winner == null && openSpots == 0) {
    return 'tie';
  } else {
    return winner;
  }
}

// Handle new game

const resetBoards = () => {
  const gamegrid = document.getElementById('gamegrid');
  let children = [...gamegrid.childNodes];

  children.forEach(function(node) {
    node.innerHTML = '';
  })

  game.board = [
    ['','',''],
    ['','',''],
    ['','','']
  ];

  const result = document.getElementById('result');
  result.innerHTML = '';

};

const selectGameMode = (mode) => {
  const validModes = ['random', 'single', 'multiplayer'];
  if (!validModes.includes(mode)) return;
  game.gameMode = mode;
  document.getElementById('gameSelect').classList.add('hidden');
  document.getElementById('gameboard').classList.remove('hidden');
  initialScore();

  if (game.gameMode === 'multiplayer') updateTurn();
  return;
};

const toggleNewBtn = () => {
  const btn = document.getElementById('newGameBtn');
  btn.classList.toggle('hidden');
};

const handleNewGame = () => {
  resetBoards();
  toggleNewBtn();
  game.gameActive = true;
  game.currentPlayer = 'X';
  if (game.gameMode === 'multiplayer') updateTurn();
};

const handleEndGame = (winner) => {
  if (winner === null) { return; }
  if (game.gameMode === 'single' && winner === 'O') winner = 'computer';

  game.score[winner] += 1;
  updateScore(winner);
  toggleNewBtn();
  game.gameActive = false;
};


// Handle Player

const isValidMove = (targetID) => {

  const targetNode = document.getElementById(targetID);
  let x = parseInt(targetNode.dataset.x);
  let y = parseInt(targetNode.dataset.y);

  if (game.board[x][y] === '') {
    targetNode.innerHTML = game.currentPlayer;
    game.board[x][y] = game.currentPlayer;
    if (checkWinner() !== null) {
      handleEndGame(checkWinner());
    }
    return true;
  }
  return false;

};

const handleBoardClick = (e) => {
  if (!game.gameActive) { return; }
  if (!e.target.classList.contains('node')) { return; }
  if (!isValidMove(e.target.id)) { return; } // checks user move, updates UI

  if (game.gameMode === 'single') {
    // computerRandomMove();
    bestMove();
  } else if (game.gameMode === 'random') {
    computerRandomMove();
  } else {
    game.currentPlayer = game.currentPlayer === 'X' ? 'O' : 'X';
  }

  if (game.gameActive && game.gameMode === 'multiplayer') updateTurn();

};

// Handle Computer (Minimax)

const bestMove = () => {
  let bestScore = -Infinity;
  let move;
  const board = game.board;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      // Is the spot available?
      if (board[i][j] == '') {
        board[i][j] = 'O';
        let score = minimax(board, 0, false);
        board[i][j] = '';
        if (score > bestScore) {
          bestScore = score;
          move = [i, j];
        }
      }
    }
  }

  handleComputerMove(move[0], move[1]);
  handleEndGame(checkWinner());
  game.currentPlayer = 'X';
};

const handleComputerMove = (x, y) => {
  game.board[x][y] = 'O';
  const id = ((x * 3 )+ y);
  const targetID = `node_${id}`;
  const targetNode = document.getElementById(targetID);
  targetNode.innerHTML = 'O';
};


const minimax = (board, depth, isMaximizing) => {
  let result = checkWinner();

  if (result !== null) {
    return scores[result] - depth;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // Is the spot available?
        if (board[i][j] == '') {
          board[i][j] = 'O';
          let score = minimax(board, depth + 1, false);
          board[i][j] = '';
          bestScore = Math.max(score, bestScore);
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // Is the spot available?
        if (board[i][j] == '') {
          board[i][j] = 'X';
          let score = minimax(board, depth + 1, true);
          board[i][j] = '';
          bestScore = Math.min(score, bestScore);
        }
      }
    }
    return bestScore;
  }
}


// Handle Computer (Random)

const randomNumber = (min, max) => {
  return Math.floor((Math.random() * (max - min + 1) - min));
}

const computerRandomMove = () => {
  if (!game.gameActive) { return; }
  let targetID = `node_${randomNumber(0, 8)}`;
  const targetNode = document.getElementById(targetID);

  let x = parseInt(targetNode.dataset.x);
  let y = parseInt(targetNode.dataset.y);

  if (targetNode.innerHTML === '') {
    targetNode.innerHTML = 'O';
    game.board[x][y] = 'O';
    if (checkWinner() === 'O') {
      game.score.computer += 1;
      updateScore('O');
      toggleNewBtn();
      game.gameActive = false;
      return;
    }
  } else {
    computerRandomMove();
  }
};

// Initialize

const Tictactoe = class {
  constructor() {
    this.gameActive = true;
    this.currentPlayer = 'X';
    this.gameMode = '';
    this.score = {
      X: 0,
      O: 0,
      computer: 0,
      tie: 0
    };
    this.board = [
      ['','',''],
      ['','',''],
      ['','','']
    ]
  }

  getAvailableMoves = () => {
    let moves = [];

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.board[i][j] === '') {
          moves.push([i, j])
        }
      }
    }

    return moves;
  }
};

const populateBoard = () => {
  const gameboard = document.getElementById('gameboard');
  const gamegrid = document.createElement('div');
  gamegrid.id = 'gamegrid';

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      var node = document.createElement('div');
      node.id = `node_${(i * 3) + j}`;
      node.setAttribute('data-x', i);
      node.setAttribute('data-y', j);
      node.className = 'node';
      node.innerHTML = '';
      gamegrid.appendChild(node);
    }
  }

  gameboard.appendChild(gamegrid);

};

const addListeners = () => {

  // grid
  const gamegrid = document.getElementById('gamegrid');
  gamegrid.addEventListener("click", function(e) {
    handleBoardClick(e);
  });

  // newGame
  const newGameBtn = document.getElementById('newGameBtn');
  newGameBtn.addEventListener("click", function() {
    handleNewGame();
  });

  // selectGame
  const gameSelect = document.getElementById('gameSelect');
  gameSelect.addEventListener("click", function(e) {
    if (e.target.classList.contains('selectBtn')) {
      selectGameMode(e.target.id);
    }
  });

};

const initialize = () => {
  populateBoard();
  addListeners();
}

initialize();
const game = new Tictactoe();