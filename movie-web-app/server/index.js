import express from 'express'
import cors from 'cors'
import movieAppDb from './routers/movieAppDb.js'
import userRouter from './routers/userRouter.js'
import groupRouter from './routers/groupRouter.js'
import { pool } from './helpers/db.js'
import { response } from 'express'

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', movieAppDb); // Database router
app.use('/user', userRouter); // User router
app.use('/groups', groupRouter); // Group router

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  res.status(statusCode).json({error: err.message}) 
})

app.listen(port)
