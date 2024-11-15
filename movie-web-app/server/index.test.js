
import { initializeTestDb, insertTestUser, getToken } from './helpers/test.js';
import { expect } from "chai";

const base_url = "http://localhost:3001";

// Before running the tests, we need to initialize the test database
before(async() => {
    await initializeTestDb()
})

//Tests for UserRouter

describe('POST register', () => {
    const email = 'register@foo.com';
    const password = 'register123';

    it('should register with valid email and password', async () => {
        const response = await fetch(base_url + '/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'email': email, 'password': password })
        });
        const data = await response.json();
        expect(response.status).to.equal(201, data.error);
        expect(data).to.be.an('object');
        expect(data).to.include.all.keys('user_id', 'email');
    });

    })

    describe('DELETE /user/delete', () => {
        const email = 'removableuser@foo.com';
        const password = 'password123';
        let token;
    
        before(async () => {
            // Insert the test user into the DB
            await insertTestUser(email, password);
            await new Promise(resolve => setTimeout(resolve, 200)); // Optional delay for data commit
    
            // Login to get the token
            const response = await fetch(base_url + '/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'email': email, 'password': password })
            });
    
            const data = await response.json();
            expect(response.status).to.equal(200, data.error);
            expect(data).to.be.an('object');
            expect(data).to.include.all.keys('user_id', 'email', 'token'); // Expect user_id, email, and token
    
            // Store the token for subsequent requests
            token = data.token;
        });
    
        it('should delete the user account successfully', async () => {
            // Delete user using the token
            //const test_token = token.split(' ')[1];
            const response = await fetch(base_url + '/user/delete', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            const data = await response.json();
            expect(response.status).to.equal(200);
            expect(data.message).to.equal('User deleted successfully');
        });
    
        it('should return 401 Unauthorized if no token is provided', async () => {
            const response = await fetch(base_url + '/user/delete', {
                method: 'DELETE',
    
            });
    
            const data = await response.json();
            expect(response.status).to.equal(401);
            expect(data.message).to.equal('Authorization required');
        });
    
        it('should return 403 Unauthorized if an invalid token is provided', async () => {
            const response = await fetch(base_url + '/user/delete', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer invalidtoken`
                }
            });
    
            const data = await response.json();
            expect(response.status).to.equal(403);
            expect(data.message).to.equal('Invalid credentials');
        });
    
        
    });

describe('POST login', () => {
    const email = 'login@foo.com'
    const password = 'login123'

 before(async () => {
        await insertTestUser(email, password); // Wait for the user to be inserted to the DB
        await new Promise(resolve => setTimeout(resolve, 200)); // Optional delay for data commit
    });

    it ('should login with valid credentials', async () => {
        const response = await fetch(base_url + '/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'email':email, 'password':password})
        })

        const data = await response.json()
        expect(response.status).to.equal(200, data.error)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('user_id','email','token') // Expect user_id, email, and token
    })
})

describe('POST /user/logout', () => {
    const email = 'logout@foo.com'
    const password = 'logout123'
    let token;

    before(async () => {
        await insertTestUser(email, password); // Wait for the user to be inserted to the DB
        await new Promise(resolve => setTimeout(resolve, 200)); // Optional delay for data commit

        // Login test user 
        const response = await fetch(base_url + '/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'email': email, 'password': password })
        });

        const data = await response.json();
        expect(response.status).to.equal(200, data.error);
        expect(data).to.be.an('object');
        expect(data).to.include.all.keys('user_id', 'email', 'token'); // Expect user_id, email, and token

        // Store the token for subsequent requests
        token = data.token;

    });

    it ('should logout the user successfully', async () => {

        // Logout the user
        const response = await fetch(base_url + '/user/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        expect(response.status).to.equal(200, data.error);
        expect(data).to.be.an('object');
        expect(data.message).to.equal('User successfully logged out');
    });

    it('should prevent access to protected routes after logout', async () => {
        // Attempt to delete user after logging out
        const response = await fetch(base_url + '/user/delete', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        expect(response.status).to.equal(403);
        const data = await response.json();
        expect(data.message).to.equal('Token has been invalidated. Please login again.');
    });

})




//Tests for Groups

describe('POST /groups/create', () => {
    const owner_id = '1' // Needs to be a real userd_id from Users, 1 because there will always be a user with id 1
    const name =  'Sample Group'
    const description = 'A sample group for testing'

    it('should register a new group with valid data', async () => {
        const response = await fetch(base_url + '/groups/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                owner_id,
                name,
                description
            })
        })

       const data = await response.json()
                expect(response.status).to.equal(200, data.error)
                expect(data).to.be.an('object')
                expect(data).to.include.all.keys('group_id', 'owner_id', 'name', 'description') // Expect all keys
            });
    });

  /*  it('should return an error if required fields are missing', (done) => {
        const incompleteGroupData = {
            group_name: 'Incomplete Group' // Missing group_id and description
        };

        chai.request(app)
            .post('/groups/create')
            .send(incompleteGroupData)
            .end((err, res) => {
                expect(res).to.have.status(400); // Assuming 400 for validation errors
                expect(res.body).to.have.property('error');
                done();
            });
    }); 
}); */

