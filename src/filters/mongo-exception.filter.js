var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Catch } from '@nestjs/common';
import { MongoError } from 'mongodb';
let MongoExceptionFilter = class MongoExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = 409; // Conflict
        if (exception.code === 11000) {
            const key = Object.keys(exception.keyPattern)[0];
            const value = exception.keyValue[key];
            console.log('error', `Duplicate key error: ${key} with value '${value}' already exists.`);
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
        }
        else {
            response
                .status(status)
                .json({
                statusCode: status,
                message: exception.message,
                error: 'Conflict'
            });
        }
    }
};
MongoExceptionFilter = __decorate([
    Catch(MongoError)
], MongoExceptionFilter);
export { MongoExceptionFilter };
//# sourceMappingURL=mongo-exception.filter.js.map