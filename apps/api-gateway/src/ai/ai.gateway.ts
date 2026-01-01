import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AiGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('AiGateway');

  constructor(@Inject('AI_SERVICE') private readonly aiClient: ClientProxy) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('chat_message')
  async handleMessage(
    @MessageBody() data: { message: string; projectId?: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(
      `Message received from ${client.id}: ${data.message} (Project: ${data.projectId || 'None'})`,
    );

    try {
      // Delegate to AI microservice
      const response = await firstValueFrom(
        this.aiClient.send(
          { cmd: 'chat' },
          {
            message: data.message,
            projectId: data.projectId,
          },
        ),
      );

      client.emit('chat_response', response);
    } catch (error) {
      this.logger.error('Error delegating to AI service:', error);
      client.emit('chat_response', {
        response: 'Sorry, the AI service is currently unavailable.',
        timestamp: new Date().toISOString(),
      });
    }
  }
}
