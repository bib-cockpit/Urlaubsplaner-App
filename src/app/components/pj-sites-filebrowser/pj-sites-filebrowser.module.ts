import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {PjSitesFilebrowserComponent} from "./pj-sites-filebrowser";

@NgModule({
  declarations: [

    PjSitesFilebrowserComponent,
  ],
  exports: [

    PjSitesFilebrowserComponent,
  ],
  imports: [

    CommonModule,
    IonicModule,
  ],
  providers: [

  ]
})
export class PjSitesFilebrowserModule {}
