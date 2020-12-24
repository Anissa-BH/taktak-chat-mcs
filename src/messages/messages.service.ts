import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectID } from 'mongodb';
import { Ctx, Payload, RmqContext } from '@nestjs/microservices';
import { Conversation,Message } from 'src/models';
import { AddMessageDto } from './dto/add-message.dto';

@Injectable()
export class MessageService {

  constructor(@InjectRepository(Message)
    private readonly messageRepository: MongoRepository<Message>,

    @InjectRepository(Conversation)     
    private readonly conversationRepository: MongoRepository<Conversation>) {}   
    
    
    async getMessages(@Payload() data: string, @Ctx() context: RmqContext){    
      const channel = context.getChannelRef();
      const orginalMessage = context.getMessage();
      channel.ack(orginalMessage); 

      console.log("conversationId*******",data);
      const messages = await this.messageRepository.find({ where:{ "conversationId": ObjectID( data)} });  
      console.log("conversationId*******objectID",data);
      console.log(messages);   
      return messages;
    }
 //----------------------------------------------------------------------------------------------- 

    async sendMessage(@Payload() message: AddMessageDto, @Ctx() context: RmqContext):Promise<Message> {
      const channel = context.getChannelRef();
      const orginalMessage = context.getMessage();
      channel.ack(orginalMessage);        
      const findConversation = await this.conversationRepository.findOne(message.conversationId);  
      //if conversation exist
      if(!findConversation) {
        console.log("conversation not found")          
      } else {
          if (!message || !message.conversationId || !message.text || !message.createdBy) {
              console.log(`Data is missing can't create message`);
          } 
      message.conversationId = new ObjectID(message.conversationId);
      const messageCreated = await this.messageRepository.save(new Message(message));
       //update conversation.lastMessageID
       let conversation = await this.conversationRepository.findOne(message.conversationId );
       console.log("message created id",messageCreated._id);
       console.log("conversation",conversation);
       conversation.lastMessage = messageCreated;
       console.log(conversation);
      return messageCreated;
      }
    }
 //----------------------------------------------------------------------------------------------- 
  
    async deleteMessage(@Payload() id: any): Promise<boolean> {
      const messageId = ObjectID(id);       
      // Check if entity exists      
      const message = await this.messageRepository.findOne(messageId);
      const _id = message._id; 
      if (!message) {
        //  throw new NotFoundException();
        console.log('not exist');
        return false;
      }
      delete message._id;
      await this.messageRepository.findOneAndUpdate(
        { _id: ObjectID(_id) },
        { $set: {deletedAt: new Date(Date.now()) }},
        { returnOriginal: false }
      );
      return true;
    }           
}
