import { Injectable } from '@nestjs/common';
import { IsString, IsEmail, IsNotEmpty, MinLength, IsEnum, IsOptional, MaxLength, Matches } from 'class-validator';
import { AuthProvider } from 'src/share/enum/auth.provider.enum';
import { Role } from 'src/share/enum/role.enum';

export class RegisterDTO {
  @IsString({ message: 'Tên phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Tên không được để trống' })
  fullname: string;

  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsString({ message: 'Mật khẩu phải là chuỗi ký tự' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;
}

