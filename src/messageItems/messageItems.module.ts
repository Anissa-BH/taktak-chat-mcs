import { Module } from '@nestjs/common';
import { messageItemController } from './messageItems.controller';
import { MessageItemService } from './messageItems.service';


@Module({
  controllers: [messageItemController],
  providers: [MessageItemService],
  exports: [MessageItemService]
})
export class MessageItemsModule {}