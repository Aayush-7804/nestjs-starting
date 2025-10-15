import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TasksModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 8000, // Change to 5432 if your PostgreSQL runs on the default port
      username: 'postgres',
      password: 'aayush',
      database: 'task-management',
      autoLoadEntities: true, // Keep this for other entities if needed
      synchronize: true, // Set to false in production
    }),
  ],
})
export class AppModule {}
