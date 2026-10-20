import express from 'express';
import cors from 'cors';
// ... другие импорты

const app = express(); // <--- Вот она, переменная app

app.use(cors());
app.use(express.json());

// 👇 ВСТАВЛЯЙ СВОЙ КОД ГДЕ-ТО ЗДЕСЬ 👇
app.use('/api', (req, res, next) => {
  res.set('X-Robots-Tag', 'noindex, nofollow');
  next();
});
// 👆 КОНЕЦ ВСТАВКИ 👆

// Подключение твоих роутов
// app.use('/api/auth', authRouter);
// app.use('/api/games', gamesRouter);
// ...

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});