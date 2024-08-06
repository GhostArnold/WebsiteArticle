import jwt from 'jsonwebtoken';

// Функция для проверки авторизации
export const checkAuth = (req, res, next) => {
  // Извлекаем токен из заголовков запроса, replace для того, чтобы убрать Bearer
  const token = (req.headers.authorization || '').replace(/Bearer/, '');

  if (token) {
    try {
      // Верифицируем токен с использованием секретного ключа из переменных окружения
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;
      next(); // Передаем управление следующей функции
    } catch (error) {
      console.error(error); // Логируем ошибку
      return res.json({
        message: 'Нет доступа',
      });
    }
  } else {
    res.json({
      message: 'Нет доступа',
    });
  }
};
