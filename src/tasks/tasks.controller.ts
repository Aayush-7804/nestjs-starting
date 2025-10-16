import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/task.dto';
import { GetTaskFilterDto } from './dto/filter.dto';
import { Task } from './task.entity';
import { TaskStatus } from './taskStatus.enum';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from 'src/auth/auth.entity';
import { GetUser } from 'src/auth/user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  async getAllTask(
    @Query() getTaskFilterDto: GetTaskFilterDto,
    @GetUser() user: AuthUser,
  ): Promise<Task[]> {
    return await this.taskService.getAllTask(getTaskFilterDto, user);
  }

  @Get('/:id')
  async getTaskById(
    @Param('id') id: string,
    @GetUser() user: AuthUser,
  ): Promise<Task> {
    return await this.taskService.getTaskById(id, user);
  }

  @Post()
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: AuthUser,
  ): Promise<Task> {
    return await this.taskService.createTask(createTaskDto, user);
  }

  @Patch('/:id/status')
  async updateTaskStatus(
    @Param('id') id: string,
    @Body('status') updateTaskStatusDto: TaskStatus,
    @GetUser() user: AuthUser,
  ) {
    return await this.taskService.updateStatus(id, updateTaskStatusDto, user);
  }

  @Delete('/:id')
  async deleteTask(@Param('id') id: string, @GetUser() user: AuthUser) {
    return await this.taskService.deleteTask(id, user);
  }
}
