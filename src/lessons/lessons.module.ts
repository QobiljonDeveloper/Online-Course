import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AdminsModule } from '../admins/admins.module';

@Module({
  imports:[PrismaModule, AdminsModule],
  controllers: [LessonsController],
  providers: [LessonsService],
})
export class LessonsModule {}
