import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TokenRepository {
  constructor(private prismaService: PrismaService) {}

  async findTokenByUserID(id: string) {
    return await this.prismaService.token.findMany({
      where: {
        userId: id,
      },
    });
  }

  async findToken(token: string) {
    return await this.prismaService.token.findUnique({
      where: {
        token: token,
      },
    });
  }

  async create(token: any) {
    return await this.prismaService.token.create({
      data: token,
    });
  }
}
