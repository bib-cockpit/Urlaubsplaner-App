import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {ButtonValueDateSmallComponent} from './button-value-date-small';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [

    ButtonValueDateSmallComponent
  ],
  exports: [

    ButtonValueDateSmallComponent
  ],
  imports: [

    IonicModule,
    CommonModule,
  ],
  providers: [

  ]
})
export class ButtonValueDateSmallModule {}
