import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTaskDto, UpdateTaskDto } from '@app/common';
import { ProjectService } from './project.service';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class TaskService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly projectService: ProjectService,
    @Inject('AI_SERVICE') private readonly aiClient: ClientProxy,
  ) {}

  async createTask(projectId: string, userId: string, dto: CreateTaskDto) {
    // Check if user is a member
    await this.projectService.checkIsMember(projectId, userId);

    const task = await this.prisma.task.create({
      data: {
        projectId,
        title: dto.title,
        description: dto.description,
        assignedToId: dto.assignedToId,
        priority: dto.priority || 'MEDIUM',
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      },
    });

    // Notify AI service to update context
    console.log('Notify AI Service about the task creation...');
    this.aiClient.emit('task_created', {
      projectId,
      taskId: task.id,
      title: task.title,
      description: task.description,
    });

    return task;
  }

  async getProjectTasks(projectId: string, userId: string) {
    // Check if user is a member
    await this.projectService.checkIsMember(projectId, userId);

    const tasks = await this.prisma.task.findMany({
      where: { projectId },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return tasks;
  }

  async updateTask(taskId: string, userId: string, dto: UpdateTaskDto) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Check if user is a member of the project
    await this.projectService.checkIsMember(task.projectId, userId);

    const updated = await this.prisma.task.update({
      where: { id: taskId },
      data: {
        ...dto,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
    });

    return updated;
  }

  async deleteTask(taskId: string, userId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Check if user can modify the project
    await this.projectService.checkCanModify(task.projectId, userId);

    await this.prisma.task.delete({
      where: { id: taskId },
    });

    return { message: 'Task deleted successfully' };
  }
}
