import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {ButtonValueTimeComponent} from './button-value-time';
import {CommonModule} from '@angular/common';
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";

@NgModule({
  declarations: [

    ButtonValueTimeComponent
  ],
  exports: [

    ButtonValueTimeComponent
  ],
    imports: [

        IonicModule,
        CommonModule,
        NgxMaterialTimepickerModule,
    ],
  providers: [

  ]
})
export class ButtonValueTimeModule {}
