import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonRegistrierungPage } from './common-registrierung.page';
import {PageHeaderModule} from "../../components/page-header/page-header.module";
import {AbstandElementFixedModule} from "../../components/abstand-element-fixed/abstand-element-fixed.module";
import {PageFooterModule} from "../../components/page-footer/page-footer.module";
import {FiMitarbeiterEditorModule} from "../../components-page/fi-mitarbeiter-editor/fi-mitarbeiter-editor.module";
import {AuswahlDialogModule} from "../../components/auswahl-dialog/auswahl-dialog.module";

const routes: Routes = [
  {
    path: '',
    component: CommonRegistrierungPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    PageHeaderModule,
    AbstandElementFixedModule,
    ReactiveFormsModule,
    PageFooterModule,
    FiMitarbeiterEditorModule,
    AuswahlDialogModule,
  ],
  declarations: [CommonRegistrierungPage]
})
export class CommonRegistrierungPageModule {}
