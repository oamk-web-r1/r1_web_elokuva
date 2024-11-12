import express from 'express';
import cors from 'cors';
import pkg from 'pg';

const PORT = 3001;
const { Pool } = pkg;

const app = express();
app.use(cors());


app.get('/', (req, res) => {

  const pool = openDb()

  pool.query('select * from Users', (error, result) => {
    if (error) {
      return res.status(500).json({error: error.message});
    }
    res.status(200).json(result.rows);
  })
});

  res.json('Hello from the backend!')
})
main

const openDb = () => {
  const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Web_sovellus_DB_template1',
    password: 'root',
    port: 5432
  })
  return pool
}






app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})