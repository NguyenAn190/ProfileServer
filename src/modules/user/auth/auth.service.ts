import { ConflictException, HttpCode, Injectable, InternalServerErrorException } from '@nestjs/common';
import { RegisterDTO } from 'src/modules/user/auth/dto/register.dto';
import { UserRepository } from './../../../share/repository/user.repository';
import { PasswordUtils } from 'src/share/utils/password.utils';
import { create } from 'domain'
import { ResponseObject } from 'src/share/global/response.object';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordUtils: PasswordUtils,
  ) {}

  async register(registerDTO: RegisterDTO): Promise<ResponseObject<any>> {
    try {
      const existingUser = await this.userRepository.findByEmailOrPhone(
        registerDTO.email,
        registerDTO.phone,
      );

      if (existingUser) {
        throw new ConflictException('Tài khoản đã tồn tại!');
      }

      const hashedPassword = await this.passwordUtils.hashPassword(
        registerDTO.password,
      );

      const user = {
        name: registerDTO.name,
        email: registerDTO.email,
        password: hashedPassword,
        phone: registerDTO.phone,
      };

      await this.userRepository.create(user);

      return new ResponseObject(201, 'Tạo tài khoản thành công!', null);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      console.error(error.message)
      throw new InternalServerErrorException('Đăng ký tài khoản thất bại');
    }
  }
}
