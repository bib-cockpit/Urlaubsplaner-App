import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonUrlaubEinstellungenPage } from './common-urlaub-einstellungen.page';
import {PageHeaderModule} from "../../components/page-header/page-header.module";
import {RouterModule, Routes} from "@angular/router";
import {PageHeaderMenuModule} from "../../components/page-header-menu/page-header-menu.module";
import {PageFooterModule} from "../../components/page-footer/page-footer.module";
import {UrlausplanungKalenderModule} from "../../components/pj-urlaubsplanung-kalender/urlausplanung-kalender.module";
import {ButtonValueModule} from "../../components/button-value/button-value.module";
import {AuswahlDialogModule} from "../../components/auswahl-dialog/auswahl-dialog.module";
import {CheckboxClonModule} from "../../components/checkbox-clon/checkbox-clon.module";
import {FiMitarbeiterEditorModule} from "../../components-page/fi-mitarbeiter-editor/fi-mitarbeiter-editor.module";
import {FiMitarbeiterAuswahlModule} from "../../components-page/fi-mitarbeiter-auswahl/fi-mitarbeiter-auswahl.module";

const routes: Routes = [
  {
    path: '',
    component: CommonUrlaubEinstellungenPage
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
        UrlausplanungKalenderModule,
        ButtonValueModule,
        AuswahlDialogModule,
        CheckboxClonModule,
        FiMitarbeiterEditorModule,
        FiMitarbeiterAuswahlModule,
    ],
  declarations: [CommonUrlaubEinstellungenPage]
})
export class CommonUrlaubEinstellungenPageModule {}
