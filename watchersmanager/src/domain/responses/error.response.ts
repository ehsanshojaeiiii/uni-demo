import {BaseResponse} from "./base.response";
import {StatusCode} from "../enums/status.code.enum";

export class ErrorResponse extends BaseResponse {
    constructor(statusCode: number ,message: any) {
        super();
        this.statusCode = statusCode;
        this.error = message;
    }
}
