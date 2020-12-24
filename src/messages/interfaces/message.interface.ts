import { ObjectID } from "typeorm";

export interface Message {
    
    _id: ObjectID; 
    text: string;
    conversationId: ObjectID;
    createdBy: string; 
	createdAt: Date;
	updatedAt: Date;
    deletedAt: Date;
}