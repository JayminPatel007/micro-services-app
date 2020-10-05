import express, { Request, Response } from 'express';
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";
import {User} from "../models/User";
import {BadRequestError} from "../errors/bad-request-error";
import {Passwords} from "../utils/passwords";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post('/api/users/signin',
    [
        body('email')
            .isEmail()
            .withMessage('Email must be valid'),
        body('password')
            .trim()
            .notEmpty()
            .withMessage('You must supply a password'),

    ], validateRequest,
    async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({email});
    if (!existingUser) {
        throw new BadRequestError('Invalid Credentials');
    }

    const passwordMatch = await Passwords.compare(existingUser.password, password);

    if (!passwordMatch) {
        throw new BadRequestError('Invalid Credentials');
    }

        const payload = {
            id: existingUser.id,
            email: existingUser.email
        };

        const userJwt = jwt.sign(payload, process.env.JWT_KEY!);

        // Store it in session object
        req.session = {
            jwt: userJwt
        };

        res.status(200).send(existingUser);
});

export {router as signinRouter}
