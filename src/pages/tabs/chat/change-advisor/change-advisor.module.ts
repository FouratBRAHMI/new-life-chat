import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChangeAdvisorPage } from './change-advisor';

import { Ionic2RatingModule } from "ionic2-rating";

@NgModule({
  declarations: [
    ChangeAdvisorPage,
  ],
  imports: [
    IonicPageModule.forChild(ChangeAdvisorPage),
    Ionic2RatingModule
  ],
})
export class ChangeAdvisorPageModule {}
