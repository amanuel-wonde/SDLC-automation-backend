import { Controller } from '@nestjs/common';
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
  constructor(
    private readonly projectService: ProjectService,
    private readonly memberService: MemberService,
    private readonly taskService: TaskService,
  ) {}

  // Project operations
  @MessagePattern({ cmd: 'create_project' })
  async createProject(data: { userId: string; dto: CreateProjectDto }) {
    return this.projectService.createProject(data.userId, data.dto);
  }

  @MessagePattern({ cmd: 'get_user_projects' })
  async getUserProjects(data: { userId: string }) {
    return this.projectService.getUserProjects(data.userId);
  }

  @MessagePattern({ cmd: 'get_project' })
  async getProject(data: { projectId: string; userId: string }) {
    return this.projectService.getProject(data.projectId, data.userId);
  }

  @MessagePattern({ cmd: 'update_project' })
  async updateProject(data: {
    projectId: string;
    userId: string;
    dto: UpdateProjectDto;
  }) {
    return this.projectService.updateProject(
      data.projectId,
      data.userId,
      data.dto,
    );
  }

  @MessagePattern({ cmd: 'delete_project' })
  async deleteProject(data: { projectId: string; userId: string }) {
    return this.projectService.deleteProject(data.projectId, data.userId);
  }

  // Member operations
  @MessagePattern({ cmd: 'add_member' })
  async addMember(data: {
    projectId: string;
    userId: string;
    dto: AddMemberDto;
  }) {
    return this.memberService.addMember(data.projectId, data.userId, data.dto);
  }

  @MessagePattern({ cmd: 'get_members' })
  async getMembers(data: { projectId: string; userId: string }) {
    return this.memberService.getMembers(data.projectId, data.userId);
  }

  @MessagePattern({ cmd: 'update_member_role' })
  async updateMemberRole(data: {
    projectId: string;
    targetUserId: string;
    requesterId: string;
    dto: UpdateMemberRoleDto;
  }) {
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
    return this.taskService.createTask(data.projectId, data.userId, data.dto);
  }

  @MessagePattern({ cmd: 'get_project_tasks' })
  async getProjectTasks(data: { projectId: string; userId: string }) {
    return this.taskService.getProjectTasks(data.projectId, data.userId);
  }

  @MessagePattern({ cmd: 'update_task' })
  async updateTask(data: {
    taskId: string;
    userId: string;
    dto: UpdateTaskDto;
  }) {
    return this.taskService.updateTask(data.taskId, data.userId, data.dto);
  }

  @MessagePattern({ cmd: 'delete_task' })
  async deleteTask(data: { taskId: string; userId: string }) {
    return this.taskService.deleteTask(data.taskId, data.userId);
  }
}
