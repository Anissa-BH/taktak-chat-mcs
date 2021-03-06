import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as Controllers from 'src/controllers';
import * as Models from 'src/models';
import { ConversationService } from './conversations/conversations.service';
import { MessageService } from './messages/messages.service';
import { MessageItemService } from './messageItems/messageItems.service';

import { MessagesModule } from './messages/messages.module';
import { MessageItemsModule } from './messageItems/messageItems.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGODB_CONNECTION_STRING,
      database: process.env.MONGODB_DATABASE,
      entities: [
        'dist/**/*.entity.js',
      ],
      ssl: false,
      useUnifiedTopology: true,
      useNewUrlParser: true
    }),
    TypeOrmModule.forFeature([...Object.values(Models)])
    
  ],

  controllers: [AppController, ...Object.values(Controllers)],
  providers: [AppService, ConversationService, MessageService, MessageItemService],
})
export class AppModule {}
