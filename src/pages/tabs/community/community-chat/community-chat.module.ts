import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommunityChatPage } from './community-chat';
import { AutoSizeDirective } from '../../../../directives/auto-size/auto-size';

@NgModule({
  declarations: [
    CommunityChatPage,
    // AutoSizeDirective
  ],
  imports: [
    IonicPageModule.forChild(CommunityChatPage),
  ],
})
export class CommunityChatPageModule {}
