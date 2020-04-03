const router = require('express').Router();
const controller = require('./game');
const users = require('./lib/users');
const management = require('./lib/management');

router.get('/getField', users.restricted, (req, res) => {
  controller.setGame(req.userCredentials.gameId);
  res.status(200).send(controller.getField());
});

router.post('/move', users.restricted, (req, res) => {
  controller.setGame(req.userCredentials.gameId);
  controller.setUserId(req.userCredentials.id);
  if (controller.makeMove(req.body.x, req.body.y)) {
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

router.post('/login', (req, res) => {
  const userId = users.checkLogin(req.body.login, req.body.password);
  if (userId) {
    res.status(200).send(userId);
  } else {
    res.sendStatus(401);
  }
});

router.post('/register', (req, res) => {
  const isRegisterOk = users.register(req.body.login, req.body.password);
  if (isRegisterOk) {
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

router.post('/createNewGame', users.restricted, (req, res) => {
  const gameId = management.createNewGame(req.userCredentials.id);
  req.userCredentials.gameId = gameId;
  res.status(200).send(`${gameId}`);
});

router.get('/getExistingGames', users.restricted, (req, res) => {
  res.status(200).send(management.getExistingGames());
});

router.post('/joinGame', users.restricted, (req, res) => {
  const isJoinOk = management.joinGame(req.userCredentials.id, req.body.gameId);
  if (isJoinOk) {
    req.userCredentials.gameId = req.body.gameId;
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

module.exports = router;
