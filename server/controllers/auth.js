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
export const login = async (req, res) => {
  try {
    // Извлекаем username и password из тела запроса
    const { username, password } = req.body;

    // Находим пользователя в базе данных по username
    const user = await User.findOne({ username });

    // Если пользователь не найден, возвращаем сообщение об ошибке
    if (!user) {
      return res.json({
        message: 'Такого пользователя не существует',
      });
    }

    // Сравниваем введённый пароль с захешированным паролем в базе данных
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    // Если пароль неверный, возвращаем сообщение об ошибке
    if (!isPasswordCorrect) {
      return res.json({
        message: 'Неверный пароль',
      });
    }

    // Создаём JWT-токен с id пользователя, используя секретный ключ и задавая срок действия токена
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' } // Токен будет действовать 30 дней
    );

    // Возвращаем клиенту токен, данные пользователя и сообщение об успешном входе
    res.json({
      token,
      user,
      message: 'Вы вошли в систему',
    });
  } catch (error) {
    // Обрабатываем возможные ошибки
    console.error(error);
    res.json({
      message: 'При авторизации произошла ошибка',
    });
  }
};

// Функция получения информации о текущем пользователе
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.json({
        message: 'Такого юзера нет',
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' } // Токен будет действовать 30 дней
    );
    res.json({
      user,
      token,
    });
  } catch (error) {
    // Обрабатываем возможные ошибки
    console.error(error);
    res.status(500).json({
      message: 'Произошла ошибка при получении данных о пользователе',
    });
  }
};
