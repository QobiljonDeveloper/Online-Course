import { PartialType } from '@nestjs/swagger';
import { CreateCourseProgressDto } from './create-course-progress.dto';

export class UpdateCourseProgressDto extends PartialType(CreateCourseProgressDto) {}
