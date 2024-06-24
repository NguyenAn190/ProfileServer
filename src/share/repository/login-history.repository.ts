import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class LoginHistoryRepository {
    constructor(private readonly prismaService: PrismaService) {}
    async create(loginHistory : any) : Promise<void> {
        await this.prismaService.login_History.create({
            data : loginHistory
        })
    }
}