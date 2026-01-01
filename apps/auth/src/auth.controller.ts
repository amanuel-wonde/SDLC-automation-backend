import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RegisterDto, LoginDto } from '@app/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getHello(): string {
    return this.authService.getHello();
  }

  @MessagePattern({ cmd: 'test_auth' })
  testAuth(data: any) {
    return { message: 'Auth Service is Alive!', receivedData: data };
  }

  @MessagePattern({ cmd: 'register' })
  async register(data: any) {
    console.log('Auth Service: Register endpoint hitted');
    return this.authService.register(data);
  }

  @MessagePattern({ cmd: 'login' })
  async login(data: any) {
    console.log('Auth Service: Login endpoint hitted');
    return this.authService.login(data);
  }
}
