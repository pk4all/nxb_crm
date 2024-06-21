import 'express-session';

declare module 'express-session' {
  interface SessionData {
    flash?: { [key: string]: any };
    user?:{ [key: string]: any };
    error?:{ [key: string]: any };
  }
}