const express = require('express');
const mysql = require('mysql');

const app = express();
app.use(express.json()); // Додайте цей рядок для обробки JSON-даних

const db = mysql.createConnection({
  host: '185.74.252.17',
  user: 'jukbq211',
  password: 'dkfllfyz0401',
  database: 'jukbq211_monoSushi'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to database');
});

// Додайте маршрут для реєстрації нового користувача
app.post('/signup', (req, res) => {
  const userData = req.body; // Дані користувача з Angular форми
  const sql = 'INSERT INTO users SET ?';
  db.query(sql, userData, (err, result) => {
    if (err) throw err;
    console.log('New user has been added to the database');
    res.send('New user has been added to the database');
  });
});

// Встановіть сервер, щоб він прослуховував певний порт
const PORT = 3000; // Ви можете вибрати будь-який вільний порт
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
