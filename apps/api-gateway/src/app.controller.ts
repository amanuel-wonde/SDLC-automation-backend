import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@ApiTags('Test')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('test-auth')
  async testAuth() {
    console.log('Auth Service: Test Auth endpoint hitted');
    return this.authClient.send({ cmd: 'test_auth' }, { name: 'Amanuel' });
  }
}
