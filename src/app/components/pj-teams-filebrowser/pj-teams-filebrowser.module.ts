import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {PjTeamsFilebrowserComponent} from './pj-teams-filebrowser';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [

    PjTeamsFilebrowserComponent,
  ],
  exports: [

    PjTeamsFilebrowserComponent,
  ],
  imports: [

    CommonModule,
    IonicModule,
  ],
  providers: [

  ]
})
export class PjTeamsFilebrowserModule {}
