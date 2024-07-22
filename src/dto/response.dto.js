// common/dto/response.dto.ts
export class ResponseDto {
    statusCode;
    status;
    message;
    data;
    constructor(statusCode, status, message, data) {
        this.statusCode = statusCode;
        this.status = status;
        this.message = message;
        this.data = data;
    }
}
//# sourceMappingURL=response.dto.js.map