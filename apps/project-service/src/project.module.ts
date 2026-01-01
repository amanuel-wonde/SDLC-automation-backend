import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProjectController } from './project.controller';
import { PrismaService } from './prisma.service';
import { ProjectService } from './services/project.service';
import { MemberService } from './services/member.service';
import { TaskService } from './services/task.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AI_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6379,
        },
      },
    ]),
  ],
  controllers: [ProjectController],
  providers: [PrismaService, ProjectService, MemberService, TaskService],
})
export class ProjectModule {}
