import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('AI')
@Controller('ai')
export class AiController {
  private readonly logger = new Logger(AiController.name);
  constructor(@Inject('AI_SERVICE') private readonly aiClient: ClientProxy) {}

  @Get('health')
  @ApiOperation({ summary: 'Check AI Service health' })
  @ApiResponse({ status: 200, description: 'AI Service is up and running.' })
  checkHealth() {
    this.logger.log('Publishing to AI_SERVICE: health_check');
    this.logger.log('Subscribing to AI_SERVICE response');
    return this.aiClient.send({ cmd: 'health_check' }, {});
  }

  @Post('chat')
  @ApiOperation({ summary: 'Chat with AI' })
  @ApiResponse({ status: 201, description: 'Message processed.' })
  chat(@Body() body: { message: string; projectId?: string }) {
    this.logger.log('Publishing to AI_SERVICE: chat');
    this.logger.log('Subscribing to AI_SERVICE response');
    return this.aiClient.send({ cmd: 'chat' }, body);
  }

  @Get('context/:sourceType/:sourceId')
  @ApiOperation({ summary: 'Get AI context' })
  @ApiResponse({ status: 200, description: 'Context retrieved.' })
  getContext(
    @Param('sourceType') sourceType: string,
    @Param('sourceId') sourceId: string,
  ) {
    this.logger.log('Publishing to AI_SERVICE: get_context');
    this.logger.log('Subscribing to AI_SERVICE response');
    return this.aiClient.send({ cmd: 'get_context' }, { sourceId, sourceType });
  }

  @Post('context')
  @ApiOperation({ summary: 'Upsert AI context' })
  @ApiResponse({ status: 201, description: 'Context saved.' })
  upsertContext(
    @Body() body: { sourceId: string; sourceType: string; content: string },
  ) {
    this.logger.log('Publishing to AI_SERVICE: upsert_context');
    this.logger.log('Subscribing to AI_SERVICE response');
    return this.aiClient.send({ cmd: 'upsert_context' }, body);
  }

  @Delete('context/:id')
  @ApiOperation({ summary: 'Delete AI context' })
  @ApiResponse({ status: 200, description: 'Context deleted.' })
  deleteContext(@Param('id') id: string) {
    this.logger.log('Publishing to AI_SERVICE: delete_context');
    this.logger.log('Subscribing to AI_SERVICE response');
    return this.aiClient.send({ cmd: 'delete_context' }, { id });
  }
}
