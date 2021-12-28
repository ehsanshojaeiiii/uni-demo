import {StatusCode} from '../enums/status.code.enum';

export class BaseResponse {
    statusCode: StatusCode;
    message?: string;
    error?: string;
}
