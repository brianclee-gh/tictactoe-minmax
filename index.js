// Helpers

var winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

var randomNumber = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Handling between turns

var updateScore = function() {
  var scoreboard = document.getElementById('scoreboard');
  scoreboard.innerHTML = `Player: ${game.score.player} | Computer: ${game.score.computer}`;
};

var checkWinner = function(board) {
  return winningCombos.some(function(combo) {
    return combo.every(function(val) {
      return board.indexOf(val) >= 0;
    })
  });
};

var checkTie = function() {
  if ((game.player.length + game.computer.length) >= 9) {
    return true;
  }
};

// Handling new games

var resetScores = function() {
  game.player = [];
  game.computer = [];
};

var resetBoard = function() {
  var gamegrid = document.getElementById('gamegrid');
  var children = [...gamegrid.childNodes];

  children.forEach(function(node) {
    node.innerHTML = '';
  })

};

var toggleNewBtn = function() {
  var btn = document.getElementById('newGameBtn');
  btn.classList.toggle('hidden');
};

var handleNewGame = function() {
  resetScores();
  resetBoard();
  toggleNewBtn();
  game.gameActive = true;
};

//Clicks

var handleMove = function(targetID, user, sign) {

  var targetNode = document.getElementById(targetID);
  var nodeID = parseInt(targetID.slice(-1));

  if (targetNode.innerHTML === '') {
    targetNode.innerHTML = sign;
    game[user].push(nodeID);
    if (checkWinner(game[user])) {
      game.score[user] += 1;
      updateScore();
      toggleNewBtn();
      game.gameActive = false;
      return;
    } else if (checkTie()) {
      console.log('tie');
      game.gameActive = false;
      toggleNewBtn();
    }
    return true;
  }

  return false;

};

var handleBoardClick = function(e) {
  if (!game.gameActive) { return; }
  if (!e.target.classList.contains('node')) { return; }
  var targetID = e.target.id;
  if (handleMove(targetID, 'player', 'X')) { computerMove(); }
};

// Handle Computer

var computerMove = function() {
  if (!game.gameActive) { return; }
  var targetID = `node_${randomNumber(0, 8)}`;
  var nodeID = parseInt(targetID.slice(-1));
  var target = document.getElementById(targetID);

  if (target.innerHTML === '') {
    target.innerHTML = 'O';
    game.computer.push(nodeID);
    if (checkWinner(game.computer)) {
      game.score.computer += 1;
      updateScore();
      toggleNewBtn();
      return;
    }
  } else {
    computerMove();
  }
};

// Initialize

var Tictactoe = class {
  constructor() {
    this.gameActive = true;
    this.player = [];
    this.computer = [];
    this.score = {
      player: 0,
      computer: 0
    }
  }
};

var populateBoard = function() {
  var gameboard = document.getElementById('gameboard');
  var gamegrid = document.createElement('div');
  gamegrid.id = 'gamegrid';

  for (var i = 0; i < 9; i++) {
    var node = document.createElement('div');
    node.id = `node_${i}`;
    node.className = 'node';
    node.innerHTML = '';
    gamegrid.appendChild(node);
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

};

populateBoard();
addListeners();
var game = new Tictactoe();