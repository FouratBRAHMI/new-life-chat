import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateChatPage } from './create-chat';

@NgModule({
  declarations: [
    CreateChatPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateChatPage),
  ],
})
export class CreateChatPageModule {}
