import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PjProjektpunktStatusdatePickerComponent} from "./pj-projektpunkt-statusdate-picker";
import {PageFooterModule} from "../../components/page-footer/page-footer.module";
import {PageHeaderCenterModule} from "../../components/page-header-center/page-header-center.module";

@NgModule({
  declarations: [

    PjProjektpunktStatusdatePickerComponent
  ],
  exports: [

    PjProjektpunktStatusdatePickerComponent
  ],
  imports: [

    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
    PageFooterModule,
    PageHeaderCenterModule,
  ],
  providers: [

  ]
})
export class PjProjektpunktStatusdatePickerModule {}
