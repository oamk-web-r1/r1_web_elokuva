import { pool } from '../helpers/db.js';
import { Router } from 'express';
import { emptyORows } from '../helpers/utils.js';

const groupRouter = Router();

// Get all groups
groupRouter.get('/', (req, res, next) => {
    pool.query('SELECT * FROM Groups', (error, results) => {
        if (error) {
            return next(error);
        }
        res.status(200).json(emptyORows(results));
    });
});

// Add a new group
groupRouter.post('/create', (req, res) => {
    const { owner_id, name, description } = req.body;
    pool.query(
        'INSERT INTO Groups (owner_id, name, description) VALUES ($1, $2, $3) RETURNING *',
        [owner_id, name, description],
        (error, result) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            res.status(200).json(result.rows[0]);
        }
    );
});

export default groupRouter;
