import {
  Injectable,
  ForbiddenException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AddMemberDto, UpdateMemberRoleDto } from '@app/common';
import { ProjectService } from './project.service';

@Injectable()
export class MemberService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly projectService: ProjectService,
  ) {}

  async addMember(projectId: string, userId: string, dto: AddMemberDto) {
    // Check if requester can modify
    await this.projectService.checkCanModify(projectId, userId);

    // Check if user is already a member
    const existing = await this.prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: dto.userId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('User is already a member of this project');
    }

    const member = await this.prisma.projectMember.create({
      data: {
        projectId,
        userId: dto.userId,
        role: dto.role,
      },
    });

    return member;
  }

  async getMembers(projectId: string, userId: string) {
    // Check if user is a member
    await this.projectService.checkIsMember(projectId, userId);

    const members = await this.prisma.projectMember.findMany({
      where: { projectId },
      orderBy: {
        joinedAt: 'asc',
      },
    });

    return members;
  }

  async updateMemberRole(
    projectId: string,
    targetUserId: string,
    requesterId: string,
    dto: UpdateMemberRoleDto,
  ) {
    // Check if requester can modify
    await this.projectService.checkCanModify(projectId, requesterId);

    // Cannot change owner role
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.ownerId === targetUserId) {
      throw new ForbiddenException(
        'Cannot change the role of the project owner',
      );
    }

    const member = await this.prisma.projectMember.update({
      where: {
        projectId_userId: {
          projectId,
          userId: targetUserId,
        },
      },
      data: {
        role: dto.role,
      },
    });

    return member;
  }

  async removeMember(
    projectId: string,
    targetUserId: string,
    requesterId: string,
  ) {
    // Check if requester can modify
    await this.projectService.checkCanModify(projectId, requesterId);

    // Cannot remove owner
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.ownerId === targetUserId) {
      throw new ForbiddenException('Cannot remove the project owner');
    }

    await this.prisma.projectMember.delete({
      where: {
        projectId_userId: {
          projectId,
          userId: targetUserId,
        },
      },
    });

    return { message: 'Member removed successfully' };
  }
}
