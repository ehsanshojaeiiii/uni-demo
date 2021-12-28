import {StatusCode} from '../enums/status.code.enum';
import {BaseResponse} from './base.response';

export class CreatedResponse extends BaseResponse {
  data?: any;
  constructor(message: string, data?: any) {
    super();
    this.statusCode = StatusCode.CREATED;
    this.message = message;
  }
}
