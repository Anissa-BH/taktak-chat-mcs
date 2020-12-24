

import { Message } from "src/messages/interfaces/message.interface";
import { ObjectID } from "typeorm";

export interface Conversation {

    _id: ObjectID;
    userId:String;
    name: String;
    participantId: ObjectID;
    lastMessageId: String;
    messages: Message[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
  }


  

	
	
	


		
	