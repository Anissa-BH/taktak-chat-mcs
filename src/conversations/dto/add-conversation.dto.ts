import { ObjectID } from "typeorm"

export class AddConversationDto {

    userId: ObjectID;
    participantId: String;
    name: String;
}