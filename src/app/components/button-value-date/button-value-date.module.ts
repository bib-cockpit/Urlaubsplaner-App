import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {ButtonValueDateComponent} from './button-value-date';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [

    ButtonValueDateComponent
  ],
  exports: [

    ButtonValueDateComponent
  ],
  imports: [

    IonicModule,
    CommonModule,
  ],
  providers: [

  ]
})
export class ButtonValueDateModule {}
