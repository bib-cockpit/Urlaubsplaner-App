import { NgModule } from '@angular/core';
import {PageHeaderModule} from '../../components/page-header/page-header.module';
import {AlphabetModule} from '../../components/alphabet/alphabet.module';
import {AuswahlDialogModule} from '../../components/auswahl-dialog/auswahl-dialog.module';
import {RouterModule, Routes} from '@angular/router';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {PageFooterModule} from '../../components/page-footer/page-footer.module';
import {FormsModule} from "@angular/forms";
import {ButtonValueModule} from "../../components/button-value/button-value.module";
import {ButtonValueDateModule} from "../../components/button-value-date/button-value-date.module";
import {PjBaustelleLoplisteEditorComponent} from "./pj-baustelle-lopliste-editor.component";
import {CheckboxClonModule} from "../../components/checkbox-clon/checkbox-clon.module";
import {InputCloneModule} from "../../components/input-clone/input-clone.module";
import {AbstandElementFixedModule} from "../../components/abstand-element-fixed/abstand-element-fixed.module";
import {ButtonValueTimeModule} from "../../components/button-value-time/button-value-time.module";
import {SafePipeModule} from "../../pipes/safe.pipe.module";

@NgModule({

  providers: [

  ],
  declarations: [
    PjBaustelleLoplisteEditorComponent,
  ],
  imports: [

    IonicModule,
    CommonModule,
    PageHeaderModule,
    FormsModule,

    AuswahlDialogModule,
    PageFooterModule,
    ButtonValueModule,
    ButtonValueDateModule,
    CheckboxClonModule,
    InputCloneModule,
    AbstandElementFixedModule,
    ButtonValueTimeModule,
    SafePipeModule,
  ],
  exports: [
    PjBaustelleLoplisteEditorComponent
  ]
})
export class PjBaustelleLoplisteEditorModule {}
