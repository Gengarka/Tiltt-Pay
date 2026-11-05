
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); 

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend работает' });
});

app.get('/api/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT current_database() AS db_name');
    
    res.json({
      success: true,
      message: 'Подключение к PostgreSQL успешно!',
      database: result.rows[0].db_name,
    });
  } catch (error) {
    console.error('Ошибка подключения к БД:', error.message);
    res.status(500).json({
      success: false,
      message: 'Не удалось подключиться к базе данных',
      error: error.message,
    });
  }
});

app.get('/api/services', async (req, res) => {
  try {
    const query = `
      SELECT
        s.id_service AS id,
        s.title,
        s.description,
        s.price,
        s.id_game AS "gameId",
        s.id_seller AS "sellerId",
        s.category,
        g.name AS "gameName",
        u.username AS "sellerName",
        COALESCE(AVG(r.rating), 0) AS rating,
        COUNT(r.id_review) AS "reviewsCount"
      FROM services s
      LEFT JOIN games g ON g.id_game = s.id_game
      LEFT JOIN users u ON u.id_user = s.id_seller
      LEFT JOIN reviews r ON r.id_seller = s.id_seller
      WHERE s.status = 'active'
      GROUP BY s.id_service, g.name, u.username
      ORDER BY s.id_service;
    `;

    const result = await pool.query(query);

    // Добавляем заглушки для картинок, так как их нет в базе
    const services = result.rows.map((service) => ({
      ...service,
      image: '',
      categoryId: 0,
    }));

    res.json(services);
  } catch (error) {
    console.error('Ошибка загрузки услуг:', error.message);
    res.status(500).json({
      success: false,
      message: 'Не удалось загрузить услуги',
    });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Backend запущен: http://localhost:${PORT}`);
});