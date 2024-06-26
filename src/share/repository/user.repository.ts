import { Injectable } from '@nestjs/common';
import { PrismaService } from './../../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    return await this.prismaService.user.findMany();
  }

  async findByID(id: string) {
    return await this.prismaService.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  async findByEmail(email: string) {
    return await this.prismaService.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });
  }

  async create(user: any): Promise<void> {
    await this.prismaService.user.create({
      data: user,
    });
  }

  async update(user: User) {
    return await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: user,
    });
  }

  async delete(id: string) {
    return await this.prismaService.user.delete({
      where: {
        id: id,
      },
    });
  }

  async findByEmailOrPhone(email: string, phone: string): Promise<any> {
    return await this.prismaService.user.findFirst({
      where: {
        OR: [{ email: email }, { phone: phone }],
      },
    });
  }

  async getUserWithMaxId() {
    const user = await this.prismaService.user.findFirst({
      orderBy: {
        id: 'desc',
      },
    });
    return user ? String(user.id) : '';
  }

}
