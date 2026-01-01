import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth/auth.controller';
import {
  ProjectController,
  TaskController,
} from './project/project.controller';
import { JwtModule } from '@nestjs/jwt';
import { AiController } from './ai/ai.controller';
import { AiGateway } from './ai/ai.gateway';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6379,
        },
      },
      {
        name: 'PROJECT_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6379,
        },
      },
      {
        name: 'AI_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6379,
        },
      },
    ]),
    JwtModule.register({
      secret: 'SECRET_KEY', // Must match Auth service
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [
    AppController,
    AuthController,
    ProjectController,
    TaskController,
    AiController,
  ],
  providers: [AppService, AiGateway],
})
export class AppModule {}
