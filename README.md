Для запуска сервера на 2000 порту
```
npm start
```
Для прохождения тестов
```
npm test
```
Для тестирования программы в Postman лучше придерживаться следующего алгоритма:

Регистрация двух пользователей (или использование двух встроенных пользователей):<br />
http://localhost:2000/register<br />
POST-запрос с параметрами { login, password }

Авторизация двух пользователей с получением различных заголовков Authorization:<br />
http://localhost:2000/login<br />
POST-запрос с параметрами { login, password }

Создание новой игры первым игроком:<br />
http://localhost:2000/createNewGame<br />
POST-запрос

Просмотрет текущих игр вторым игроком:<br />
http://localhost:2000/getExistingGames<br />
GET-запрос

Присоединение к игре вторым игроком:<br />
http://localhost:2000/joinGame<br />
POST-запрос с параметром { gameId }

Выполнение хода по очереди от имени разных игроков <br />
http://localhost:2000/move<br />
POST-запрос с параметрами { x, y }

Просмотр поля<br />
http://localhost:2000/getField<br />
GET-запрос
