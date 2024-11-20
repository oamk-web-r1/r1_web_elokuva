import { Router } from 'express';
import { pool } from '../helpers/db.js';
import { auth } from '../helpers/auth.js';

const reviewRouter = Router()

reviewRouter.get('/:movieId', (req, res, next) => {
  const movieId = req.params.movieId;

  const query = `SELECT * FROM Reviews WHERE imdb_movie_id = $1`;
  const values = [movieId];
  
  pool.query(query, values)
    .then(result => {
      res.json({
        reviews: result.rows.map(row => ({
          id: row.review_id,
          author: row.user_id,
          content: row.review_text,
          rating: row.rating
        }))
      })
    })
    .catch(err => {
      console.error('Error fetching reviews from local database:', err)
      return next(err)
    })
})

export default reviewRouter
