import { PartialType } from '@nestjs/swagger';
import { CreatePrivateMessageDto } from './create-private_message.dto';

export class UpdatePrivateMessageDto extends PartialType(CreatePrivateMessageDto) {}
