import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {InputCloneModule} from "../../components/input-clone/input-clone.module";
import {InputCloneKeeperModule} from "../../components/input-clone-keeper/input-clone-keeper.module";
import {AbstandElementFixedModule} from "../../components/abstand-element-fixed/abstand-element-fixed.module";
import {PageHeaderModule} from "../../components/page-header/page-header.module";
import {PjGebaeudeRaumeditorComponent} from "./pj-gebaeude-raumeditor.component";
import {PageFooterModule} from "../../components/page-footer/page-footer.module";
import {CheckboxClonModule} from "../../components/checkbox-clon/checkbox-clon.module";
import {PageHeaderCenterModule} from "../../components/page-header-center/page-header-center.module";

@NgModule({
  declarations: [

    PjGebaeudeRaumeditorComponent
  ],
  exports: [

    PjGebaeudeRaumeditorComponent
  ],
    imports: [

        CommonModule,
        IonicModule,
        InputCloneModule,
        InputCloneKeeperModule,
        AbstandElementFixedModule,
        PageHeaderModule,
        PageFooterModule,
        CheckboxClonModule,
        PageHeaderCenterModule,
    ],
  providers: [

  ]
})
export class PjGebaeudeRaumeditorModule {}
