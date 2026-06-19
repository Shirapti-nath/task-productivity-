import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { TasksService } from './tasks.service';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  private logger = new Logger(TasksController.name);

  constructor(
    private readonly tasksService: TasksService,
  ) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {
    this.logger.log('Creating task:', createTaskDto);
    const task = await this.tasksService.create(createTaskDto);
    this.logger.log('Task created:', task);
    return task;
  }

  @Get()
  async findAll() {
    this.logger.log('Fetching all tasks');
    const tasks = await this.tasksService.findAll();
    this.logger.log(`Found ${tasks.length} tasks`);
    return tasks;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.log('Fetching task with id:', id);
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    this.logger.log('Updating task:', id, updateTaskDto);
    return this.tasksService.update(
      id,
      updateTaskDto,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    this.logger.log('Deleting task:', id);
    return this.tasksService.remove(id);
  }
}