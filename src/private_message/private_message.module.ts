import { Module } from '@nestjs/common';
import { PrivateMessageService } from './private_message.service';
import { PrivateMessagesController } from './private_message.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers: [PrivateMessagesController],
  providers: [PrivateMessageService],
})
export class PrivateMessageModule {}
