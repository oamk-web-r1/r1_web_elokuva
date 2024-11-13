import { pool} from "../helpers/db.js"
import { Router } from "express"
import { hash,compare } from "bcrypt"
import jwt from "jsonwebtoken"

const { sign } = jwt

const router = Router()

router.post('/register',(req, res, next) => {
    hash(req.body.password, 10,(error, hashedPassword) => {
        if (error) next(error) // Hash error.
        try {
            pool.query('insert into Users (email,password_hash) values ($1,$2) returning *',
                [req.body.email,hashedPassword],
                (error,result) => {
                    if (error) return next(error) // Database error.
                    return res.status(201).json({
                        user_id: result.rows[0].user_id,
                        email: result.rows[0].email
                    })
                }
            )
        } catch (error) {
    return next(error) 
    }
})
})

/* router.post('/login',(req,res,next) => {
    const invalid_message = 'Invalid credentials'
    try {
        pool.query('select * from Users where email=$1',
            [req.body.email],
            (error,result) => {
                if (error)  next(error)
                if (result.rowCount === 0) return next(new Error(invalid_message))
                    compare(req.body.password,result.rows[0].password_hash,(error,match) => {
                        if (error) return next(error)
                        if (!match) return next(new Error(invalid_message))
                        const token = sign({user: req.body.email},process.env.JWT_SECRET_KEY)
                        const user = result.rows[0]
                        // Return user_id, email, and token in the response
                        return res.status(200).json(
                    {
                            'user_id': user.user_id,
                            'email': user.email,
                            'token': token
                        }
                        )   
            })
        })
        } catch (error) {
            return next(error)
        }

    })
*/



router.post('/login', (req, res, next) => {
    const invalid_message = 'Invalid credentials';
    
    try {
        // Query the database to find the user by email
        pool.query('SELECT * FROM Users WHERE email=$1', [req.body.email], (error, result) => {
            if (error) {
                console.error('Database Error:', error); // Log any database errors
                return next(error); // Pass the error to the error handler
            }

            // If no user found with the provided email
            if (result.rowCount === 0) {
                console.warn('No user found with email:', req.body.email); // Log warning
                return res.status(401).json({ error: invalid_message }); // Send 401 Unauthorized
            }

            // Extract the user object from the query result
            const user = result.rows[0];
            console.log('User found:', user); // Log user object to confirm details

            // Compare the provided password with the hashed password in the database
            compare(req.body.password, user.password_hash, (compareError, isMatch) => {
                if (compareError) {
                    console.error('Password Comparison Error:', compareError); // Log comparison errors
                    return next(compareError); // Pass the comparison error to the error handler
                }

                if (!isMatch) {
                    console.warn('Password does not match for user:', req.body.email); // Log warning
                    return res.status(401).json({ error: invalid_message }); // Send 401 Unauthorized
                }

                // Generate a JWT token for the authenticated user
                const token = sign({ user: req.body.email }, process.env.JWT_SECRET_KEY);
                console.log('Login successful for user:', user.email); // Log successful login

                // Return user_id, email, and token in the response
                return res.status(200).json({
                    user_id: user.user_id,
                    email: user.email,
                    token: token,
                });
            });
        });
    } catch (error) {
        console.error('Unexpected Error during login:', error); // Log unexpected errors
        return next(error); // Pass unexpected errors to the error handler
    }
});

    
export default router;