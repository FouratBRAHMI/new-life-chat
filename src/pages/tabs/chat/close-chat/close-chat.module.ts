import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CloseChatPage } from './close-chat';

import { Ionic2RatingModule } from "ionic2-rating";

@NgModule({
  declarations: [
    CloseChatPage,
  ],
  imports: [
    IonicPageModule.forChild(CloseChatPage),
    Ionic2RatingModule 
  ],
})
export class CloseChatPageModule {}
