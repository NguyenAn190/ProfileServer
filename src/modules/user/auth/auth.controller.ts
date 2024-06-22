import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post } from '@nestjs/common';
import { RegisterDTO } from 'src/modules/user/auth/dto/register.dto';
import { AuthService } from 'src/modules/user/auth/auth.service';
import { ApiTags } from '@nestjs/swagger';
import { create } from 'domain';
import { ResponseObject } from 'src/share/global/response.object';

@ApiTags('users/auth')
@Controller('api/v1/')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('users/register')
  async register(@Body() registerDTO: RegisterDTO) : Promise<ResponseObject<any>> {
    return this.authService.register(registerDTO);
  }
}
