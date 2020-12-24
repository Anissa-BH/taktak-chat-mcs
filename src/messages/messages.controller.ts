import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { Message } from 'src/models';
import { MessageService } from 'src/messages/messages.service';
import { AddMessageDto } from './dto/add-message.dto';

@Controller('message')
export class MessageController {

  constructor(private messageService: MessageService) {}      

  @MessagePattern('getMessages')    
    async getMessages(@Payload() data: string, @Ctx() context: RmqContext) {
      return await this.messageService.getMessages(data, context);
    }  
 //----------------------------------------------------------------------------------------------- 

  @MessagePattern('sendMessage')
    async sendMessage(@Payload() message: AddMessageDto, @Ctx() context: RmqContext):Promise<Message> {
      return await this.messageService.sendMessage(message, context);
    }
 //----------------------------------------------------------------------------------------------- 
  
  @MessagePattern('deleteMessage')
    async deleteMessage(@Payload() id: any): Promise<boolean> {
      return await this.messageService.deleteMessage(id);
    } 
}