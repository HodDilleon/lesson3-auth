const games = [];

function createNewGame(userId) {
  // Находим максимальный id и увеличиваем его на 1
  let maxId = 0;
  games.forEach((el) => {
    if (el.id > maxId) {
      maxId = el.id;
    }
  });
  maxId += 1;

  games.push({
    id: maxId,
    player1: userId,
    player2: null,
    field: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
    currentPlayer: 1,
    status: 'В процессе',
  });

  return maxId;
}

function getExistingGames() {
  return games;
}

function joinGame(userId, gameId) {
  const game = games.find((el) => el.id === gameId);

  if (game.player2) return false;

  game.player2 = userId;
  return true;
}

function getGame(gameId) {
  return games.find((el) => el.id === gameId);
}

module.exports = {
  createNewGame,
  getExistingGames,
  joinGame,
  getGame,
};
