import { Injectable } from '@nestjs/common';
import { IsString, IsEmail, IsNotEmpty, MinLength, IsEnum, IsOptional, MaxLength, Matches } from 'class-validator';
import { AuthProvider } from 'src/share/enum/auth.provider.enum';
import { Role } from 'src/share/enum/role.enum';

export class RegisterDTO {
  @IsString({ message: 'Tên phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Tên không được để trống' })
  name: string;

  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsString({ message: 'Số điện thoại phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @MinLength(10, { message: 'Số điện thoại phải có ít nhất 10 chữ số' })
  @MaxLength(11, { message: 'Số điện thoại không được quá 11 chữ số' })
  @Matches(/^[0][0-9]{9,10}$/, {
    message: 'Số điện thoại không hợp lệ. Số điện thoại phải bắt đầu bằng số 0 và có 10 hoặc 11 chữ số',
  })
  phone: string;

  @IsString({ message: 'Mật khẩu phải là chuỗi ký tự' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;

  @IsEnum(Role, { message: 'Vai trò không hợp lệ' })
  @IsOptional()
  role?: Role = Role.USER;

  @IsEnum(AuthProvider, { message: 'Nhà cung cấp xác thực không hợp lệ' })
  @IsOptional()
  authProvider?: AuthProvider = AuthProvider.ACCOUNT;
}

