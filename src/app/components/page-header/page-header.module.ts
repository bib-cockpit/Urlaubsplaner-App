import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {PageHeaderComponent} from './page-header';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [

    PageHeaderComponent,
  ],
  exports: [

    PageHeaderComponent,
  ],
  imports: [

    CommonModule,
    IonicModule,
  ],
  providers: [

  ]
})
export class PageHeaderModule {}
