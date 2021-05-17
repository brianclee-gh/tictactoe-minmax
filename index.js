// Helpers

var scores = {
  X: -10,
  O: 10,
  tie: 0
}

// Handle turns

var updateScore = function(winner) {
  var scoreboard = document.getElementById('scoreboard');
  scoreboard.innerHTML = game.gameMode === 'single' ?
    `Player: ${game.score.X} | Computer: ${game.score.O}`
    : `Player 1: ${game.score.X} | Player 2: ${game.score.O}`;

  var result = document.getElementById('result');
  if (winner === 'tie') {
    result.innerHTML = 'Tie...'
  } else {
    result.innerHTML = `${winner} wins!`
  }
};

function equals3(a, b, c) {
  return a == b && b == c && a != '';
}

function checkWinner(board=game.board) {
  var winner = null;

  // horizontal
  for (var i = 0; i < 3; i++) {
    if (equals3(board[i][0], board[i][1], board[i][2])) {
      winner = board[i][0];
    }
  }

  // Vertical
  for (var i = 0; i < 3; i++) {
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

  var openSpots = 0;
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
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

var resetBoards = function() {
  var gamegrid = document.getElementById('gamegrid');
  var children = [...gamegrid.childNodes];

  children.forEach(function(node) {
    node.innerHTML = '';
  })

  game.board = [
    ['','',''],
    ['','',''],
    ['','','']
  ];

  var result = document.getElementById('result');
  result.innerHTML = '';

};

var selectGameMode = function(mode) {
  game.gameMode = mode;
  document.getElementById('gameSelect').classList.add('hidden');
  document.getElementById('gameboard').classList.remove('hidden');
  return;
};

var toggleNewBtn = function() {
  var btn = document.getElementById('newGameBtn');
  btn.classList.toggle('hidden');
};

var handleNewGame = function() {
  resetBoards();
  toggleNewBtn();
  game.gameActive = true;
};

var handleEndGame = function(winner) {
  if (winner === null) { return; }

  game.score[winner] += 1;
  updateScore(winner);
  toggleNewBtn();
  game.gameActive = false;
};


// Handle Player

var isValidMove = function(targetID) {

  var targetNode = document.getElementById(targetID);
  var x = parseInt(targetNode.dataset.x);
  var y = parseInt(targetNode.dataset.y);

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

var handleBoardClick = function(e) {
  if (!game.gameActive) { return; }
  if (!e.target.classList.contains('node')) { return; }
  if (!isValidMove(e.target.id)) { return; }

  if (game.gameMode === 'single') {
    computerRandomMove();
    // findBestMove();
  } else {
    game.currentPlayer = game.currentPlayer === 'X' ? 'O' : 'X';
  }

};

// Handle Computer (Minimax)

// Handle Computer (Random)

var randomNumber = function(min, max) {
  return Math.floor((Math.random() * (max - min + 1) - min));
}

var computerRandomMove = function() {
  if (!game.gameActive) { return; }
  var targetID = `node_${randomNumber(0, 8)}`;
  var nodeID = parseInt(targetID.slice(-1));
  var targetNode = document.getElementById(targetID);

  var x = parseInt(targetNode.dataset.x);
  var y = parseInt(targetNode.dataset.y);

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

var Tictactoe = class {
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
};

var populateBoard = function() {
  var gameboard = document.getElementById('gameboard');
  var gamegrid = document.createElement('div');
  gamegrid.id = 'gamegrid';

  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
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

var addListeners = function() {

  // grid
  var gamegrid = document.getElementById('gamegrid');
  gamegrid.addEventListener("click", function(e) {
    handleBoardClick(e);
  });

  // newGame
  var newGameBtn = document.getElementById('newGameBtn');
  newGameBtn.addEventListener("click", function() {
    handleNewGame();
  });

  // selectGame
  var gameSelect = document.getElementById('gameSelect');
  gameSelect.addEventListener("click", function(e) {
    if (e.target.classList.contains('selectBtn')) {
      selectGameMode(e.target.id);
    }
  });

};

populateBoard();
addListeners();
var game = new Tictactoe();