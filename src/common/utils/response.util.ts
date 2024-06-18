// common/utils/response.util.ts
import { ResponseDto } from '../../dto/response.dto';

export function createResponse<T>(statusCode=200,data: T, message = 'Success', status = 'OK'): ResponseDto<T> {
  return new ResponseDto<T>(statusCode,status, message, data);
}
