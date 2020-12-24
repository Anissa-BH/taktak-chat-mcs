import { AddMessageItemDto } from 'src/messageItems/dto/add-messageItem.dto'
import { Entity, ObjectIdColumn ,Column, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn } from 'typeorm'
import { MessageItemType } from '../schema/types.schema'


@Entity({
    name: 'messageItem',
    orderBy: {
        createdAt: 'ASC'
    }
})
export class MessageItem {
    
    @PrimaryGeneratedColumn()
    @ObjectIdColumn()   
    _id: string    

    @Column()
    itemType: MessageItemType

    @Column()
    itemPath: string    

    @CreateDateColumn({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP(6)',
	  })
	  createdAt: Date;

	
	@Column()
	updatedAt: Date = null;
	

	@DeleteDateColumn()
    deletedAt: Date = null;

    
    constructor(messageItem?: AddMessageItemDto) {
		Object.assign(this, messageItem);
	  }
}
