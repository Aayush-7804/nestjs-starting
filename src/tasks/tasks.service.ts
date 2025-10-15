import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/task.dto';
import { Task } from './entity/task.entity';
import { TaskStatus } from './taskStatus.enum';
import { Repository } from 'typeorm';
import { GetTaskFilterDto } from './dto/filter.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) // Use Task entity directly
    private taskRepository: Repository<Task>,
  ) {}

  async getAllTask(getTaskFilterDto: GetTaskFilterDto): Promise<Task[]> {
    const { status, search } = getTaskFilterDto;
    const query = this.taskRepository.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    const task = await query.getMany();
    return task;
  }

  async getTaskById(id: string): Promise<Task> {
    const found = await this.taskRepository.findOne({ where: { id } });

    if (!found) {
      throw new NotFoundException(`Task at id:${id} not found`);
    }

    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.taskRepository.save(task);
    return task;
  }

  async updateStatus(id: string, status: TaskStatus) {
    const task = await this.getTaskById(id);
    task.status = status;
    await this.taskRepository.save(task);
    return task;
  }

  async deleteTask(id: string) {
    const tasks = await this.taskRepository.delete(id);

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
