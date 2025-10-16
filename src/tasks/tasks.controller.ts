import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
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
  private readonly logger = new Logger('TaskController');

  constructor(private readonly taskService: TasksService) {}

  @Get()
  async getAllTask(
    @Query() getTaskFilterDto: GetTaskFilterDto,
    @GetUser() user: AuthUser,
  ): Promise<Task[]> {
    this.logger.verbose(
      `All tasks of "${user.username}" are taken. with Filter: ${JSON.stringify(getTaskFilterDto)}`,
    );
    return await this.taskService.getAllTask(getTaskFilterDto, user);
  }

  @Get('/:id')
  async getTaskById(
    @Param('id') id: string,
    @GetUser() user: AuthUser,
  ): Promise<Task> {
    this.logger.verbose(`user "${user.username}" try to get task at id:${id}`);
    return await this.taskService.getTaskById(id, user);
  }

  @Post()
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: AuthUser,
  ): Promise<Task> {
    this.logger.verbose(
      `user "${user.username}" creating new Task. Task data:${JSON.stringify(createTaskDto)}`,
    );
    return await this.taskService.createTask(createTaskDto, user);
  }

  @Patch('/:id/status')
  async updateTaskStatus(
    @Param('id') id: string,
    @Body('status') updateTaskStatusDto: TaskStatus,
    @GetUser() user: AuthUser,
  ) {
    this.logger.verbose(
      `user "${user.username}" trying to update status of Task at id:${id}, to:${JSON.stringify(updateTaskStatusDto)}`,
    );
    return await this.taskService.updateStatus(id, updateTaskStatusDto, user);
  }

  @Delete('/:id')
  async deleteTask(@Param('id') id: string, @GetUser() user: AuthUser) {
    this.logger.verbose(`user "${user.username}" delete Task at id:${id}.`);
    return await this.taskService.deleteTask(id, user);
  }
}
