import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FiMitarbeiterlistePage } from './fi-mitarbeiterliste';
import {PageHeaderModule} from "../../components/page-header/page-header.module";
import {AbstandElementFixedModule} from "../../components/abstand-element-fixed/abstand-element-fixed.module";
import {AlphabetModule} from "../../components/alphabet/alphabet.module";
import {PageFooterModule} from "../../components/page-footer/page-footer.module";
import {PageHeaderMenuModule} from "../../components/page-header-menu/page-header-menu.module";
import {FiMitarbeiterEditorModule} from "../../components-page/fi-mitarbeiter-editor/fi-mitarbeiter-editor.module";
import {AuswahlDialogModule} from "../../components/auswahl-dialog/auswahl-dialog.module";
import {CheckboxClonModule} from "../../components/checkbox-clon/checkbox-clon.module";

const routes: Routes = [
  {
    path: '',
    component: FiMitarbeiterlistePage
  }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        PageHeaderModule,
        PageFooterModule,
        AbstandElementFixedModule,
        AlphabetModule,
        PageHeaderMenuModule,
        FiMitarbeiterEditorModule,
        AuswahlDialogModule,
        CheckboxClonModule,
    ],
  declarations: [FiMitarbeiterlistePage]
})
export class FIMitarbeiterlistePageModule {}
