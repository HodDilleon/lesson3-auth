const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const users = require('./lib/users');

const app = express();

app.use(express.json()); // чтобы появилось req.body
app.use(cors());
app.use(users.authMiddleware);
app.use(routes);

module.exports = app;
