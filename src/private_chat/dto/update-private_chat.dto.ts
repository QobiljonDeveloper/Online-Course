import { PartialType } from '@nestjs/swagger';
import { CreatePrivateChatDto } from './create-private_chat.dto';

export class UpdatePrivateChatDto extends PartialType(CreatePrivateChatDto) {}
