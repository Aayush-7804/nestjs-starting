import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/task.dto';
import { Task } from './task.entity';
import { TaskStatus } from './taskStatus.enum';
import { Repository } from 'typeorm';
import { GetTaskFilterDto } from './dto/filter.dto';
import { AuthUser } from 'src/auth/auth.entity';
import { Logger } from '@nestjs/common';
@Injectable()
export class TasksService {
  private readonly logger = new Logger('TaskService', { timestamp: true });
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async getAllTask(
    getTaskFilterDto: GetTaskFilterDto,
    user: AuthUser,
  ): Promise<Task[]> {
    const { status, search } = getTaskFilterDto;
    const query = this.taskRepository.createQueryBuilder('task');
    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    try {
      const task = await query.getMany();
      return task;
    } catch (error) {
      this.logger.error('Failed', error.stack);
      throw new InternalServerErrorException();
    }
  }

  async getTaskById(id: string, user: AuthUser): Promise<Task> {
    const found = await this.taskRepository.findOne({ where: { id, user } });

    if (!found) {
      throw new NotFoundException(`Task at id:${id} not found`);
    }

    return found;
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    user: AuthUser,
  ): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    await this.taskRepository.save(task);
    return task;
  }

  async updateStatus(id: string, status: TaskStatus, user: AuthUser) {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await this.taskRepository.save(task);
    return task;
  }

  async deleteTask(id: string, user: AuthUser) {
    const tasks = await this.taskRepository.delete({ id, user });

    if (tasks.affected === 0) {
      throw new NotFoundException(`there is no Task at id:${id}.`);
    } else {
      return {
        message: `Task with id:${id} Deleted.`,
        statusCode: 202,
      };
    }
  }
}
