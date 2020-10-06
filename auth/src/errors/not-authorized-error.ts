import {CustomError} from "./CustomError.class";

export class NotAuthorizedError extends CustomError{
    statusCode = 401;

    constructor() {
        super('Not authorized');

        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }


    serialiseErrors(): { message: string; field?: string }[] {
        return [{message: 'Not authorized'}];
    }
}
