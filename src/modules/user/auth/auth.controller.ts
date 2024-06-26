import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RegisterDTO } from 'src/modules/user/auth/dto/register.dto';
import { AuthService } from 'src/modules/user/auth/auth.service';
import { ApiTags } from '@nestjs/swagger';
import { ResponseObject } from 'src/share/global/response.object';
import { LoginDTO } from 'src/modules/user/auth/dto/login.dto';
import { AuthGuard } from 'src/modules/user/auth/auth.guard';
import { Request } from 'express';
import { ChangePasswordDTO } from 'src/modules/user/auth/dto/change-password.dto';

@ApiTags('users/auth')
@Controller('api/v1/')
export class AuthController {
  constructor(private authService: AuthService) {}

  // kí tài khoản user
  @HttpCode(HttpStatus.CREATED)
  @Post('users/auth/register')
  async register(
    @Body() registerDTO: RegisterDTO,
  ): Promise<ResponseObject<any>> {
    return this.authService.register(registerDTO);
  }

  // đăng nhập với tài khoản user
  @HttpCode(HttpStatus.OK)
  @Post('users/auth/login')
  async login(@Body() loginDTO: LoginDTO, @Req() request: Request): Promise<{access_token: string}> {
    const userIp = request.ip;
    console.log(userIp)
    return this.authService.login(loginDTO, userIp);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get('users/auth/profile/:id')
  async profile(@Param() id: number): Promise<ResponseObject<any>> {
    return new ResponseObject(HttpStatus.OK, 'User profile retrieved successfully', null);
  }
  
  @HttpCode(HttpStatus.OK)
  @Get('users/auth/authentication/:token/:userId')
  async authentication(@Param("token") token: string, @Param("userId") userId: string): Promise <ResponseObject<any>> {
    await this.authService.authentication(token, userId);
    return new ResponseObject(HttpStatus.OK, 'User authentication successfully', null);
  }

  @HttpCode(HttpStatus.OK)
  @Get("users/auth/sendEmailForgotPassword")
  async sendEmailForgotPassword(@Query("email") email: string): Promise <ResponseObject<any>> {
    await this.authService.sendEmailForgotPassword(email);
    return new ResponseObject(HttpStatus.OK, 'User authentication successfully', null);
  }

  @HttpCode(HttpStatus.OK)
  @Get('users/auth/checkEmailForgotPassword/:token/:userId')
  async checkEmailForgotPassword(@Param("token") token: string, @Param("userId") userId: string): Promise <ResponseObject<any>> {
    await this.authService.checkEmailForgotPassword(token, userId);
    return new ResponseObject(HttpStatus.OK, 'User authentication successfully', null);
  }

  @HttpCode(HttpStatus.OK)
  @Post('users/auth/changePassword')
  async changePassword(@Body() changePasswordDTO: ChangePasswordDTO) {
    await this.authService.changePassword(changePasswordDTO.userId, changePasswordDTO.password);
    return new ResponseObject(HttpStatus.OK, 'Đổi mật khẩu thành công', null);    
  }
}
