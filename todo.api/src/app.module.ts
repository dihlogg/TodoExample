import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TodosModule } from './todos/todos.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://long:171204@localhost:27017/TodoExample?authSource=admin'), TodosModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
