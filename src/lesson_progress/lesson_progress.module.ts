import { Module } from '@nestjs/common';
import { LessonProgressService } from './lesson_progress.service';
import { LessonProgressController } from './lesson_progress.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers: [LessonProgressController],
  providers: [LessonProgressService],
})
export class LessonProgressModule {}
