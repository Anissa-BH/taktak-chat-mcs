/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller, Logger } from '@nestjs/common';
import { Conversation } from '../models/conversation.entity';
import { MessagePattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { ConversationService } from 'src/conversations/conversations.service';
import { AddConversationDto } from './dto/add-conversation.dto';


@Controller('conversation')
export class ConversationController {

    private logger = new Logger('Conversation Controller')
    constructor(private conversationService: ConversationService) {}


    @MessagePattern('getConversations')
      async getConversations(@Ctx() context: RmqContext) { 
        return await this.conversationService.getConversations(context); 
    }
     //----------------------------------------------------------------------------------------------- 

    @MessagePattern('getConversationsByUserId')    
      async getConversationsByUserId(@Payload() data: string, @Ctx() context: RmqContext) {
        return await this.conversationService.getConversationsByUserId(data, context); 
    }
     //----------------------------------------------------------------------------------------------- 

    @MessagePattern('getConversationById')    
      async getConversationById(@Payload() data: string, @Ctx() context: RmqContext): Promise<Conversation> {
        return await this.conversationService.getConversationById(data, context);
    }
    //----------------------------------------------------------------------------------------------- 

    @MessagePattern('createConversation')
      async createConversation(@Payload() conversation: Partial<AddConversationDto>, @Ctx() context: RmqContext): Promise<Conversation> {
        return await this.conversationService.createConversation(conversation, context);
    }    
     //-----------------------------------------------------------------------------------------------        

    @MessagePattern('deleteConversation')
      async deleteConversation(@Payload() id: any): Promise<boolean> {
        return await this.conversationService.deleteConversation(id);
    } 

}

