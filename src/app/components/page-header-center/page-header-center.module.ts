import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {PageHeaderCenterComponent} from './page-header-center';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [

    PageHeaderCenterComponent,
  ],
  exports: [

    PageHeaderCenterComponent,
  ],
  imports: [

    CommonModule,
    IonicModule,
  ],
  providers: [

  ]
})
export class PageHeaderCenterModule {}
