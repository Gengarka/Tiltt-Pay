require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); 
const crypto = require('crypto');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend работает' });
});

app.get('/api/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT current_database() AS db_name');
    res.json({ success: true, message: 'Подключение к PostgreSQL успешно!', database: result.rows[0].db_name });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Ошибка БД', error: error.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: 'Заполните все поля' });

    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) return res.status(400).json({ error: 'Пользователь уже существует' });

    const hashedPassword = hashPassword(password);
    const roleId = 3; 

    const newUser = await pool.query(
      `INSERT INTO users (id_role, login, password, email, username, balance) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id_user AS id, username, email, balance, (SELECT name FROM roles WHERE id_role = $1) AS role`,
      [roleId, email, hashedPassword, email, username, 0]
    );
    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка регистрации' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Введите email и пароль' });

    const hashedPassword = hashPassword(password);
    const result = await pool.query(
      `SELECT u.id_user AS id, u.username, u.email, u.balance, u.avatar_path AS avatar, u.bio, r.name AS role 
       FROM users u 
       JOIN roles r ON r.id_role = u.id_role 
       WHERE u.email = $1 AND u.password = $2`,
      [email, hashedPassword]
    );

    if (result.rows.length === 0) return res.status(401).json({ error: 'Неверный email или пароль' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка входа' });
  }
});

app.get('/api/users/:userId/profile', async (req, res) => {
  try {
    const { userId } = req.params;
        const userResult = await pool.query(
      'SELECT id_user AS id, username, email, balance, avatar_path AS avatar, bio FROM users WHERE id_user = $1',
      [userId]
    );
    if (userResult.rows.length === 0) return res.status(404).json({ error: 'Пользователь не найден' });

    const user = userResult.rows[0];
    const ordersCountResult = await pool.query('SELECT COUNT(*) FROM orders WHERE id_buyer = $1', [userId]);
    const favoritesCountResult = await pool.query('SELECT COUNT(*) FROM favorites WHERE id_user = $1', [userId]);

    res.json({
      ...user,
      ordersCount: parseInt(ordersCountResult.rows[0].count, 10),
      favoritesCount: parseInt(favoritesCountResult.rows[0].count, 10),
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.put('/api/users/:userId/profile', async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, email, newPassword, bio, avatar } = req.body;

    if (!username || !email) return res.status(400).json({ error: 'Имя и email обязательны' });

    let query = 'UPDATE users SET username = $1, email = $2, bio = $3, avatar_path = $4';
    let values = [username, email, bio || null, avatar || null];

    if (newPassword && newPassword.trim() !== '') {
      if (newPassword.length < 6) return res.status(400).json({ error: 'Пароль слишком короткий' });
      const hashedPassword = hashPassword(newPassword);
      query += ', password = $5 WHERE id_user = $6';
      values.push(hashedPassword, userId);
    } else {
      query += ' WHERE id_user = $5';
      values.push(userId);
    }

    query += ' RETURNING id_user AS id, username, email, balance, avatar_path AS avatar, bio, (SELECT name FROM roles WHERE id_role = users.id_role) AS role';

    const result = await pool.query(query, values);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Пользователь не найден' });

    res.json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') return res.status(400).json({ error: 'Этот email уже занят' });
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.post('/api/users/:userId/deposit', async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount } = req.body;
    const numAmount = Number(amount);
    
    if (isNaN(numAmount) || numAmount < 100 || numAmount > 69000) {
      return res.status(400).json({ error: 'Сумма должна быть от 100 до 69 000 рублей' });
    }

    const result = await pool.query(
      'UPDATE users SET balance = balance + $1 WHERE id_user = $2 RETURNING balance',
      [numAmount, userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Пользователь не найден' });

    await pool.query(
      `INSERT INTO payments (id_user, amount, id_payment_method, status) VALUES ($1, $2, 1, 'paid')`,
      [userId, numAmount]
    );
    res.json({ newBalance: result.rows[0].balance });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.get('/api/users/:userId/payments', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      `SELECT p.id_payment AS id, p.amount, p.payment_date AS date, p.status, pm.name AS payment_method, s.title AS service_title
       FROM payments p
       LEFT JOIN orders o ON o.id_order = p.id_order
       LEFT JOIN services s ON s.id_service = o.id_service
       LEFT JOIN payment_methods pm ON pm.id_payment_method = p.id_payment_method
       WHERE p.id_user = $1 ORDER BY p.payment_date DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.get('/api/users/:userId/favorites', async (req, res) => {
  try {
    const { userId } = req.params;
    const query = `
      SELECT s.id_service AS id, s.title, s.description, s.price, s.id_game AS "gameId", s.id_seller AS "sellerId", 
             s.category, s.image_url AS image, g.name AS "gameName", u.username AS "sellerName",
             COALESCE(AVG(r.rating), 0) AS rating, COUNT(r.id_review) AS "reviewsCount"
      FROM favorites f
      JOIN services s ON s.id_service = f.id_service
      LEFT JOIN games g ON g.id_game = s.id_game
      LEFT JOIN users u ON u.id_user = s.id_seller
      LEFT JOIN reviews r ON r.id_seller = s.id_seller
      WHERE f.id_user = $1
      GROUP BY s.id_service, g.name, u.username, s.image_url
    `;
    const result = await pool.query(query, [userId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.post('/api/users/:userId/favorites', async (req, res) => {
  try {
    const { userId } = req.params;
    const { serviceId } = req.body;

    if (!serviceId) return res.status(400).json({ error: 'Не указан ID услуги' });

    const existing = await pool.query(
      'SELECT * FROM favorites WHERE id_user = $1 AND id_service = $2',
      [userId, serviceId]
    );

    if (existing.rows.length === 0) {
      await pool.query(
        'INSERT INTO favorites (id_user, id_service) VALUES ($1, $2)',
        [userId, serviceId]
      );
    }

    res.json({ message: 'Добавлено в избранное' });
  } catch (error) {
    console.error('Ошибка добавления в избранное:', error.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.delete('/api/users/:userId/favorites/:serviceId', async (req, res) => {
  try {
    const { userId, serviceId } = req.params;
    await pool.query('DELETE FROM favorites WHERE id_user = $1 AND id_service = $2', [userId, serviceId]);
    res.json({ message: 'Удалено' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка' });
  }
});

app.get('/api/games', async (req, res) => {
  try {
    const result = await pool.query('SELECT id_game AS id, name, genre FROM games ORDER BY id_game');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка загрузки игр' });
  }
});

app.get('/api/services/my/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const query = `
      SELECT s.id_service AS id, s.title, s.description, s.price, s.category, s.status, s.image_url AS image, g.name AS "gameName"
      FROM services s
      LEFT JOIN games g ON g.id_game = s.id_game
      WHERE s.id_seller = $1
      ORDER BY s.id_service DESC
    `;
    const result = await pool.query(query, [userId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка загрузки моих услуг' });
  }
});

app.get('/api/services', async (req, res) => {
  try {
    const query = `
      SELECT s.id_service AS id, s.title, s.description, s.price, s.id_game AS "gameId", s.id_seller AS "sellerId", 
             s.category, s.image_url AS image, g.name AS "gameName", u.username AS "sellerName",
             COALESCE(AVG(r.rating), 0) AS rating, COUNT(r.id_review) AS "reviewsCount"
      FROM services s
      LEFT JOIN games g ON g.id_game = s.id_game
      LEFT JOIN users u ON u.id_user = s.id_seller
      LEFT JOIN reviews r ON r.id_seller = s.id_seller
      WHERE s.status = 'active'
      GROUP BY s.id_service, g.name, u.username, s.image_url
      ORDER BY s.id_service;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка загрузки услуг' });
  }
});

app.get('/api/services/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT s.id_service AS id, s.title, s.description, s.price, s.id_game AS "gameId", s.id_seller AS "sellerId", 
             s.category, s.image_url AS image, g.name AS "gameName", u.username AS "sellerName",
             COALESCE(AVG(r.rating), 0) AS rating, COUNT(r.id_review) AS "reviewsCount"
      FROM services s
      LEFT JOIN games g ON g.id_game = s.id_game
      LEFT JOIN users u ON u.id_user = s.id_seller
      LEFT JOIN reviews r ON r.id_seller = s.id_seller
      WHERE s.id_service = $1
      GROUP BY s.id_service, g.name, u.username, s.image_url
    `;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Услуга не найдена' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.post('/api/services', async (req, res) => {
  try {
    const { sellerId, title, description, price, category, gameName, image } = req.body;
    const gameResult = await pool.query('SELECT id_game FROM games WHERE name = $1', [gameName]);
    if (gameResult.rows.length === 0) return res.status(400).json({ error: 'Игра не найдена' });
    
    const gameId = gameResult.rows[0].id_game;
    const newService = await pool.query(
      `INSERT INTO services (id_seller, id_game, title, description, price, category, status, image_url) 
       VALUES ($1, $2, $3, $4, $5, $6, 'active', $7) RETURNING id_service`,
      [sellerId, gameId, title, description, price, category, image || null] 
    );
    res.status(201).json({ message: 'Услуга создана', serviceId: newService.rows[0].id_service });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при создании услуги' });
  }
});

app.put('/api/services/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, category, gameName, image } = req.body;

    const gameResult = await pool.query('SELECT id_game FROM games WHERE name = $1', [gameName]);
    if (gameResult.rows.length === 0) return res.status(400).json({ error: 'Игра не найдена' });
    const gameId = gameResult.rows[0].id_game;

    const result = await pool.query(
      `UPDATE services 
       SET title = $1, description = $2, price = $3, category = $4, id_game = $5, image_url = $6 
       WHERE id_service = $7 RETURNING id_service`,
      [title, description, price, category, gameId, image || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Услуга не найдена' });
    }

    res.json({ message: 'Услуга успешно обновлена' });
  } catch (error) {
    console.error('Ошибка обновления услуги:', error.message);
    res.status(500).json({ error: 'Ошибка сервера при обновлении' });
  }
});

app.delete('/api/services/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM services WHERE id_service = $1', [id]);
    res.json({ message: 'Услуга удалена' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при удалении' });
  }
});

app.get('/api/orders/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    await pool.query(`
      UPDATE orders 
      SET id_status = 4 
      WHERE id_buyer = $1 
        AND id_status IN (1, 2) 
        AND order_date < NOW() - INTERVAL '5 minutes'
    `, [userId]);

    const query = `
      SELECT o.id_order AS id, o.id_service AS "serviceId", o.price, o.order_date AS date, 
             s.title, g.name AS game, os.name AS status
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
    console.error(error);
    res.status(500).json({ error: 'Ошибка загрузки заказов' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { userId, serviceId, price } = req.body;
    const serviceResult = await pool.query('SELECT id_seller FROM services WHERE id_service = $1', [serviceId]);
    if (serviceResult.rows.length === 0) return res.status(404).json({ error: 'Услуга не найдена' });
    
    const sellerId = serviceResult.rows[0].id_seller;
    if (userId === sellerId) return res.status(400).json({ error: 'Вы не можете купить свою же услугу' });

    const userResult = await pool.query('SELECT balance FROM users WHERE id_user = $1', [userId]);
    if (Number(userResult.rows[0].balance) < price) return res.status(400).json({ error: 'Недостаточно средств' });

    await pool.query('UPDATE users SET balance = balance - $1 WHERE id_user = $2', [price, userId]);
    const newOrder = await pool.query(
      `INSERT INTO orders (id_buyer, id_seller, id_service, id_status, price) VALUES ($1, $2, $3, 1, $4) RETURNING id_order`,
      [userId, sellerId, serviceId, price]
    );
    
    await pool.query(
      `INSERT INTO payments (id_order, id_user, amount, id_payment_method, status) VALUES ($1, $2, $3, 2, 'paid')`, 
      [newOrder.rows[0].id_order, userId, price]
    );

    res.status(201).json({ message: 'Заказ создан', orderId: newOrder.rows[0].id_order });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.get('/api/admin/users', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id_user AS id, u.username, u.email, u.balance, r.name AS role 
       FROM users u 
       JOIN roles r ON r.id_role = u.id_role 
       ORDER BY u.id_user`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка загрузки пользователей' });
  }
});

app.get('/api/admin/services', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.id_service AS id, s.title, s.price, s.status, u.username AS "sellerName"
       FROM services s
       JOIN users u ON u.id_user = s.id_seller
       ORDER BY s.id_service DESC`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка загрузки услуг' });
  }
});

app.delete('/api/admin/services/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(`DELETE FROM disputes WHERE id_order IN (SELECT id_order FROM orders WHERE id_service = $1)`, [id]);
    
    await pool.query(`DELETE FROM messages WHERE id_order IN (SELECT id_order FROM orders WHERE id_service = $1)`, [id]);
    
    await pool.query(`DELETE FROM chats WHERE id_order IN (SELECT id_order FROM orders WHERE id_service = $1)`, [id]);
    
    await pool.query(`DELETE FROM reviews WHERE id_order IN (SELECT id_order FROM orders WHERE id_service = $1)`, [id]);
    
    await pool.query(`DELETE FROM order_status_history WHERE id_order IN (SELECT id_order FROM orders WHERE id_service = $1)`, [id]);
    
    await pool.query(`DELETE FROM payments WHERE id_order IN (SELECT id_order FROM orders WHERE id_service = $1)`, [id]);
    
    await pool.query('DELETE FROM orders WHERE id_service = $1', [id]);
    
    await pool.query('DELETE FROM favorites WHERE id_service = $1', [id]);

    await pool.query('DELETE FROM services WHERE id_service = $1', [id]);

    res.json({ message: 'Услуга и все связанные данные успешно удалены' });
  } catch (error) {
    console.error('Ошибка удаления админом:', error.message);
    res.status(500).json({ error: 'Ошибка удаления: ' + error.message });
  }
});

app.put('/api/admin/users/:userId/balance', async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount } = req.body; 

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: 'Некорректная сумма' });
    }

    const result = await pool.query(
      'UPDATE users SET balance = balance + $1 WHERE id_user = $2 RETURNING balance',
      [amount, userId]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Пользователь не найден' });

    res.json({ newBalance: result.rows[0].balance });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка изменения баланса' });
  }
});

app.post('/api/support', async (req, res) => {
  try {
    const { userId, message } = req.body;
    if (!userId || !message) return res.status(400).json({ error: 'Заполните сообщение' });

    const result = await pool.query(
      'INSERT INTO support_tickets (id_user, message) VALUES ($1, $2) RETURNING id_ticket',
      [userId, message]
    );

    res.status(201).json({ message: 'Обращение создано', id: result.rows[0].id_ticket });
  } catch (error) {
    console.error('Ошибка создания тикета:', error.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.get('/api/support/my/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      'SELECT * FROM support_tickets WHERE id_user = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.get('/api/admin/support', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*, u.username, u.email 
       FROM support_tickets t
       JOIN users u ON u.id_user = t.id_user
       ORDER BY t.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.put('/api/admin/support/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;

    if (!reply) return res.status(400).json({ error: 'Введите ответ' });

    await pool.query(
      'UPDATE support_tickets SET admin_reply = $1, status = \'closed\' WHERE id_ticket = $2',
      [reply, id]
    );

    res.json({ message: 'Ответ отправлен' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.get('/api/admin/notifications', async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT COUNT(*) FROM support_tickets WHERE status = 'open'"
    );
    res.json({ unreadCount: parseInt(result.rows[0].count, 10) });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.get('/api/users/:userId/notifications', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      `SELECT COUNT(*) FROM support_tickets 
       WHERE id_user = $1 AND admin_reply IS NOT NULL AND is_read_by_user = FALSE`,
      [userId]
    );
    res.json({ unreadCount: parseInt(result.rows[0].count, 10) });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.put('/api/users/:userId/notifications/read', async (req, res) => {
  try {
    const { userId } = req.params;
    await pool.query(
      'UPDATE support_tickets SET is_read_by_user = TRUE WHERE id_user = $1',
      [userId]
    );
    res.json({ message: 'Прочитано' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend запущен: http://0.0.0.0:${PORT}`);
});