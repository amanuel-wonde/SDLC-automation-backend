import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ProjectService } from './services/project.service';
import { MemberService } from './services/member.service';
import { TaskService } from './services/task.service';
import {
  CreateProjectDto,
  UpdateProjectDto,
  AddMemberDto,
  UpdateMemberRoleDto,
  CreateTaskDto,
  UpdateTaskDto,
} from '@app/common';

@Controller()
export class ProjectController {
  private readonly logger = new Logger(ProjectController.name);
  constructor(
    private readonly projectService: ProjectService,
    private readonly memberService: MemberService,
    private readonly taskService: TaskService,
  ) {}

  // Project operations
  @MessagePattern({ cmd: 'create_project' })
  async createProject(data: { userId: string; dto: CreateProjectDto }) {
    this.logger.log('Subscribing to cmd: create_project');
    this.logger.log('Publishing response');
    return this.projectService.createProject(data.userId, data.dto);
  }

  @MessagePattern({ cmd: 'get_user_projects' })
  async getUserProjects(data: { userId: string }) {
    this.logger.log('Subscribing to cmd: get_user_projects');
    this.logger.log('Publishing response');
    return this.projectService.getUserProjects(data.userId);
  }

  @MessagePattern({ cmd: 'get_project' })
  async getProject(data: { projectId: string; userId: string }) {
    this.logger.log('Subscribing to cmd: get_project');
    this.logger.log('Publishing response');
    return this.projectService.getProject(data.projectId, data.userId);
  }

  @MessagePattern({ cmd: 'update_project' })
  async updateProject(data: {
    projectId: string;
    userId: string;
    dto: UpdateProjectDto;
  }) {
    this.logger.log('Subscribing to cmd: update_project');
    this.logger.log('Publishing response');
    return this.projectService.updateProject(
      data.projectId,
      data.userId,
      data.dto,
    );
  }

  @MessagePattern({ cmd: 'delete_project' })
  async deleteProject(data: { projectId: string; userId: string }) {
    this.logger.log('Subscribing to cmd: delete_project');
    this.logger.log('Publishing response');
    return this.projectService.deleteProject(data.projectId, data.userId);
  }

  // Member operations
  @MessagePattern({ cmd: 'add_member' })
  async addMember(data: {
    projectId: string;
    userId: string;
    dto: AddMemberDto;
  }) {
    this.logger.log('Subscribing to cmd: add_member');
    this.logger.log('Publishing response');
    return this.memberService.addMember(data.projectId, data.userId, data.dto);
  }

  @MessagePattern({ cmd: 'get_members' })
  async getMembers(data: { projectId: string; userId: string }) {
    this.logger.log('Subscribing to cmd: get_members');
    this.logger.log('Publishing response');
    return this.memberService.getMembers(data.projectId, data.userId);
  }

  @MessagePattern({ cmd: 'update_member_role' })
  async updateMemberRole(data: {
    projectId: string;
    targetUserId: string;
    requesterId: string;
    dto: UpdateMemberRoleDto;
  }) {
    this.logger.log('Subscribing to cmd: update_member_role');
    this.logger.log('Publishing response');
    return this.memberService.updateMemberRole(
      data.projectId,
      data.targetUserId,
      data.requesterId,
      data.dto,
    );
  }

  @MessagePattern({ cmd: 'remove_member' })
  async removeMember(data: {
    projectId: string;
    targetUserId: string;
    requesterId: string;
  }) {
    this.logger.log('Subscribing to cmd: remove_member');
    this.logger.log('Publishing response');
    return this.memberService.removeMember(
      data.projectId,
      data.targetUserId,
      data.requesterId,
    );
  }

  // Task operations
  @MessagePattern({ cmd: 'create_task' })
  async createTask(data: {
    projectId: string;
    userId: string;
    dto: CreateTaskDto;
  }) {
    this.logger.log('Subscribing to cmd: create_task');
    this.logger.log('Publishing response');
    return this.taskService.createTask(data.projectId, data.userId, data.dto);
  }

  @MessagePattern({ cmd: 'get_project_tasks' })
  async getProjectTasks(data: { projectId: string; userId: string }) {
    this.logger.log('Subscribing to cmd: get_project_tasks');
    this.logger.log('Publishing response');
    return this.taskService.getProjectTasks(data.projectId, data.userId);
  }

  @MessagePattern({ cmd: 'update_task' })
  async updateTask(data: {
    taskId: string;
    userId: string;
    dto: UpdateTaskDto;
  }) {
    this.logger.log('Subscribing to cmd: update_task');
    this.logger.log('Publishing response');
    return this.taskService.updateTask(data.taskId, data.userId, data.dto);
  }

  @MessagePattern({ cmd: 'delete_task' })
  async deleteTask(data: { taskId: string; userId: string }) {
    this.logger.log('Subscribing to cmd: delete_task');
    this.logger.log('Publishing response');
    return this.taskService.deleteTask(data.taskId, data.userId);
  }
}
