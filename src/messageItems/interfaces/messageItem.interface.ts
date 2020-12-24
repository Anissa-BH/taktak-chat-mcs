import { MessageItemType } from "src/schema/types.schema";

export interface MessageItem {
    
    _id: String;  
    itemType: MessageItemType;
    itemPath: String; 
	createdAt: Date;
	updatedAt: Date;
    deletedAt: Date;
}