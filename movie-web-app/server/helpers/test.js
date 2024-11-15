import fs from 'fs';
import path from 'path';
import { pool } from './db.js'
import { hash } from 'bcrypt'
import jwt from 'jsonwebtoken'

const { sign } = jwt
const __dirname = path.resolve();

const initializeTestDb = async () => {
    const sql = fs.readFileSync(path.resolve(__dirname,'../server/movieAppDb.sql'),"utf8");
    await pool.query(sql)
}

const insertTestUser = async (email, password) => {
     hash(password,10,(error,hashedPassword) => {
         pool.query('insert into Users (email,password_hash) values ($1,$2)',
            [email,hashedPassword])
    })
}

const getToken = (email) => {
    return sign({user: email},process.env.JWT_SECRET_KEY)
}

export { initializeTestDb, insertTestUser, getToken }