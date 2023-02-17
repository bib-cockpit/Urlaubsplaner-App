import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {ButtonValueComponent} from './button-value';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [

    ButtonValueComponent
  ],
  exports: [

    ButtonValueComponent
  ],
  imports: [

    CommonModule,
    IonicModule,
  ],
  providers: [

  ]
})
export class ButtonValueModule {}
