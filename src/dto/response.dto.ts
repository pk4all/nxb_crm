// common/dto/response.dto.ts
export class ResponseDto<T> {
    constructor(
        public readonly statusCode: number,
        public readonly status: string,
        public readonly message: string,
        public readonly data: T,
    ) {}
  }
  