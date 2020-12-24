import { AddMessageDto } from 'src/messages/dto/add-message.dto';
import { Entity, ObjectIdColumn, Column, ManyToOne, PrimaryGeneratedColumn, ManyToMany, JoinTable, ObjectID, CreateDateColumn, DeleteDateColumn } from 'typeorm';
import { Conversation } from './conversation.entity';
import { MessageItem } from './messageItem.entity';


@Entity({
    name: 'message',
    orderBy: {
        createdAt: 'ASC'
    }
})
export class Message {
    
    @PrimaryGeneratedColumn()
    @ObjectIdColumn()
    _id: ObjectID  

    @Column()
    text: string 

    @ObjectIdColumn()
    conversationId: ObjectID

    @Column()
    createdBy: string
    
    
    @CreateDateColumn({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP(6)',
	  })
	  createdAt: Date;

	
	@Column()
	updatedAt: Date = null;
	

	@DeleteDateColumn()
    deletedAt: Date = null;
    
    // @ManyToOne(() => Conversation, conversation => conversation.messages)
    // conversation: Conversation;

    // @ManyToMany(() => MessageItem)
    // @JoinTable()
    // messageItems: MessageItem[];

    constructor(message?: AddMessageDto) {
		Object.assign(this, message);
	}
}
