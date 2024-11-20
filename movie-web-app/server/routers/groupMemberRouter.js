import { pool } from '../helpers/db.js';
import { Router } from 'express';

const groupMemberRouter = Router();

// Get all group members
groupMemberRouter.get('/', (req, res, next) => {
    pool.query('SELECT * FROM Group_Members', (error, results) => {
        if (error) {
            return next(error);
        }
        res.status(200).json(emptyORows(results));
    });
});

// Add a new member to a group

groupMemberRouter.post('/add', (req, res) => {
    const { user_id, group_id, role, status, joined_at } = req.body;
    pool.query(
        'INSERT INTO Group_Members (user_id, group_id, role, status, joined_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [user_id, group_id, role, status, joined_at],
        (error, result) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            res.status(200).json(result.rows[0]);
        }
    );
});

// Remove a member from a group. Only the group owner can remove members. All members can remove themselves from a group

groupMemberRouter.delete('/remove', (req, res) => {
    const { user_id, group_id } = req.body;
    pool.query(
        'DELETE FROM Group_Members WHERE user_id = $1 AND group_id = $2 RETURNING *',
        [user_id, group_id],
        (error, result) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            res.status(200).json(result.rows[0]);
        }
    );
});