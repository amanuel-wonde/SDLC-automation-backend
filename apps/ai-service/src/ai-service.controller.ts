import { Controller } from '@nestjs/common';
import { MessagePattern, EventPattern } from '@nestjs/microservices';
import { AiServiceService } from './ai-service.service';

@Controller()
export class AiServiceController {
  constructor(private readonly aiServiceService: AiServiceService) {}

  @MessagePattern({ cmd: 'health_check' })
  healthCheck() {
    return this.aiServiceService.healthCheck();
  }

  @MessagePattern({ cmd: 'chat' })
  chat(data: { message: string; projectId?: string }) {
    console.log('Chat data:', data);
    return this.aiServiceService.chat(data.message, data.projectId);
  }

  @MessagePattern({ cmd: 'get_context' })
  getContext(data: { sourceId: string; sourceType: string }) {
    return this.aiServiceService.getContext(data.sourceId, data.sourceType);
  }

  @MessagePattern({ cmd: 'upsert_context' })
  upsertContext(data: {
    sourceId: string;
    sourceType: string;
    content: string;
  }) {
    return this.aiServiceService.upsertContext(data);
  }

  @EventPattern('task_created')
  handleTaskCreated(data: {
    projectId: string;
    taskId: string;
    title: string;
    description?: string;
  }) {
    return this.aiServiceService.handleTaskCreated(data);
  }
}
