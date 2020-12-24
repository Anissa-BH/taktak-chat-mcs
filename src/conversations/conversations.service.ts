/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Logger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectID } from 'mongodb';
import { Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { Message, Conversation } from 'src/models';
import { AddConversationDto } from './dto/add-conversation.dto';



@Injectable()
export class ConversationService {

    private logger = new Logger('Conversation Controller')
    constructor(@InjectRepository(Conversation)
        private readonly conversationRepository: MongoRepository<Conversation>,

      @InjectRepository(Message)
        private readonly messageRepository: MongoRepository<Message>) {}

      async getConversations(@Ctx() context: RmqContext) {        
        const channel = context.getChannelRef();
        const orginalMessage = context.getMessage();
        channel.ack(orginalMessage);
        let conversations = await this.conversationRepository.find();    
        for(let i=0;i<conversations.length;i++){
          conversations[i].messages = await this.messageRepository.find({ where: { "conversationId": conversations[i]._id } });
        }   
        return conversations;
      }
     //----------------------------------------------------------------------------------------------- 
        
      async getConversationsByUserId(@Payload() data: string, @Ctx() context: RmqContext){
        const channel = context.getChannelRef();
        const orginalMessage = context.getMessage();
        channel.ack(orginalMessage); 
        console.log(data);
        let conversations = await this.conversationRepository.find({           
         where:{ "userId": data , "participantId": data }});
         console.log(conversations);

        for (let i=0;i<conversations.length;i++){
           conversations[i].messages = await this.messageRepository.find({where:{ "conversationId": conversations[i]._id }})
        } 
        return conversations;
      }
     //userId or participantId condition doesn't work----------------------------------------------------------------------------------------------- 
    
      async getConversationById(@Payload() data: string, @Ctx() context: RmqContext): Promise<Conversation>{
        console.log("data", data);
        const channel = context.getChannelRef();
        const orginalMessage = context.getMessage();
        channel.ack(orginalMessage);    
        let conversation = await this.conversationRepository.findOne(ObjectID( data) );
        console.log("--------------",conversation);
        const messages = await this.messageRepository.find( { where: { "conversationId" : conversation._id } } )        
        conversation.messages = messages;
        return conversation;
      } 
    //----------------------------------------------------------------------------------------------- 

      async createConversation(@Payload() conversation: Partial<AddConversationDto>, @Ctx() context: RmqContext):Promise<Conversation> {
        const channel = context.getChannelRef();
        const orginalMessage = context.getMessage();
        channel.ack(orginalMessage);        
        if (!conversation || !conversation.userId || !conversation.participantId) {
            console.log(`data is missing can't create conversation`);
        }   
        let newconv =  new Conversation(conversation);     
        return await this.conversationRepository.save(newconv);
    } 
     //-----------------------------------------------------------------------------------------------        

      async deleteConversation(@Payload() id: any): Promise<boolean> {
        const conversationId = ObjectID(id);        
        // Check if entity exists        
        const conversation = await this.conversationRepository.findOne(conversationId);       
        const _id = conversation._id; 
          if (!conversation) {
            //throw new NotFoundException();          
            return false;
          }
          delete conversation._id;
          await this.conversationRepository.findOneAndUpdate(
            { _id: ObjectID(_id) },
            { $set: {deletedAt: new Date(Date.now()) }},
            { returnOriginal: false });
          return true;      
    } 
}

