import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class RandomTokenService {
  generateToken(length: number): string {
    const buffer = crypto.randomBytes(Math.ceil(length / 2));
    const token = buffer.toString('hex').slice(0, length);
    return token;
  }
}
