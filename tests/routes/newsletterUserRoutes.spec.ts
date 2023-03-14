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
    console.log(NewsletterUserMocks)
    const testDbUri: string = process.env.TEST_DB_URI!

    before(async () => {
        await connectToDatabase(testDbUri as string)
    })

    after(async () => {
        // Empty database
        await mongoose.disconnect()
    })

    it('should add 2 newsletter users', () => {
        console.log('testing')
    })

    it('should return 2 newsletter users', () => {

    })

    it('should find a newletter user by email', () => {

    })

    it('should update a newsletter user by email', () => {

    })

    it('should update newsletter user by id', () => {

    })

    it('should delete a user by email', () => {

    })
})