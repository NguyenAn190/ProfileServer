import { Injectable } from '@nestjs/common';

@Injectable()
export class UserIdService {
  generateUserId(existingId?: string): string {
    if (!existingId) {
      return 'User0000';
    }

    const match = existingId.match(/(\d+)$/);
    if (match) {
      const numberPart = parseInt(match[0]);
      const nextNumber = numberPart + 1;
      return existingId.replace(/\d+$/, nextNumber.toString().padStart(match[0].length, '0'));
    }

    // If the provided id doesn't match the expected pattern, return a default value
    return 'User0000';
  }
}