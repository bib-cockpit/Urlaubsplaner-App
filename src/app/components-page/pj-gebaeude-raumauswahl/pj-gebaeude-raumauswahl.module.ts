import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {InputCloneModule} from "../../components/input-clone/input-clone.module";
import {InputCloneKeeperModule} from "../../components/input-clone-keeper/input-clone-keeper.module";
import {AbstandElementFixedModule} from "../../components/abstand-element-fixed/abstand-element-fixed.module";
import {CheckboxClonModule} from "../../components/checkbox-clon/checkbox-clon.module";
import {PjGebaeudeRaumauswahlComponent} from "./pj-gebaeude-raumauswahl.component";
import {PageHeaderModule} from "../../components/page-header/page-header.module";
import {PageFooterModule} from "../../components/page-footer/page-footer.module";

@NgModule({
  declarations: [

    PjGebaeudeRaumauswahlComponent
  ],
  exports: [

    PjGebaeudeRaumauswahlComponent
  ],
    imports: [

        CommonModule,
        IonicModule,
        InputCloneModule,
        InputCloneKeeperModule,
        AbstandElementFixedModule,
        CheckboxClonModule,
        PageHeaderModule,
        PageFooterModule
    ],
  providers: [

  ]
})
export class PjGebaeudeRaumauswahlModule {}
