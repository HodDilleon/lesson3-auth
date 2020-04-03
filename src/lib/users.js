const uuid = require('uuid');
const logger = require('./logger');

let users = [
  {
    id: 1,
    login: 'max',
    password: 'qwerty',
  },
  {
    id: 2,
    login: 'ivan',
    password: 'ytrewq',
  },
];

const sessions = {};

function authMiddleware(req, res, next) {
  logger.log('auth middleware running');
  const userData = checkSession(req.headers.authorization);
  req.userCredentials = userData;
  next();
}

function restricted(req, res, next) {
  if (!req.userCredentials) {
    res.sendStatus(401);
    return;
  }

  next();
}

function checkLogin(login, password) {
  const user = users.find((el) => el.login === login && el.password === password);

  if (user) {
    const sessionId = uuid.v4();
    sessions[sessionId] = {
      id: user.id,
    };

    return sessionId;
  }

  return false;
}

function checkSession(sessionId) {
  return sessions[sessionId];
}

function register(login, pass) {
  // Проверяем есть ли такой пользователь
  const user = users.find((el) => el.login === login);
  if (user) return false;

  // Находим максимальный id и увеличиваем его на 1
  let maxId = 0;
  users.forEach((el) => {
    if (el.id > maxId) {
      maxId = el.id;
    }
  });
  maxId += 1;

  // Добавляем нового пользователя
  users.push({
    id: maxId,
    login,
    password: pass,
  });

  return true;
}

function getUser(userId) {
  return users.find((el) => el.id === userId);
}

function getUsersCount() {
  return users.length;
}

function isUserExists(login) {
  return !!users.find((el) => el.login === login);
}

function reset() {
  users = [];
}

module.exports = {
  checkLogin,
  checkSession,
  authMiddleware,
  restricted,
  register,
  getUser,
  getUsersCount,
  isUserExists,
  reset,
};
