import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('AI')
@Controller('ai')
export class AiController {
  constructor(@Inject('AI_SERVICE') private readonly aiClient: ClientProxy) {}

  @Get('health')
  @ApiOperation({ summary: 'Check AI Service health' })
  @ApiResponse({ status: 200, description: 'AI Service is up and running.' })
  checkHealth() {
    return this.aiClient.send({ cmd: 'health_check' }, {});
  }

  @Post('chat')
  @ApiOperation({ summary: 'Chat with AI' })
  @ApiResponse({ status: 201, description: 'Message processed.' })
  chat(@Body() body: { message: string; projectId?: string }) {
    return this.aiClient.send({ cmd: 'chat' }, body);
  }

  @Get('context/:sourceType/:sourceId')
  @ApiOperation({ summary: 'Get AI context' })
  @ApiResponse({ status: 200, description: 'Context retrieved.' })
  getContext(
    @Param('sourceType') sourceType: string,
    @Param('sourceId') sourceId: string,
  ) {
    return this.aiClient.send({ cmd: 'get_context' }, { sourceId, sourceType });
  }

  @Post('context')
  @ApiOperation({ summary: 'Upsert AI context' })
  @ApiResponse({ status: 201, description: 'Context saved.' })
  upsertContext(
    @Body() body: { sourceId: string; sourceType: string; content: string },
  ) {
    return this.aiClient.send({ cmd: 'upsert_context' }, body);
  }

  @Delete('context/:id')
  @ApiOperation({ summary: 'Delete AI context' })
  @ApiResponse({ status: 200, description: 'Context deleted.' })
  deleteContext(@Param('id') id: string) {
    return this.aiClient.send({ cmd: 'delete_context' }, { id });
  }
}
