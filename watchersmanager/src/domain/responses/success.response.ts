import {StatusCode} from '../enums/status.code.enum';
import {BaseResponse} from './base.response';

export class SuccessResponse extends BaseResponse {
    data?: any;
    constructor(message: string, data?: any) {
        super();
        this.statusCode = StatusCode.OK;
        this.message = message;
        this.data = data;
    }
}
