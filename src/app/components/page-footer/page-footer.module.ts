import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {PageFooterComponent} from './page-footer';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [

    PageFooterComponent
  ],
  exports: [

    PageFooterComponent
  ],
  imports: [

    IonicModule,
    CommonModule
  ],
  providers: [

  ]
})

export class PageFooterModule {}
