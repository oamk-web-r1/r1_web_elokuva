import { pool } from '../helpers/db.js';
import { Router } from 'express';
import { emptyORows } from '../helpers/utils.js';
import { auth } from '../helpers/auth.js';

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
groupRouter.post('/create', async (req, res) => {
    const { owner_id, name, description } = req.body;

    // Check for missing required fields
    if (!owner_id) {
        console.log('Missing required fields: owner_id');
        return res.status(400).json({ error: 'Missing required fields: owner_id' });
        
    }

    if (!name) {
        console.log('Missing required fields: name');
        return res.status(400).json({ error: 'Missing required fields: name' });
        
    }
    if (!description) {
        console.log('Missing required fields: description');
        return res.status(400).json({ error: 'Missing required fields: description' });
        
    }

    try {
        // Check if group name already exists
        const checkResult = await pool.query('SELECT * FROM Groups WHERE name = $1', [name]);
        if (checkResult.rowCount > 0) {
            console.log('Group name already exists');
            return res.status(400).json({ error: 'Group name already exists' });
        }

        // Create group in the DB
        const result = await pool.query(
            'INSERT INTO Groups (owner_id, name, description) VALUES ($1, $2, $3) RETURNING *',
            [owner_id, name, description]
        );
        return res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'An internal error occurred.' });
    }
});

// Delete group. Only the group owner can delete the group
groupRouter.delete('/delete/:groupId', auth, async (req, res) => {
    const { groupId } = req.params;
    const userEmail = req.user.email; // Extract user email from the decoded token

    console.log('Starting DELETE /groups/delete/:groupId endpoint');
    console.log('Received groupId:', groupId);
    console.log('Decoded email from token:', userEmail);

    try {
        // First, get the user's ID using their email from the token
        const userResult = await pool.query('SELECT user_id FROM Users WHERE email = $1', [userEmail]);

        if (userResult.rowCount === 0) {

            return res.status(404).json({ message: 'User not found' });
        }

        const userId = userResult.rows[0].user_id;

        // Now, check if the group exists and if the user is the owner
        const groupResult = await pool.query(
            'SELECT * FROM Groups WHERE group_id = $1 AND owner_id = $2',
            [groupId, userId]
        );

        if (groupResult.rowCount === 0) {
            return res.status(403).json({ message: 'You are not authorized to delete this group or group does not exist.' });
        }

        // Delete the group
        const deleteResult = await pool.query(
            'DELETE FROM Groups WHERE group_id = $1 RETURNING *',
            [groupId]
        );

        if (deleteResult.rowCount === 0) {
            return res.status(404).json({ message: 'Group not found.' });
        }

        return res.status(200).json({ message: 'Group deleted successfully.' });
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ message: 'An internal error occurred.' });
    }
});



export default groupRouter;
