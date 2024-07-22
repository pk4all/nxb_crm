// common/utils/response.util.ts
import { ResponseDto } from '../../dto/response.dto';
export function createResponse(statusCode = 200, data, message = 'Success', status = 'OK') {
    return new ResponseDto(statusCode, status, message, data);
}
//# sourceMappingURL=response.util.js.map