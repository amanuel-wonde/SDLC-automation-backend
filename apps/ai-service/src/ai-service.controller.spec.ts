import { Test, TestingModule } from '@nestjs/testing';
import { AiServiceController } from './ai-service.controller';
import { AiServiceService } from './ai-service.service';

describe('AiServiceController', () => {
  let aiServiceController: AiServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AiServiceController],
      providers: [AiServiceService],
    }).compile();

    aiServiceController = app.get<AiServiceController>(AiServiceController);
  });

  describe('healthCheck', () => {
    it('should return "AI Service is up and running"', () => {
      expect(aiServiceController.healthCheck()).toBe(
        'AI Service is up and running',
      );
    });
  });
});
