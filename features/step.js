const { Given, Then } = require('cucumber');
const assert = require('assert');
const request = require('supertest');

const controller = require('../src/game');
const app = require('../src/server');
const users = require('../src/lib/users');

/* =====================================================
                      move.feature
===================================================== */

let lastResult = {};

Given('пустое поле', () => {
  controller.reset();
});

Given('ходит игрок {int}', (i) => {
  controller.setCurrentPlayer(i);
});

Given('игрок ходит в клетку {int}, {int}', (x, y) => {
  return request(app)
    .post('/move')
    .send({ x, y })
    .then((res) => {
      lastResult = res;
    });
});

Then('поле становится {string}', (string) => {
  return request(app)
    .get('/getField')
    .then((res) => {
      // преобразуем массив в формат строки
      const stringFormat = JSON.parse(res.text)
        .map((el) => el.join(''))
        .join('|');
      assert.equal(stringFormat, string);
    });
});

Given('поле {string}', (string) => {
  // преобразуем строку в формат массива. Окончательные значения должны быть в числовом формате
  const arrFormat = string
    .split('|')
    .map((el) => el
      .split('')
      .map((elem) => +elem)
    );
  controller.presetField(arrFormat);
});

Then('возвращается ошибка', () => {
  if (lastResult.status !== 400) throw new Error('Ошибка не возвращается!');
});

Then('победил игрок {int}', (int) => {
  assert.equal(controller.getWinner(), int);
});

/* =====================================================
                      auth.feature
===================================================== */

let registerLastResult = {};
let loginLastResult = {};

Given('зарегистрированных игроков в игре нет', () => {
  users.reset();
});

Given('регистрируется игрок с логином {string} и паролем {string}', (login, password) => {
  return request(app)
    .post('/register')
    .send({ login, password })
    .then((res) => {
      registerLastResult = res;
    });
});

Then('количество зарегистрированных игроков {int}', (int) => {
  assert.equal(users.getUsersCount(), int);
});


Then('в списке зарегистрированных игроков есть {string}', (login) => {
  assert.equal(users.isUserExists(login), true);
});

Then('возвращается ошибка при добавлении пользователя', () => {
  if (registerLastResult.status === 200) throw new Error('Ошибка не возвращается!');
});

Given('авторизация игрока с логином {string} и паролем {string}', (login, password) => {
  return request(app)
    .post('/login')
    .send({ login, password })
    .then((res) => {
      loginLastResult = res;
    });
});

Then('авторизация завершается ошибкой', () => {
  if (loginLastResult.status === 200) throw new Error('Ошибка не возвращается!');
});

Then('авторизация проходит успешно', () => {
  if (loginLastResult.status !== 200) throw new Error('Авторизация завершилась с ошибкой!');
});
