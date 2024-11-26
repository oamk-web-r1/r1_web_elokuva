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

// Get groups where the user is a member and status is 'accepted'
groupMemberRouter.get('/user/:user_id', (req, res, next) => {
    const userId = req.params.user_id;
    console.log('Fetching memberships for user:', userId);

    const query = 'SELECT * FROM Group_Members WHERE user_id = $1 AND status = $2';
    const params = [userId, 'accepted'];

    pool.query(query, params, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            return next(error);
        }
        console.log('Query results:', results.rows); // Log what is being returned
        res.status(200).json(results.rows);
    });
});

// Add a new member to a group

groupMemberRouter.post('/add', (req, res) => {
    const { user_id, group_id, role, status } = req.body;
    pool.query(
        'INSERT INTO Group_Members (user_id, group_id) VALUES ($1, $2) RETURNING *',
        [user_id, group_id],
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

export default groupMemberRouter;