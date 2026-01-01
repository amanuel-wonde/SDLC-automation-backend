import { Body, Controller, Inject, Post, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegisterDto, LoginDto } from '@app/common';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 409, description: 'Conflict: Email already exists.' })
  register(@Body() registerDto: RegisterDto) {
    this.logger.log('Publishing to AUTH_SERVICE: register');
    this.logger.log('Subscribing to AUTH_SERVICE response');
    return this.authClient.send({ cmd: 'register' }, registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Successfully logged in.' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized: Invalid credentials.',
  })
  login(@Body() loginDto: LoginDto) {
    this.logger.log('Publishing to AUTH_SERVICE: login');
    this.logger.log('Subscribing to AUTH_SERVICE response');
    return this.authClient.send({ cmd: 'login' }, loginDto);
  }
}
