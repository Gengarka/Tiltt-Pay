
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const sql = require('mssql/msnodesqlv8');

const app = express();

app.use(cors());
app.use(express.json());

const config = {
  connectionString:
    `Driver=${process.env.DB_DRIVER};` +
    `Server=${process.env.DB_SERVER};` +
    `Database=${process.env.DB_DATABASE};` +
    `Trusted_Connection=Yes;`,
  options: {
    trustedConnection: true,
    trustServerCertificate: true,
  },
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend работает' });
});

app.get('/api/db-test', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query(`
      SELECT DB_NAME() AS databaseName
    `);

    res.json({
      success: true,
      message: 'Подключение к базе успешно!',
      database: result.recordset[0].databaseName,
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

const PORT = process.env.PORT || 3001;


app.get('/api/services', async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const result = await pool.request().query(`
      SELECT
        s.ID_service AS id,
        s.title,
        s.description,
        s.price,
        s.ID_game AS gameId,
        s.ID_seller AS sellerId,
        s.category,
        g.name AS gameName,
        u.username AS sellerName,
        COALESCE(r.rating, 0) AS rating,
        COALESCE(r.reviewsCount, 0) AS reviewsCount
      FROM Services s
      LEFT JOIN Games g
        ON g.ID_game = s.ID_game
      LEFT JOIN Users u
        ON u.ID_user = s.ID_seller
      LEFT JOIN (
        SELECT
          ID_seller,
          ID_order,
          AVG(CAST(rating AS FLOAT)) AS rating,
          COUNT(*) AS reviewsCount
        FROM Reviews
        GROUP BY ID_seller, ID_order
      ) r
        ON r.ID_seller = s.ID_seller
      WHERE s.status = N'Активна'
      ORDER BY s.ID_service;
    `);

    const services = result.recordset.map((service) => ({
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

app.listen(PORT, () => {
  console.log(`Backend запущен: http://localhost:${PORT}`);
});