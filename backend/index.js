const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: 'localhost',
  user: 'user',
  password: 'password',
  database: 'tododb',
  port: 5432,
});

// Create table on startup
pool.query(`CREATE TABLE IF NOT EXISTS todos (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL
)`);

app.get('/todos', async (req, res) => {
  const result = await pool.query('SELECT * FROM todos');
  res.json(result.rows);
});

app.post('/todos', async (req, res) => {
  const { text } = req.body;
  const result = await pool.query('INSERT INTO todos (text) VALUES ($1) RETURNING *', [text]);
  res.json(result.rows[0]);
});

app.delete('/todos/:id', async (req, res) => {
  await pool.query('DELETE FROM todos WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});

app.listen(3000, () => console.log('Backend running on http://localhost:3000'));