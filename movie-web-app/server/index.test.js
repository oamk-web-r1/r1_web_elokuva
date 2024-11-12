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
            body: JSON.stringify({
                user_id: 5,
                email: 'tester2@tester.com',
                password_hash: '12345'})
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