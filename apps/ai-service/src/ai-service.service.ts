import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import { PrismaService } from './prisma.service';

@Injectable()
export class AiServiceService implements OnModuleInit {
  private genAI: GoogleGenAI;
  private readonly logger = new Logger(AiServiceService.name);

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_KEY');
    this.logger.log(`GEMINI_KEY is ${apiKey ? 'defined' : 'NOT defined'}`);
    this.genAI = new GoogleGenAI({
      apiKey: apiKey || 'dummy_key',
      apiVersion: 'v1beta',
    });
  }

  async onModuleInit() {
    await this.checkModels();
  }

  async checkModels() {
    try {
      this.logger.log('Probing Gemini API...');
      await this.genAI.models.list();
      this.logger.log('Successfully connected to Gemini API.');
    } catch (error: any) {
      this.logger.error('Error probing Gemini API:', error.message);
    }
  }

  healthCheck() {
    return 'AI Service is up and running';
  }

  // Context Management
  async getContext(sourceId: string, sourceType: string) {
    return this.prisma.aiContext.findUnique({
      where: { sourceId_sourceType: { sourceId, sourceType } },
    });
  }

  async upsertContext(dto: {
    sourceId: string;
    sourceType: string;
    content: string;
  }) {
    return this.prisma.aiContext.upsert({
      where: {
        sourceId_sourceType: {
          sourceId: dto.sourceId,
          sourceType: dto.sourceType,
        },
      },
      update: { content: dto.content },
      create: {
        sourceId: dto.sourceId,
        sourceType: dto.sourceType,
        content: dto.content,
      },
    });
  }

  async deleteContext(id: string) {
    return this.prisma.aiContext.delete({
      where: { id },
    });
  }

  async chat(message: string, projectId?: string) {
    this.logger.log(`Received chat message: ${message.substring(0, 50)}...`);
    if (!message)
      return {
        response: 'Message is empty',
        timestamp: new Date().toISOString(),
      };

    try {
      let systemPrompt =
        'You are a helpful project management assistant. Ground your responses in the provided project context if available.';

      if (projectId) {
        const context = await this.getContext(projectId, 'PROJECT');
        if (context) {
          systemPrompt += `\n\nPROJECT CONTEXT:\n${context.content}`;
        }
      }

      const result = await this.genAI.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\nUser Message: ${message}` }],
          },
        ],
      });

      const responseText = result.text || 'No response from Gemini';
      this.logger.log('Successfully generated response from Gemini');

      return {
        response: responseText,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      this.logger.error('Gemini API Error:', error.message);
      if (error.response?.data) {
        this.logger.error(
          'Error Details:',
          JSON.stringify(error.response.data),
        );
      }

      return {
        response:
          'Sorry, I encountered an error while processing your request.',
        timestamp: new Date().toISOString(),
      };
    }
  }

  async handleTaskCreated(data: {
    projectId: string;
    taskId: string;
    title: string;
    description?: string;
  }) {
    this.logger.log(`Processing task_created for project: ${data.projectId}`);

    // 1. Get current context
    const context = await this.getContext(data.projectId, 'PROJECT');

    const taskInfo = `\n- TASK: ${data.title}${data.description ? ` (${data.description})` : ''} [ID: ${data.taskId}]`;

    let newContent = context?.content || 'PROJECT KNOWLEDGE BASE:';

    // 2. Append task info if not already present (basic check)
    if (!newContent.includes(data.taskId)) {
      if (!newContent.includes('TASKS:')) {
        newContent += '\n\nTASKS:';
      }
      newContent += taskInfo;

      // 3. Upsert context
      await this.upsertContext({
        sourceId: data.projectId,
        sourceType: 'PROJECT',
        content: newContent,
      });

      this.logger.log(
        `Knowledge Base updated for project ${data.projectId} with task ${data.taskId}`,
      );
    }
  }
}
