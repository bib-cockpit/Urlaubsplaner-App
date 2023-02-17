import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {PageLogoComponent} from './page-logo';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [

    PageLogoComponent,
  ],
  exports: [

    PageLogoComponent,
  ],
  imports: [

    CommonModule,
    IonicModule,
  ],
  providers: [

  ]
})
export class PageLogoModule {}
