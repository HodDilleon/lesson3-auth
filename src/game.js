const management = require('./lib/management');
const users = require('./lib/users');

let game = {};
let userId = 0; // ID игрока, который собирается делать ход

function setGame(gameId) {
  game = management.getGame(gameId);
}

function setUserId(newUserId) {
  userId = newUserId;
}

/**
 * Получить значение поля
 *
 * @return {number[][]}
 */
function getField() {
  return game.field;
}

/**
 * Делаем ход на поле. Если поле уже занято или игра завершена, то возвращаем false.
 * Если всё успешно, то меняем текущего игрока и возвращаем true
 *
 * @param {number} x номер столбца
 * @param {number} y номер строки
 * @return {boolean}
 */
function makeMove(x, y) {
  if (game.field[y - 1][x - 1] !== 0) return false;
  if (game.status.includes('Завершена')) return false;

  if (game.currentPlayer === 1 && game.player1 !== userId) return false;
  if (game.currentPlayer === 2 && game.player2 !== userId) return false;

  game.field[y - 1][x - 1] = game.currentPlayer;
  game.currentPlayer = (game.currentPlayer === 1 ? 2 : 1);

  const winner = getWinner();
  if (winner) {
    game.status = `Завершена. Выиграл игрок ${winner}`;
  }
  return true;
}

/**
 * Сбросить значение поля на пустое
 */
function reset() {
  game.field = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
}

/**
 * Устанавливает новое значение для поля
 *
 * @param {string} newField поле в формате 000|000|000
 */
function presetField(newField) {
  game.field = newField;
}

/**
 * Изменить номер игрока
 *
 * @param {number} i номер игрока
 */
function setCurrentPlayer(i) {
  game.currentPlayer = i;
}

/**
 * Проверить победил ли какой-то игрок. Если да, то возвращает его логин. В противном случае false
 *
 * @return { (number|false) }
 */
function getWinner() {
  let winner = 0;

  for (let i = 0; i < 3; i++) {
    // Проверяем вертикали
    if ((game.field[0][i] === game.field[1][i] && game.field[1][i] === game.field[2][i])
    && game.field[1][i] !== 0) winner = game.field[2][i];

    // Проверяем горизонтали
    if ((game.field[i][0] === game.field[i][1] && game.field[i][1] === game.field[i][2])
    && game.field[i][0] !== 0) winner = game.field[i][2];
  }

  // Проверяем 1-ую диагональ
  if ((game.field[0][0] === game.field[1][1] && game.field[1][1] === game.field[2][2])
  && game.field[1][1] !== 0) winner = game.field[1][1];

  // Проверяем 2-ую диагональ
  if ((game.field[2][0] === game.field[1][1] && game.field[1][1] === game.field[0][2])
  && game.field[1][1] !== 0) winner = game.field[1][1];

  if (winner === 1) {
    return users.getUser(game.player1).login;
  }

  if (winner === 2) {
    return users.getUser(game.player2).login;
  }

  return false;
}

module.exports = {
  getField,
  makeMove,
  reset,
  presetField,
  setCurrentPlayer,
  getWinner,
  setGame,
  setUserId,
};
