import { ObjectID } from "typeorm"

export class AddMessageDto {

    text: String;
	conversationId: ObjectID;
	createdBy: ObjectID;
}

