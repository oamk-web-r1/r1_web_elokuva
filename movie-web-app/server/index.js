import express from 'express'
import cors from 'cors'
import Web_sovellus_DB_template1Router from './routers/Web_sovellus_DB_template1Router.js'
import userRouter from './routers/userRouter.js'
import groupRouter from './routers/groupRouter.js'
import { pool } from './helpers/db.js'
import { response } from 'express'

<<<<<<< Updated upstream
const PORT = 3001;
const { Pool } = pkg;
=======
>>>>>>> Stashed changes

const app = express();
const port = process.env.PORT || 3001;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', Web_sovellus_DB_template1Router); // Database router
app.use('/user', userRouter); // User router
app.use('/groups', groupRouter); // Group router

<<<<<<< Updated upstream

app.get('/', (req, res) => {

  const pool = openDb()

  pool.query('select * from Users', (error, result) => {
    if (error) {
      return res.status(500).json({error: error.message});
    }
    res.status(200).json(result.rows);
  })
});



const openDb = () => {
  const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Web_sovellus_DB_template1',
    password: 'nowciv-duvNig-bajku7',
    port: 5432
  })
  return pool
}






app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
=======
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  res.status(statusCode).json({error: err.message}) 
})

app.listen(port)
>>>>>>> Stashed changes
