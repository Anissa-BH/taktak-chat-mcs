import { Controller } from '@nestjs/common';
import { MessageItem } from '../models/messageItem.entity';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { MessageItemService } from 'src/messageItems/messageItems.service';
import { AddMessageItemDto } from './dto/add-messageItem.dto';

@Controller('messageItem')
export class messageItemController {

    constructor(private messageItemService: MessageItemService) {}

    @MessagePattern('getMessageItems')
      async getMessageItems(@Payload() data: string, @Ctx() context: RmqContext) {
        return await this.messageItemService.getMessageItems(data, context);
      }
    //-----------------------------------------------------------------------------------------------    
    
    @MessagePattern('getMessageItemById')    
      async getMessageItemById(@Payload() data: string, @Ctx() context: RmqContext):Promise<MessageItem> {
        return await this.messageItemService.getMessageItemById(data, context);
      }
    //----------------------------------------------------------------------------------------------- 

    @MessagePattern('createMessageItem')
      async createMessageItem(@Payload() messageItem: AddMessageItemDto, @Ctx() context: RmqContext):Promise<MessageItem> {
        return await this.messageItemService.createMessageItem(messageItem, context);
     }
    //-----------------------------------------------------------------------------------------------  

    @MessagePattern('deleteMessageItem')
      async deleteMessageItem(@Payload() id: any): Promise<boolean> {
        return await this.messageItemService.deleteMessageItem(id);
     }
    //----------------------------------------------------------------------------------------------- 
}