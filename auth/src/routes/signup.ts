import express, {Request, Response} from 'express';
import { body } from "express-validator";
import jwt from 'jsonwebtoken';

import { User } from "../models/User";
import {BadRequestError} from "../errors/bad-request-error";
import { validateRequest } from "../middlewares/validate-request";

const router = express.Router();

router.post('/api/users/signup' ,
    [
        body('email').isEmail().withMessage('Email Must be Valid'),
        body('password')
            .trim()
            .isLength({min: 4, max: 20})
            .withMessage('Password must be between 4 to 20 chars'),
    ], validateRequest,
    async (req: Request, res: Response)=> {

    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new BadRequestError('Email already in Use');
    }

    const user = User.build({email, password});
    await user.save();

    const payload = {
        id: user.id,
        email: user.email
    };

    const userJwt = jwt.sign(payload, process.env.JWT_KEY!);

    // Store it in session object
    req.session = {
        jwt: userJwt
    };

    res.status(201).send(user);
});

export {router as signupRouter};
