import { Injectable } from '@angular/core';
import {BasicsProvider} from "../basics/basics";
import {NavController} from "@ionic/angular";
import {ConstProvider} from "../const/const";
import {DebugProvider} from "../debug/debug";
import {CanLoad, Route, Router} from "@angular/router";
import {MsalService} from "@azure/msal-angular";

@Injectable({
  providedIn: 'root'
})
export class SecurityService implements CanLoad {


  constructor(public Basics: BasicsProvider,
              private nav: NavController,
              private router: Router,
              public Debug: DebugProvider,
              private MSALService: MsalService,
              private Const: ConstProvider) {
    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Security', 'constructor', this.Debug.Typen.Service);
    }
  }

  canLoad(route: Route): boolean {

    try {

      if (this.CheckSecurity() === true) {

        console.log('Security Service -> can load: ' + route.path);


        return true;
      }
      else {

        console.log('Security Service -> can not load: ' + route.path);

        this.router.navigate([this.Const.Pages.LoginPage]);

        return false;
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Security', 'canLoad', this.Debug.Typen.Service);
    }

  }

  public CheckSecurity(): boolean {

    try {

      return this.MSALService.instance.getActiveAccount() !== null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Security', 'CheckSecurity', this.Debug.Typen.Service);
    }
  }
}
