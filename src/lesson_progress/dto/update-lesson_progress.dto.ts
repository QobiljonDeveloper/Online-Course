import { PartialType } from '@nestjs/swagger';
import { CreateLessonProgressDto } from './create-lesson_progress.dto';

export class UpdateLessonProgressDto extends PartialType(CreateLessonProgressDto) {}
