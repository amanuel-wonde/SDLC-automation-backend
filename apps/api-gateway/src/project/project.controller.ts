import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CreateProjectDto,
  UpdateProjectDto,
  AddMemberDto,
  UpdateMemberRoleDto,
  CreateTaskDto,
  UpdateTaskDto,
} from '@app/common';

@ApiTags('Projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectController {
  private readonly logger = new Logger(ProjectController.name);
  constructor(
    @Inject('PROJECT_SERVICE') private readonly projectClient: ClientProxy,
  ) {}

  // Project endpoints
  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project created successfully.' })
  createProject(@Request() req, @Body() dto: CreateProjectDto) {
    this.logger.log('Publishing to PROJECT_SERVICE: create_project');
    this.logger.log('Subscribing to PROJECT_SERVICE response');
    return this.projectClient.send(
      { cmd: 'create_project' },
      { userId: req.user.sub, dto },
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Projects retrieved successfully.' })
  getUserProjects(@Request() req) {
    this.logger.log('Publishing to PROJECT_SERVICE: get_user_projects');
    this.logger.log('Subscribing to PROJECT_SERVICE response');
    return this.projectClient.send(
      { cmd: 'get_user_projects' },
      { userId: req.user.sub },
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project by ID' })
  @ApiResponse({ status: 200, description: 'Project retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  @ApiResponse({ status: 403, description: 'Access denied.' })
  getProject(@Request() req, @Param('id') projectId: string) {
    this.logger.log('Publishing to PROJECT_SERVICE: get_project');
    this.logger.log('Subscribing to PROJECT_SERVICE response');
    return this.projectClient.send(
      { cmd: 'get_project' },
      { projectId, userId: req.user.sub },
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update project' })
  @ApiResponse({ status: 200, description: 'Project updated successfully.' })
  @ApiResponse({ status: 403, description: 'Access denied.' })
  updateProject(
    @Request() req,
    @Param('id') projectId: string,
    @Body() dto: UpdateProjectDto,
  ) {
    this.logger.log('Publishing to PROJECT_SERVICE: update_project');
    this.logger.log('Subscribing to PROJECT_SERVICE response');
    return this.projectClient.send(
      { cmd: 'update_project' },
      { projectId, userId: req.user.sub, dto },
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete project (owner only)' })
  @ApiResponse({ status: 200, description: 'Project deleted successfully.' })
  @ApiResponse({ status: 403, description: 'Only owner can delete.' })
  deleteProject(@Request() req, @Param('id') projectId: string) {
    this.logger.log('Publishing to PROJECT_SERVICE: delete_project');
    this.logger.log('Subscribing to PROJECT_SERVICE response');
    return this.projectClient.send(
      { cmd: 'delete_project' },
      { projectId, userId: req.user.sub },
    );
  }

  // Member endpoints
  @Post(':id/members')
  @ApiOperation({ summary: 'Add member to project' })
  @ApiResponse({ status: 201, description: 'Member added successfully.' })
  @ApiResponse({ status: 403, description: 'Access denied.' })
  addMember(
    @Request() req,
    @Param('id') projectId: string,
    @Body() dto: AddMemberDto,
  ) {
    this.logger.log('Publishing to PROJECT_SERVICE: add_member');
    this.logger.log('Subscribing to PROJECT_SERVICE response');
    return this.projectClient.send(
      { cmd: 'add_member' },
      { projectId, userId: req.user.sub, dto },
    );
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'Get project members' })
  @ApiResponse({ status: 200, description: 'Members retrieved successfully.' })
  getMembers(@Request() req, @Param('id') projectId: string) {
    this.logger.log('Publishing to PROJECT_SERVICE: get_members');
    this.logger.log('Subscribing to PROJECT_SERVICE response');
    return this.projectClient.send(
      { cmd: 'get_members' },
      { projectId, userId: req.user.sub },
    );
  }

  @Patch(':id/members/:userId')
  @ApiOperation({ summary: 'Update member role' })
  @ApiResponse({
    status: 200,
    description: 'Member role updated successfully.',
  })
  @ApiResponse({ status: 403, description: 'Access denied.' })
  updateMemberRole(
    @Request() req,
    @Param('id') projectId: string,
    @Param('userId') targetUserId: string,
    @Body() dto: UpdateMemberRoleDto,
  ) {
    this.logger.log('Publishing to PROJECT_SERVICE: update_member_role');
    this.logger.log('Subscribing to PROJECT_SERVICE response');
    return this.projectClient.send(
      { cmd: 'update_member_role' },
      { projectId, targetUserId, requesterId: req.user.sub, dto },
    );
  }

  @Delete(':id/members/:userId')
  @ApiOperation({ summary: 'Remove member from project' })
  @ApiResponse({ status: 200, description: 'Member removed successfully.' })
  @ApiResponse({ status: 403, description: 'Access denied.' })
  removeMember(
    @Request() req,
    @Param('id') projectId: string,
    @Param('userId') targetUserId: string,
  ) {
    this.logger.log('Publishing to PROJECT_SERVICE: remove_member');
    this.logger.log('Subscribing to PROJECT_SERVICE response');
    return this.projectClient.send(
      { cmd: 'remove_member' },
      { projectId, targetUserId, requesterId: req.user.sub },
    );
  }

  // Task endpoints
  @Post(':id/tasks')
  @ApiOperation({ summary: 'Create task in project' })
  @ApiResponse({ status: 201, description: 'Task created successfully.' })
  createTask(
    @Request() req,
    @Param('id') projectId: string,
    @Body() dto: CreateTaskDto,
  ) {
    this.logger.log('Publishing to PROJECT_SERVICE: create_task');
    this.logger.log('Subscribing to PROJECT_SERVICE response');
    return this.projectClient.send(
      { cmd: 'create_task' },
      { projectId, userId: req.user.sub, dto },
    );
  }

  @Get(':id/tasks')
  @ApiOperation({ summary: 'Get all tasks in project' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully.' })
  getProjectTasks(@Request() req, @Param('id') projectId: string) {
    this.logger.log('Publishing to PROJECT_SERVICE: get_project_tasks');
    this.logger.log('Subscribing to PROJECT_SERVICE response');
    return this.projectClient.send(
      { cmd: 'get_project_tasks' },
      { projectId, userId: req.user.sub },
    );
  }
}

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TaskController {
  private readonly logger = new Logger(TaskController.name);
  constructor(
    @Inject('PROJECT_SERVICE') private readonly projectClient: ClientProxy,
  ) {}

  @Patch(':id')
  @ApiOperation({ summary: 'Update task' })
  @ApiResponse({ status: 200, description: 'Task updated successfully.' })
  updateTask(
    @Request() req,
    @Param('id') taskId: string,
    @Body() dto: UpdateTaskDto,
  ) {
    this.logger.log('Publishing to PROJECT_SERVICE: update_task');
    this.logger.log('Subscribing to PROJECT_SERVICE response');
    return this.projectClient.send(
      { cmd: 'update_task' },
      { taskId, userId: req.user.sub, dto },
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete task' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully.' })
  deleteTask(@Request() req, @Param('id') taskId: string) {
    this.logger.log('Publishing to PROJECT_SERVICE: delete_task');
    this.logger.log('Subscribing to PROJECT_SERVICE response');
    return this.projectClient.send(
      { cmd: 'delete_task' },
      { taskId, userId: req.user.sub },
    );
  }
}
