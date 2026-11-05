
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

app.get('/api/games', async (req, res) => {
  try {
    const result = await pool.query('SELECT id_game AS id, name, genre FROM games ORDER BY id_game');
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка загрузки игр:', error.message);
    res.status(500).json({ success: false, message: 'Не удалось загрузить игры' });
  }
});

app.get('/api/services/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
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
      WHERE s.id_service = $1
      GROUP BY s.id_service, g.name, u.username
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Услуга не найдена' });
    }

    const service = {
      ...result.rows[0],
      image: '',
      categoryId: 0,
    };

    res.json(service);
  } catch (error) {
    console.error('Ошибка загрузки одной услуги:', error.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.get('/api/orders/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const query = `
      SELECT 
        o.id_order AS id,
        o.id_service AS "serviceId",
        o.price,
        o.order_date AS date,
        s.title,
        g.name AS game,
        os.name AS status
      FROM orders o
      JOIN services s ON s.id_service = o.id_service
      JOIN games g ON g.id_game = s.id_game
      JOIN order_statuses os ON os.id_status = o.id_status
      WHERE o.id_buyer = $1
      ORDER BY o.order_date DESC
    `;
    
    const result = await pool.query(query, [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка загрузки заказов:', error.message);
    res.status(500).json({ success: false, message: 'Не удалось загрузить заказы' });
  }
});

app.get('/api/users/:userId/profile', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const userResult = await pool.query(
      'SELECT id_user AS id, username, email, balance, avatar_path AS avatar FROM users WHERE id_user = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const user = userResult.rows[0];

    const ordersCountResult = await pool.query(
      'SELECT COUNT(*) FROM orders WHERE id_buyer = $1',
      [userId]
    );

    const favoritesCountResult = await pool.query(
      'SELECT COUNT(*) FROM favorites WHERE id_user = $1',
      [userId]
    );

    res.json({
      ...user,
      ordersCount: parseInt(ordersCountResult.rows[0].count, 10),
      favoritesCount: parseInt(favoritesCountResult.rows[0].count, 10),
    });
  } catch (error) {
    console.error('Ошибка загрузки профиля:', error.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Backend запущен: http://localhost:${PORT}`);
});