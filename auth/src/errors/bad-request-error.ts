import { CustomError} from "./CustomError.class";

export class BadRequestError extends CustomError{
    statusCode = 400;
    message: string;

    constructor(message: string) {
        super(message);
        this.message = message;

        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    serialiseErrors(): { message: string; field?: string }[] {
        return [
            {
                message: this.message
            }
        ];
    }
}
