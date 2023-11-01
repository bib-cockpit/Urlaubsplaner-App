import { NgModule } from '@angular/core';
import {PageHeaderModule} from '../../components/page-header/page-header.module';
import {AlphabetModule} from '../../components/alphabet/alphabet.module';
import {AuswahlDialogModule} from '../../components/auswahl-dialog/auswahl-dialog.module';
import {RouterModule, Routes} from '@angular/router';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {PageFooterModule} from '../../components/page-footer/page-footer.module';
import {PjProjektListePage} from "./pj-projekt-liste";
import {AbstandElementFixedModule} from "../../components/abstand-element-fixed/abstand-element-fixed.module";
import {PageHeaderMenuModule} from "../../components/page-header-menu/page-header-menu.module";
import {PageModalKeepermodule} from "../../components/page-modal-keeper/page-modal-keeper.module";
import {InputCloneModule} from "../../components/input-clone/input-clone.module";
import {CheckboxClonModule} from "../../components/checkbox-clon/checkbox-clon.module";
import {FiMitarbeiterAuswahlModule} from "../../components-page/fi-mitarbeiter-auswahl/fi-mitarbeiter-auswahl.module";
import {PjProjektEditorModule} from "../../components-page/pj-projekt-editor/pj-projekt-editor.module";
import {PjBeteiligtenEditorModule} from "../../components-page/pj-beteiligten-editor/pj-beteiligten-editor.module";
import {PjGebaeudeBauteileditorModule} from "../../components-page/pj-gebaeude-bauteileditor/pj-gebaeude-bauteileditor.module";
import {PjGebaeudeGeschosseditorModule} from "../../components-page/pj-gebaeude-geschosseditor/pj-gebaeude-geschosseditor.module";
import {PjGebaeudeRaumeditorModule} from "../../components-page/pj-gebaeude-raumeditor/pj-gebaeude-raumeditor.module";
import {PjProtokollListefilterModule} from "../../components-page/pj-protokoll-listefilter/pj-protokoll-listefilter.module";
import { PjProjekteSelectfilefolderModule
} from "../../components-page/pj-projekte-selectfilefolder/pj-projekte-selectfilefolder.module";
import {
  FiOutlookkontakteAuswahlModule
} from "../../components-page/fi-outlookkontakte-auswahl/fi-outlookkontakte-auswahl.module";
import {PjFirmenEditorModule} from "../../components-page/pj-firmen-editor/pj-firmen-editor.module";

const routes: Routes = [
  {
    path: '',
    component: PjProjektListePage
  }
];

@NgModule({
  declarations: [
    PjProjektListePage,
  ],
    imports: [
        RouterModule.forChild(routes),

        IonicModule,
        CommonModule,
        PageHeaderModule,
        AlphabetModule,
        AuswahlDialogModule,
        PageFooterModule,
        AbstandElementFixedModule,
        PageHeaderMenuModule,
        PageModalKeepermodule,
        InputCloneModule,
        CheckboxClonModule,
        FiMitarbeiterAuswahlModule,
        PjProjektEditorModule,
        PjBeteiligtenEditorModule,
        PjGebaeudeBauteileditorModule,
        PjGebaeudeGeschosseditorModule,
        PjGebaeudeRaumeditorModule,
        PjProtokollListefilterModule,
        PjProjekteSelectfilefolderModule,
        FiOutlookkontakteAuswahlModule,
        PjFirmenEditorModule
    ],
  exports: [
    PjProjektListePage
  ]
})
export class PjProjektListePageModule {}
