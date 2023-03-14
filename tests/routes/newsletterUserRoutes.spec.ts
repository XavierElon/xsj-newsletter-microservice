import { expect } from 'chai'
import mongoose, { Model } from 'mongoose'
import request from 'supertest'
import sinon from 'sinon'
import dotenv from 'dotenv'
import express, { Express } from 'express'
import { connectToDatabase } from '../../src/connections/mongodb'
import { newsletterRouter } from '../../src/routes/newsletterUser.routes'
import { NewsletterUser } from '../../src/models/newsletterUser.model'
import { NewsletterUserMocks } from '../__mocks__/NewsletterUser.data'

dotenv.config()

const app: Express = express()
app.use(express.json())
app.use('/', newsletterRouter)

describe('Newsletter Routes', () => {
    let userId
    let userEmail = 'xavier@test.com'
    const badEmail = 'achillesflocka@gmail.com'
    const testDbUri: string = process.env.TEST_DB_URI!

    before(async () => {
        // NewsletterUser.deleteMany({})
        await connectToDatabase(testDbUri as string)
    })

    after(async () => {
        // Empty database
        NewsletterUser.deleteMany({}, () => {
            console.log('NEWSLETTER USERS DELETED')
        })
        await mongoose.disconnect()
    })

    it('should add 2 newsletter users and return 201 status code for both', async () => {
        const res = await request(app).post('/newsletter').send(NewsletterUserMocks[0])
        expect(res.status).to.equal(201)
        const res2 = await request(app).post('/newsletter').send(NewsletterUserMocks[1])
        expect(res2.status).to.equal(201)
    })

    it('should return 2 newsletter users',async () => {
        const res = await request(app).get('/newsletter')
        expect(res.body.users.length).to.equal(2)
    })

    it('should find a newletter user by email with 201 status code', async () => {
        const res  = await request(app).get(`/newsletter/${userEmail}`)
        expect(res.status).to.equal(201)
    })

    it('should update a newsletter user by email with 201', async () => {
        const newUser = {
            email: 'elonmusk@gmail.com'
        }
        const res = await request(app).patch(`/newsletter/${userEmail}`).send(newUser)
        expect(res.status).to.equal(200)
        expect(res.body.result.email).to.equal(newUser.email)
        expect(res.body.result.subscribed).to.equal(true)
    })

    it('should update newsletter user by id with 200 status code and subscribed should be changed to false', async () => {
        const newUser = {
            email: 'elonmusk@gmail.com',
            subscribed: false
        }
        const res = await request(app).get('/newsletter')
        userId = res.body.users[0]._id
        const response = await request(app).patch(`/newsletter/update/${userId}`).send(newUser)
        expect(response.status).to.equal(200)
        expect(response.body.result.subscribed).to.equal(false)
    })

    it('should delete a user by email with 201 status code', async () => {
        const email: string = 'elonmusk@gmail.com'
        const res = await request(app).delete(`/newsletter/${email}`)
        expect(res.status).to.equal(201)
    })

    it('should be only one user remaining', async () => {
        const res = await request(app).get('/newsletter')
        expect(res.body.users.length).to.equal(1)
    })
})