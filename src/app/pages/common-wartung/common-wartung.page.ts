import {Component, OnDestroy, OnInit} from '@angular/core';
import {DebugProvider} from "../../services/debug/debug";
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
import {ConstProvider} from "../../services/const/const";
import {BasicsProvider} from "../../services/basics/basics";
import {SecurityService} from "../../services/security/security.service";

@Component({
  selector: 'common-wartung-page',
  templateUrl: 'common-wartung.page.html',
  styleUrls: ['common-wartung.page.scss'],
})
export class CommonWartungPage implements OnInit, OnDestroy {

  constructor(public Pool: DatabasePoolService,
              public Const: ConstProvider,
              public Basics: BasicsProvider,
              public Debug: DebugProvider) {
    try {


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Wartung', 'constructor', this.Debug.Typen.Page);
    }
  }

  ngOnDestroy(): void {

    try {


    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Wartung', 'OnDestroy', this.Debug.Typen.Page);
    }
  }

  ngOnInit(): void {

    try {



    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Wartung', 'OnInit', this.Debug.Typen.Page);
    }
  }
}
