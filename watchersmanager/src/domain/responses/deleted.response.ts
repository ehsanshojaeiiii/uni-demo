import {StatusCode} from '../enums/status.code.enum';
import {BaseResponse} from './base.response';

export class DeletedResponse extends BaseResponse {
  data?: any;
  constructor(message: string, data?: any) {
    super();
    this.statusCode = StatusCode.DELETED;
    this.message = message;
  }
}
