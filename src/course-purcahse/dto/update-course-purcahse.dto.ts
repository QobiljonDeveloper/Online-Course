import { PartialType } from '@nestjs/swagger';
import { CreateCoursePurchaseDto } from "./create-course-purcahse.dto";

export class UpdateCoursePurcahseDto extends PartialType(CreateCoursePurchaseDto) {}
