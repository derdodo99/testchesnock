import { Request } from 'express';

export function cookieExtractor(req: Request) {
  return req?.cookies?.['access_token'];
}
