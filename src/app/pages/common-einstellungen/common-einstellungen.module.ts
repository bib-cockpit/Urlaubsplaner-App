import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonEinstellungenPage } from './common-einstellungen.page';
import {PageHeaderModule} from "../../components/page-header/page-header.module";
import {RouterModule, Routes} from "@angular/router";
import {PageHeaderMenuModule} from "../../components/page-header-menu/page-header-menu.module";
import {PageFooterModule} from "../../components/page-footer/page-footer.module";
import {CheckboxClonModule} from "../../components/checkbox-clon/checkbox-clon.module";
import {ButtonValueModule} from "../../components/button-value/button-value.module";
import {AuswahlDialogModule} from "../../components/auswahl-dialog/auswahl-dialog.module";
import {EditorComponent} from "@tinymce/tinymce-angular";
import {SafePipeModule} from "../../pipes/safe.pipe.module";

const routes: Routes = [
  {
    path: '',
    component: CommonEinstellungenPage
  }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PageHeaderModule,
        RouterModule.forChild(routes),
        PageHeaderMenuModule,
        PageFooterModule,
        CheckboxClonModule,
        ButtonValueModule,
        AuswahlDialogModule,
        EditorComponent,
        SafePipeModule,
    ],
  declarations: [CommonEinstellungenPage]
})
export class CommonEinstellungenPageModule {}
