// Импорт модели пользователя
import User from '../models/User.js';

// Пакет для шифрования паролей
import bcrypt from 'bcryptjs';

// Импортируем токен
import jwt from 'jsonwebtoken';

// Функция регистрации пользователя
export const register = async (req, res) => {
  try {
    // Получаем username и password из тела запроса (данные, отправленные клиентом)
    const { username, password } = req.body;

    // Проверяем, существует ли уже пользователь с таким username
    const isUsed = await User.findOne({ username });

    if (isUsed) {
      // Если пользователь с таким username уже существует, возвращаем соответствующую ошибку
      return res.status(402).json({
        message: 'Данный username уже занят ёпта',
      });
    }

    // Генерируем salt для шифрования пароля
    const salt = bcrypt.genSaltSync(10);

    // Хэшируем (шифруем) пароль с использованием сгенерированного salt
    const hash = bcrypt.hashSync(password, salt);

    // Создаем новую запись пользователя в базе данных, включая зашифрованный пароль
    const newUser = new User({
      username,
      password: hash,
    });

    // Сохраняем нового пользователя в базе данных
    await newUser.save();

    // Возвращаем успешный ответ с информацией о новом пользователе
    res.json({
      newUser,
      message: 'Регистрация прошла успешно',
    });
  } catch (error) {
    // В случае ошибки логируем её и возвращаем сообщение об ошибке
    console.error(error);
    res.json({ message: 'Ошибка при создании пользователя' });
  }
};

// Экспортируем асинхронную функцию login
export const login = async (req, res) => {};

// Функция получения информации о текущем пользователе
export const getMe = async (req, res) => {
  try {
    // Логика получения информации о текущем пользователе будет реализована здесь
  } catch (error) {
    // Обрабатываем возможные ошибки
  }
};
