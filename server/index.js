import express from 'express';
// Импорт библиотеки для взаимодейсвтия с базой данных
import mongoose from 'mongoose';
// Импорт пакета для env переменных
import dotenv from 'dotenv';
// Для устранения конфликтов между разными доменами
import cors from 'cors';

const app = express();
// Загрузка env переменных из .env файла
dotenv.config();

// Contstants
const PORT = parseInt(process.env.PORT) || 3001; // ППорт из .env или 3001

// Middleware
// Можем отправлять запросы к бэкэнду с разных айпи адресов и доменов
app.use(cors());
//  Эта строка подключает middleware, который позволяет вашему приложению обрабатывать JSON-формат запросов.
app.use(express.json());

app.get('/', (req, res) => {
  // Выводим json строку
  return res.json({ message: 'All is fine' });
});

// Так как все операции с базой данных являются ассинхронными
async function start() {
  try {
    // Подключаемся к базе данных
    await mongoose.connect('mongodb://localhost:27017/articleWebsite');
    // Запускаем сервер
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
}
start();
