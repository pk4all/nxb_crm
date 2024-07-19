import { ExceptionFilter, Catch, ArgumentsHost, ConflictException } from '@nestjs/common';
import { MongoError } from 'mongodb';
import { Response,Request } from 'express';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = 409; // Conflict

    if (exception.code === 11000) {
      const key = Object.keys((exception as any).keyPattern)[0];
      const value = (exception as any).keyValue[key];
      console.log('error',`Duplicate key error: ${key} with value '${value}' already exists.`);
        request.session.flash = {
          error: `Duplicate key error: ${key} with value '${value}' already exists.`,
        };
      response
        .status(status)
        .json({
          statusCode: status,
          message: `Duplicate key error: ${key} with value '${value}' already exists.`,
          error: 'Conflict'
        });
        
    } else {
      response
        .status(status)
        .json({
          statusCode: status,
          message: exception.message,
          error: 'Conflict'
        });
    }
  }
}
