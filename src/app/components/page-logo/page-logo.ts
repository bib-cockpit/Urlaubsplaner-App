import { Component, Input, Output, OnInit, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import {BasicsProvider} from '../../services/basics/basics';
import {DebugProvider} from '../../services/debug/debug';
import {ConstProvider} from '../../services/const/const';
import {MenuController} from "@ionic/angular";
import {MenueService} from "../../services/menue/menue.service";
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
import {DatabaseProjekteService} from "../../services/database-projekte/database-projekte.service";

@Component({
  selector: 'page-logo',
  templateUrl: 'page-logo.html',
  styleUrls: ['page-logo.scss']
})
export class PageLogoComponent implements OnInit {

  public AbstandY: number;
  constructor(private Debug: DebugProvider,
              public Basics: BasicsProvider,
              private ProjekteDB: DatabaseProjekteService,
              public Const: ConstProvider,
              private Pool: DatabasePoolService) {
    try {

      this.AbstandY  = 56;

    }
    catch (error) {


      this.Debug.ShowErrorMessage(error,  'Page Logo', 'Construktor', this.Debug.Typen.Component);
    }
  }

  ngOnInit() {

    try {

    }
    catch (error) {

      this.Debug.ShowErrorMessage(error,  'Page Logo', 'ngOnInit', this.Debug.Typen.Component);
    }
  }

  GetAbstandY(): number {

    try {

      let AbstandY = 50;
      let Zeilenanzahl: number = 1;

      if(this.Pool.Mitarbeitersettings !== null) {

        Zeilenanzahl = Math.ceil((this.ProjekteDB.Favoritenprojekteanzahl + 2) / this.Pool.Mitarbeitersettings.HeadermenueMaxFavoriten);
      }

      return AbstandY * Zeilenanzahl;
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error,  'Page Logo', 'GetAbstandY', this.Debug.Typen.Component);
    }
  }
}
