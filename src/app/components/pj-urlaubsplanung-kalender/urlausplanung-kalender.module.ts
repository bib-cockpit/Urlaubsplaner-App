import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
  PjProjektpunktDateKWPickerComponent,
} from "./urlausplanung-kalender";
import {PageFooterModule} from "../../components/page-footer/page-footer.module";
import {PageHeaderCenterModule} from "../../components/page-header-center/page-header-center.module";

@NgModule({
  declarations: [

    PjProjektpunktDateKWPickerComponent
  ],
  exports: [

    PjProjektpunktDateKWPickerComponent
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
export class UrlausplanungKalenderModule {}
