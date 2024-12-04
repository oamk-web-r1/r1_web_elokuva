import { pool } from '../helpers/db.js';
import { Router } from 'express';
import { emptyORows } from '../helpers/utils.js';
import { auth } from '../helpers/auth.js';

const groupRouter = Router();

// Fetch all users (for selection)
groupRouter.get('/users',auth, async (req, res) => {
    const userEmail = req.user.email

    try {
        const userResult = await pool.query('SELECT user_id FROM Users WHERE email = $1', [userEmail]);
        if (userResult.rowCount === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }
        const userId = userResult.rows[0].user_id;

        const result = await pool.query(`SELECT user_id, email FROM Users WHERE user_id != $1`, [userId]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'An internal error occurred.' });
    }
});

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

        // Add the owner to the Group_Members table as an admin
        const groupId = result.rows[0].group_id
        await pool.query(
            'INSERT INTO Group_Members (user_id, group_id, role, status) VALUES ($1, $2, $3, $4)',
            [owner_id, groupId, 'admin', 'accepted']
        )
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

groupRouter.get('/:groupId', auth, async (req, res, next) => {
    const groupId = req.params.groupId
    const userEmail = req.user.email

    //console.log('User Email:', userEmail)

    try {
        const userResult = await pool.query('SELECT user_id FROM Users WHERE email = $1', [userEmail])
        if (userResult.rowCount === 0) {
            return res.status(404).json({ message: 'User not found' })
        }

        const userId = userResult.rows[0].user_id;

        const membershipCheck = await pool.query(
            'SELECT * FROM Group_Members WHERE group_id = $1 AND user_id = $2 AND status = $3',
            [groupId, userId, 'accepted']
        )

        if (membershipCheck.rowCount === 0) {
            return res.status(403).json({ message: 'You are not a member of this group' })
        }

        const groupResult = await pool.query('SELECT * FROM Groups WHERE group_id = $1', [groupId])
        if (groupResult.rowCount > 0) {
            res.status(200).json(groupResult.rows[0])
        } else {
            res.status(404).json({ message: 'Group not found' })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An internal error occurred.' })
    }
})

// Add users to a group
groupRouter.post('/:groupId/addusers', auth, async (req, res) => {
    const { groupId } = req.params;
    const { userIds } = req.body; // Array of user IDs to be added
    const userEmail = req.user.email;

    if (!Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({ error: 'No user IDs provided.' });
    }

    try {
        const userResult = await pool.query('SELECT user_id FROM Users WHERE email = $1', [userEmail]);
        if (userResult.rowCount === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const userId = userResult.rows[0].user_id;
        const groupResult = await pool.query(
            'SELECT * FROM Groups WHERE group_id = $1 AND owner_id = $2',
            [groupId, userId]
        );

        if (groupResult.rowCount === 0) {
            return res.status(403).json({ error: 'You are not authorized to add users to this group.' });
        }

        const values = userIds.map(userId => `(${groupId}, ${userId}, 'accepted')` ).join(',');
        const insertQuery = `
            INSERT INTO Group_Members (group_id, user_id, status)
            VALUES ${values}
            ON CONFLICT DO NOTHING
        `;

        await pool.query(insertQuery);
        res.status(200).json({ message: 'Users added to group successfully!' });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'An internal error occurred.' });
    }
});

// Fetch users in a specific group
groupRouter.get('/:groupId/users', auth, async (req, res) => {
    const { groupId } = req.params;

    try {
        const result = await pool.query(
            `
            SELECT u.user_id, u.email
            FROM GroupMembers gm
            JOIN Users u ON gm.user_id = u.user_id
            WHERE gm.group_id = $1
            `,
            [groupId]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'An internal error occurred.' });
    }
});

groupRouter.post('/addMovie', auth, async (req, res) => {
    const { group_id, imdb_movie_id, added_by } = req.body;

    console.log('Received request for adding movie to group:', {
        group_id: typeof group_id,
        imdb_movie_id: typeof imdb_movie_id,
        added_by: typeof added_by
    });

    try {
        const result = await pool.query(
            'INSERT INTO Group_Movies (group_id, imdb_movie_id, added_by) VALUES ($1, $2, $3) RETURNING *',
            [(group_id), (imdb_movie_id), (added_by)]
        );

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding movie to group:', error);
        res.status(500).json({ error: 'Failed to add movie to group' });
    }
});

groupRouter.get('/favorites/:group_id', auth, async (req, res) => {
    const { group_id } = req.params

    try {
        const result = await pool.query(
            'SELECT imdb_movie_id FROM Group_Movies WHERE group_id = $1', [group_id]
        )
        res.status(200).json({ favorites: result.rows })
    } catch (error) {
        console.error('Error fetching group favorite movies:', error)
        res.status(500).json({ error: 'Failed to fetch favorite movies' })
    }
})

export default groupRouter;