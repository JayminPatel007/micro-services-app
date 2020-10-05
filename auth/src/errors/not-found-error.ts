import {CustomError} from "./CustomError.class";

export class NotFoundError extends CustomError{
    statusCode = 404;
    constructor() {
        super('Route not found');
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    serialiseErrors(): { message: string; field?: string }[] {
        return [
            {
                message: 'Not found'
            }
        ];
    }
}