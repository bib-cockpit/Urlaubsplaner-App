import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {PageModalKeeperComponent} from "./page-modal-keeper.component";
import {PageHeaderModule} from "../page-header/page-header.module";

@NgModule({
  declarations: [

    PageModalKeeperComponent
  ],
  exports: [

    PageModalKeeperComponent
  ],
  imports: [

    CommonModule,
    IonicModule,
    PageHeaderModule,
  ],
  providers: [

  ]
})
export class PageModalKeepermodule {}
