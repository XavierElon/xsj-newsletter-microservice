import { Request, Response } from 'express'
import { validateEmail } from '../utils/verification.helper'
import { ErrorMessage } from '../structures/types'
import { NewsletterUser } from '../models/newsletterUser.model'
import { checkIfNewsletterUserExistsByEmail, checkIfNewsletterUserExistsById, createNewsletterUser, deleteNewsletterUserByEmail, deleteNewsletterUserById, getAllNewsletterUsers, getNewsletterUserByEmail, updateNewsletterUserByEmail, updateNewsletterUserById } from '../services/newsletterUser.service'

const errorMessage = new ErrorMessage()

export const GetAllNewsletterUsers = async (req: Request, res: Response) => {
    try {
        const result = await getAllNewsletterUsers()
        res.status(200).json({ users: result })
    } catch (error) {
        console.log(`Error retrieving all users: ${error}`)
        res.status(500).json('Error getting users')
    }
}

export const GetNewsletterUserByEmail = async (req: Request, res: Response) => {
    const email: string = req.params.email
    
    const userExists: boolean = await checkIfNewsletterUserExistsByEmail(email)
    const emailIsValid: boolean = validateEmail(email)
    if(!emailIsValid) {
        res.status(422).json({ message: errorMessage.email })
    }
    else if (userExists) {
        try {
            const user = await getNewsletterUserByEmail(email)
            res.status(200).json({ user: user})
        } catch (error) {
            console.log(`Error retrieving user ${error}`)
            res.status(500).json({ message: `Error retrieving ${email}`, error})
        }
    } else {
        console.log(`Email ${email} does not exist`)
        res.status(404).json({ message: `${email} does not exist in database`})
    }
}

export const CreateNewsletterUser = async (req: Request, res: Response) => {
    const userData: typeof NewsletterUser = req.body
    const email: string = req.body.email
    const emailIsValid: boolean = (email != null) ? validateEmail(email) : true
    const userExists: boolean = await checkIfNewsletterUserExistsByEmail(email)
  
    if (!emailIsValid) {
      res.status(422).json({ message: errorMessage.email })
    } else if (userExists) {
      console.error(`${email} already exists.`)
      res.status(400).json({ message: `${email} already exists` })
    } else {
      const result = await createNewsletterUser(userData)
      res.status(201).json({ message: 'User created', data: result })
    }
  }

export const PatchNewsletterUserByEmail = async (req: Request, res: Response) => {
    const email: string = req.params.email
    const newEmail: string | null = (req.body.email != null) ? req.body.email : null
    const emailIsValid: boolean = (newEmail != null) ? validateEmail(newEmail) : true
    const userExists: boolean = await checkIfNewsletterUserExistsByEmail(email)
    
    if(!emailIsValid) {
        res.status(422).json({ message: errorMessage.email })
    } else if (userExists) {
        try {
            const updatedUser = await updateNewsletterUserByEmail(email, req.body)
            console.log(`User updated: ${updatedUser}`)
            res.status(200).send({ message: 'User updated', result: updatedUser })
        } catch (error) {
            console.error(`Error updating ${email}: ${error}`)
            return res.status(500).send({ error: `Server error: ${error}`})
        }
    } else {
        console.log(`Email ${email} does not exist`)
        res.status(404).json({ message: `${email} does not exist in database`})
    }
}

export const PatchNewsletterUserById = async (req: Request, res: Response) => {
    const id = req.params.id
    const userExists: boolean = await checkIfNewsletterUserExistsById(id)

    if (userExists) {
        try {
            const updatedUser = await updateNewsletterUserById(id, req.body)
            console.log(`User updated: ${updatedUser}`)
            res.status(200).send({ message: `User with id ${id} updated`, result: updatedUser})
        } catch (error) {
            console.error(`Error updating user with id ${id}: ${error}`)
        }
    } else {
        console.log(`User with ${id} does not exist`)
        res.status(404).json({ message: `User with ${id} does not exist in database`})
    }
}

export const DeleteNewsletterUserByEmail = async (req: Request, res: Response) => {
    const email: string = req.params.email
    const isValidEmail: boolean= validateEmail(email)
    const userExists: boolean = await checkIfNewsletterUserExistsByEmail(email)

    if (!isValidEmail) {
        res.status(422).json({ message: errorMessage.email })
    } else if (userExists) {
        try {
            const result = await deleteNewsletterUserByEmail(email)
            console.log(`Email ${result} succesfully deleted from database`)
            res.status(200).json({ message: `Email ${result} successfully deleted`})
        } catch (error) {
            console.log(`Error deleteing ${email}: ${error}`)
            res.status(500).json({ message: `Error deleting ${email}`, error})
        }
    } else {
        console.log(`Email ${email} does not exist`)
        res.status(404).json({ message: `${email} does not exist in database`})
    }
}

export const DeleteNewsletterUserById = async (req: Request, res: Response) => {
    const id = req.params.id
    const userExists: boolean = await checkIfNewsletterUserExistsById(id)

    if (userExists) {
        try {
            await deleteNewsletterUserById(id)
            console.log(`${id} succesfully deleted from database`)
            res.status(200).send({ message: `${id} successfully deleted.`})
        } catch (error) {
            console.error(`Error updating user with id ${id}: ${error}`)''
        }
    } else {
        console.log(`User with ${id} does not exist`)
        res.status(404).json({ message: `User with ${id} does not exist in database`})
    }
}