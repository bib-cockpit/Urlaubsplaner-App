import { Injectable } from '@angular/core';
import {DebugProvider} from "../debug/debug";
import {ToolsProvider} from "../tools/tools";
import {environment} from "../../../environments/environment";
import {DatabasePoolService} from "../database-pool/database-pool.service";
import {ConstProvider} from "../const/const";

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor(private Debug: DebugProvider,
              private Tools: ToolsProvider,
              private Const: ConstProvider,
              private Pool: DatabasePoolService)

  {
    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Security', 'constructor', this.Debug.Typen.Service);
    }
  }

  public CheckSecurity() {

    try {

      let Securitystatus: boolean = false;

      if(environment.production === false) Securitystatus = true
      else {

        if(this.Pool.Mitarbeiterdaten && this.Pool.Mitarbeiterdaten.Planeradministrator === true) Securitystatus = true;
      }

      /*

      if(Securitystatus === false) {

        this.Tools.SetRootPage(this.Const.Pages.HomePage);
      }

       */

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Security', 'CheckSecurity', this.Debug.Typen.Service);
    }
  }
}


