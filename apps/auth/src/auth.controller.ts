import { Controller, Get, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RegisterDto, LoginDto } from '@app/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @Get()
  getHello(): string {
    return this.authService.getHello();
  }

  @MessagePattern({ cmd: 'test_auth' })
  testAuth(data: any) {
    this.logger.log('Subscribing to cmd: test_auth');
    this.logger.log('Publishing response');
    return { message: 'Auth Service is Alive!', receivedData: data };
  }

  @MessagePattern({ cmd: 'register' })
  async register(data: any) {
    this.logger.log('Subscribing to cmd: register');
    this.logger.log('Publishing response');
    return this.authService.register(data);
  }

  @MessagePattern({ cmd: 'login' })
  async login(data: any) {
    this.logger.log('Subscribing to cmd: login');
    this.logger.log('Publishing response');
    return this.authService.login(data);
  }
}
