
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

import { expect } from "chai";

describe('GET Users',() => {
    it ('should get all users',async() => {
        const response = await fetch('http://localhost:3001/')
        const data = await response.json()

        expect(response.status).to.equal(200)
        expect(data).to.be.an('array').that.is.not.empty
        expect(data[0]).to.include.all.keys('user_id','email','password_hash')
    })
})

describe('POST task',() => {
    it ('should create a new user',async() => {
        const response = await fetch('http://localhost:3001/' + 'create',{
            method: 'post',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({'user_id':'3','email':'tester2@tester.com','password_hash':'12345'})
        })
        const data = await response.json()
        expect(response.status).to.equal(200)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('user_id','email','password_hash')
    })

    it ('should not create a user without required data',async() => {
        const response = await fetch('http://localhost:3001/' + 'create',{
            method: 'post',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({'user_id':null,'email':null,'password_hash':null})
        })
        const data = await response.json()
        expect(response.status).to.equal(500)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('error')
    })
})

