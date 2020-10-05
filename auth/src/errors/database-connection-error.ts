import {CustomError} from "./CustomError.class";

export class DatabaseConnectionError extends CustomError{

    reason = 'Error connecting to database';
    statusCode = 500;

    constructor() {
        super('Error connecting to DB');
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }

    serialiseErrors() {
        return [
            { message: this.reason }
        ]
    }
}
