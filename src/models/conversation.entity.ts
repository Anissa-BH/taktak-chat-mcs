
import { AddConversationDto } from 'src/conversations/dto/add-conversation.dto';
import { Entity, ObjectID, ObjectIdColumn, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, DeleteDateColumn } from 'typeorm';
import { Message } from './message.entity';


@Entity({
	name: 'conversation',
	orderBy: {
		createdAt: 'ASC'
	}
})
export class Conversation {

	@PrimaryGeneratedColumn()
	@ObjectIdColumn()
	_id: ObjectID;
	
	@Column()
	userId: string

	@Column()
	name: string

	
	@ObjectIdColumn()
	participantId: ObjectID

	
	@ObjectIdColumn()
	lastMessage: Message
		

	@Column()
	messages: Message[]


	@Column()
	isBlocked: Boolean

		
	@CreateDateColumn({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP(6)',
	  })
	  createdAt: Date;

	
	@Column()
	updatedAt: Date = null;
	

	@DeleteDateColumn()
    deletedAt: Date = null;

	// @OneToMany(() => Message, message => message.conversation)
    // message: Message[];

	constructor(conversation: Partial<AddConversationDto>) {
		Object.assign(this, conversation);
	  }
}
