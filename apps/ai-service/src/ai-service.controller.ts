import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, EventPattern } from '@nestjs/microservices';
import { AiServiceService } from './ai-service.service';

@Controller()
export class AiServiceController {
  private readonly logger = new Logger(AiServiceController.name);
  constructor(private readonly aiServiceService: AiServiceService) {}

  @MessagePattern({ cmd: 'health_check' })
  healthCheck() {
    this.logger.log('Subscribing to cmd: health_check');
    this.logger.log('Publishing response');
    return this.aiServiceService.healthCheck();
  }

  @MessagePattern({ cmd: 'chat' })
  chat(data: { message: string; projectId?: string }) {
    this.logger.log('Subscribing to cmd: chat');
    this.logger.log('Publishing response');
    return this.aiServiceService.chat(data.message, data.projectId);
  }

  @MessagePattern({ cmd: 'get_context' })
  getContext(data: { sourceId: string; sourceType: string }) {
    this.logger.log('Subscribing to cmd: get_context');
    this.logger.log('Publishing response');
    return this.aiServiceService.getContext(data.sourceId, data.sourceType);
  }

  @MessagePattern({ cmd: 'upsert_context' })
  upsertContext(data: {
    sourceId: string;
    sourceType: string;
    content: string;
  }) {
    this.logger.log('Subscribing to cmd: upsert_context');
    this.logger.log('Publishing response');
    return this.aiServiceService.upsertContext(data);
  }

  @EventPattern('task_created')
  handleTaskCreated(data: {
    projectId: string;
    taskId: string;
    title: string;
    description?: string;
  }) {
    this.logger.log('Subscribing to event: task_created');
    return this.aiServiceService.handleTaskCreated(data);
  }
}
