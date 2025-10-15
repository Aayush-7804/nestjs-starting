import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/task.dto';
import { GetTaskFilterDto } from './dto/filter.dto';
import { Task } from './entity/task.entity';
import { TaskStatus } from './taskStatus.enum';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  async getAllTask(
    @Query() getTaskFilterDto: GetTaskFilterDto,
  ): Promise<Task[]> {
    return await this.taskService.getAllTask(getTaskFilterDto);
  }

  @Get('/:id')
  async getTaskById(@Param('id') id: string): Promise<Task> {
    return await this.taskService.getTaskById(id);
  }

  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.taskService.createTask(createTaskDto);
  }

  @Patch('/:id/status')
  async updateTaskStatus(
    @Param('id') id: string,
    @Body('status') updateTaskStatusDto: TaskStatus,
  ) {
    return await this.taskService.updateStatus(id, updateTaskStatusDto);
  }

  @Delete('/:id')
  async deleteTask(@Param('id') id: string) {
    return await this.taskService.deleteTask(id);
  }
}
