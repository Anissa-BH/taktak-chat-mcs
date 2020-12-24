import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectID } from 'mongodb';
import { MessageItem } from '../models/messageItem.entity';
import { Ctx, Payload, RmqContext } from '@nestjs/microservices';
import { AddMessageItemDto } from './dto/add-messageItem.dto';

@Injectable()
export class MessageItemService {

    constructor(@InjectRepository(MessageItem)
        private readonly messageItemRepository: MongoRepository<MessageItem>) {}

      async getMessageItems(@Payload() data: string, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const orginalMessage = context.getMessage();
        channel.ack(orginalMessage);
        const post = await this.messageItemRepository.find({ where: { "messageId": data } });       
        return post;
    }
    //-----------------------------------------------------------------------------------------------    
        
      async getMessageItemById(@Payload() data: string, @Ctx() context: RmqContext):Promise<MessageItem> {
        console.log("data", data);
        const channel = context.getChannelRef();
        const orginalMessage = context.getMessage();
        channel.ack(orginalMessage);    
        const post = await this.messageItemRepository.findOne(data);
        return post;
    }
    //----------------------------------------------------------------------------------------------- 
   
      async createMessageItem(@Payload() messageItem: AddMessageItemDto, @Ctx() context: RmqContext):Promise<MessageItem> {
        const channel = context.getChannelRef();
        const orginalMessage = context.getMessage();
        channel.ack(orginalMessage);
        if (!messageItem || !messageItem.itemType || !messageItem.itemPath) {
            console.log(`data is missing can't create messageItem`);
        }
        return await this.messageItemRepository.save(new MessageItem(messageItem));
    }
    //-----------------------------------------------------------------------------------------------  
    
      async deleteMessageItem(@Payload() id: any): Promise<boolean> {
        const messageItemId = ObjectID(id);    
        const messageItem = await this.messageItemRepository.findOne(messageItemId);
        const _id = messageItem._id; 
        if (!messageItem) {
          //throw new NotFoundException();
          console.log('not exist');
          return false;
        }
        delete messageItem._id;
        await this.messageItemRepository.findOneAndUpdate(
          { _id: ObjectID(_id) },
          { $set: {deletedAt: new Date(Date.now()) }},
          { returnOriginal: false }
        );
        return true;       
    }
    
}
