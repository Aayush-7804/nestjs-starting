import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from './taskStatus.enum';
import { AuthUser } from 'src/auth/auth.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  title: string;
  @Column()
  description: string;
  @Column()
  status: TaskStatus;

  @ManyToOne((_type) => AuthUser, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: AuthUser;
}
