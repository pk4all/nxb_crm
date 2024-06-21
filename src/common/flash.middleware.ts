import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class FlashMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!req.session.flash) {
      req.session.flash = {};
    }
    res.locals.flash = req.session.flash;
    req.session.flash = {}; // Clear flash messages after they are exposed
    next();
  }
}