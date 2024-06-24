import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDTO } from 'src/modules/user/auth/dto/register.dto';
import { UserRepository } from './../../../share/repository/user.repository';
import { PasswordUtils } from 'src/share/utils/password.utils';
import { ResponseObject } from 'src/share/global/response.object';
import { LoginDTO } from 'src/modules/user/auth/dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/modules/mail/mail.service';
import { TokenRepository } from 'src/share/repository/token.repository';
import { RandomTokenService } from './../../../share/service/random-token.service';
import { UserIdService } from './../../../share/service/user-id.service';
import { LoginHistoryRepository } from './../../../share/repository/login-history.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly loginHistoryRepository: LoginHistoryRepository,
    private readonly randomTokenService: RandomTokenService,
    private readonly tokenRepository: TokenRepository,
    private readonly userRepository: UserRepository,
    private readonly passwordUtils: PasswordUtils,
    private readonly userIdService: UserIdService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
  ) {}

  // service xử lí đăng kí
  async register(registerDTO: RegisterDTO): Promise<ResponseObject<any>> {
    try {
      const tokenGenerate = this.randomTokenService.generateToken(30);
      const maxIdUser = await this.userRepository.getUserWithMaxId();
      const idUserGenerate = this.userIdService.generateUserId(maxIdUser.toString());
      
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
  
      const createdAt = new Date();
      const expiresAt = new Date(createdAt.getTime() + 15 * 60 * 1000);
  
      const newUser = {
        id: idUserGenerate,
        name: registerDTO.name,
        email: registerDTO.email,
        password: hashedPassword,
        phone: registerDTO.phone,
      };
  
      const newToken = {
        token: tokenGenerate,
        userId: idUserGenerate,
        createdAt: createdAt,
        expiresAt: expiresAt,
        isRevoked: false,
      };
  
      // Tạo người dùng và token đồng thời
      await Promise.all([
        this.userRepository.create(newUser),
        this.tokenRepository.create(newToken),
        this.mailService.sendUserConfirmation(
          registerDTO.email,
          tokenGenerate,
          idUserGenerate,
        ),
      ]);
  
      return new ResponseObject(201, 'Tạo tài khoản thành công!', null);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      console.error(error.message);
      throw new InternalServerErrorException('Đăng ký tài khoản thất bại');
    }
  }
  

  // service xử lí đăng nhập
  async login(loginDTO: LoginDTO, userIp: string): Promise<{ access_token: string }> {
    const user = await this.userRepository.findByEmail(loginDTO.email);
    if (user === null || user === undefined) {
      throw new BadRequestException('Tài khoản hoặc mật khẩu không hợp lệ!');
    } else {
      if (!user || !(await this.passwordUtils.comparePasswords(loginDTO.password, user.password))) {
        const historyLogin = {
          userId: user?.id, 
          loginSuccess: false,
          ipAddress: userIp
        };
    
        this.loginHistoryRepository.create(historyLogin);
    
        if (!user) {
          throw new BadRequestException('Tài khoản hoặc mật khẩu không hợp lệ!');
        }
    
        if (!user.isActive) {
          throw new UnauthorizedException('Tài khoản chưa được kích hoạt!');
        }
    
        throw new UnauthorizedException('Tài khoản hoặc mật khẩu không hợp lệ!');
      }
    
      // Nếu user tồn tại và mật khẩu khớp
      const historyLogin = {
        userId: user.id,
        loginSuccess: true,
        ipAddress: userIp
      };
    
      this.loginHistoryRepository.create(historyLogin);
    
      const payload = { email: loginDTO.email };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }
  }
  
  

  async authentication(token: string, userId: string): Promise<void> {
    const tokenUser = await this.tokenRepository.findToken(token);

    if (!tokenUser || Date.now() > new Date(tokenUser.expiresAt).getTime() || userId !== tokenUser.userId || token !== tokenUser.token) {
      throw new UnauthorizedException('Xác thực thất bại vui lòng thử lại sau!');
    }

    const user = await this.userRepository.findByID(userId);
    if (!user) {
      throw new UnauthorizedException('Người dùng không tồn tại!');
    }

    user.isActive = true;
    await this.userRepository.update(user);
  }
}
