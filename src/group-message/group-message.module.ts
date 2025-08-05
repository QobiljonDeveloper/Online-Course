import { Module } from '@nestjs/common';
import { GroupMessagesService } from './group-message.service';
import { GroupMessageController } from './group-message.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AdminsModule } from '../admins/admins.module';

@Module({
  imports:[PrismaModule, AdminsModule],
  controllers: [GroupMessageController],
  providers: [GroupMessagesService],
})
export class GroupMessageModule {}
