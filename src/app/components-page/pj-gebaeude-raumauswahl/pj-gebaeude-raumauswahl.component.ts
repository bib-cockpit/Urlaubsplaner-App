import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';
import {BasicsProvider} from "../../services/basics/basics";
import {DebugProvider} from "../../services/debug/debug";
import {ToolsProvider} from "../../services/tools/tools";
import {DatabaseProjekteService} from "../../services/database-projekte/database-projekte.service";
import {ConstProvider} from "../../services/const/const";
import {InputCloneComponent} from "../../components/input-clone/input-clone.component";
import * as lodash from 'lodash-es';
import {DisplayService} from "../../services/diplay/display.service";
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
import {DatabaseGebaeudestrukturService} from "../../services/database-gebaeudestruktur/database-gebaeudestruktur";
import {DatabaseProjektpunkteService} from "../../services/database-projektpunkte/database-projektpunkte.service";
import {Bauteilstruktur} from "../../dataclasses/bauteilstruktur";

@Component({
  selector: 'pj-gebaeude-raumauswahl',
  templateUrl: './pj-gebaeude-raumauswahl.component.html',
  styleUrls: ['./pj-gebaeude-raumauswahl.component.scss'],
})
export class PjGebaeudeRaumauswahlComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChildren(InputCloneComponent) List: QueryList<InputCloneComponent>;

  @Output() CancelClickedEvent         = new EventEmitter<any>();
  @Output() OkClickedEvent             = new EventEmitter<any>();

  @Input() Titel: string;
  @Input() Iconname: string;
  @Input() Dialogbreite: number;
  @Input() Dialoghoehe: number;
  @Input() PositionY: number;
  @Input() ZIndex: number;

  constructor(public Basics: BasicsProvider,
              public Debug: DebugProvider,
              public Tools: ToolsProvider,
              public DB: DatabaseProjekteService,
              public DBProjektpunkte: DatabaseProjektpunkteService,
              public Displayservice: DisplayService,
              public Pool: DatabasePoolService,
              public DBGebaeude: DatabaseGebaeudestrukturService,
              public Const: ConstProvider) {
    try {

      this.Titel               = this.Const.NONE;
      this.Iconname            = 'business-outline';
      this.Dialogbreite        = 400;
      this.Dialoghoehe         = 300;
      this.PositionY           = 100;
      this.ZIndex              = 3000;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Gebaeude Raumauswahl', 'constructor', this.Debug.Typen.Component);
    }
  }

  ngOnDestroy(): void {

    try {

      this.Displayservice.RemoveDialog(this.Displayservice.Dialognamen.Raumauswahl);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Gebaeude Raumauswahl', 'OnDestroy', this.Debug.Typen.Component);
    }
  }

  ngOnInit() {

    try {

      this.Displayservice.AddDialog(this.Displayservice.Dialognamen.Raumauswahl, this.ZIndex);


      this.PrepareData();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Gebaeude Raumauswahl', 'OnInit', this.Debug.Typen.Component);
    }
  }

  private PrepareData() {

    try {

      this.DBGebaeude.CurrentBauteil       = null;
      this.DBGebaeude.CurrentBauteilindex  = null;
      this.DBGebaeude.CurrentGeschoss      = null;
      this.DBGebaeude.CurrentGeschossindex = null;
      this.DBGebaeude.CurrentRaum          = null;
      this.DBGebaeude.CurrentRaumindex     = null;

      if(this.DBProjektpunkte.CurrentProjektpunkt !== null) {

        if(this.DBProjektpunkte.CurrentProjektpunkt.BauteilID !== null) {

          this.DBGebaeude.CurrentBauteilindex = lodash.findIndex(this.DB.CurrentProjekt.Bauteilliste, { BauteilID: this.DBProjektpunkte.CurrentProjektpunkt.BauteilID });

          if(this.DBGebaeude.CurrentBauteilindex !== -1) {

            this.DBGebaeude.CurrentBauteil = this.DB.CurrentProjekt.Bauteilliste[this.DBGebaeude.CurrentBauteilindex];

            if(this.DBProjektpunkte.CurrentProjektpunkt.GeschossID !== null) {

              this.DBGebaeude.CurrentGeschossindex = lodash.findIndex(this.DBGebaeude.CurrentBauteil.Geschossliste, { GeschossID: this.DBProjektpunkte.CurrentProjektpunkt.GeschossID });

              if(this.DBGebaeude.CurrentGeschossindex !== -1) {

                this.DBGebaeude.CurrentGeschoss = this.DBGebaeude.CurrentBauteil.Geschossliste[this.DBGebaeude.CurrentGeschossindex];

                if(this.DBProjektpunkte.CurrentProjektpunkt.RaumID !== null) {

                  this.DBGebaeude.CurrentRaumindex = lodash.findIndex(this.DBGebaeude.CurrentGeschoss.Raumliste, { RaumID: this.DBProjektpunkte.CurrentProjektpunkt.RaumID });

                  if(this.DBGebaeude.CurrentRaumindex !== -1) {

                    this.DBGebaeude.CurrentRaum = this.DBGebaeude.CurrentGeschoss.Raumliste[this.DBGebaeude.CurrentRaumindex];
                  }
                  else this.DBGebaeude.CurrentRaumindex = null;
                }
              }
              else this.DBGebaeude.CurrentGeschossindex = null;
            }
          }
          else this.DBGebaeude.CurrentBauteilindex = null;
        }
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Gebaeude Raumauswahl', 'PrepareData', this.Debug.Typen.Page);
    }
  }

  ngAfterViewInit(): void {

    try {


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Gebaeude Raumauswahl', 'AfterViewInit', this.Debug.Typen.Component);
    }
  }



  CancelButtonClicked() {


    this.CancelClickedEvent.emit();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Gebaeude Raumauswahl', 'CancelButtonClicked', this.Debug.Typen.Component);
    }
  }

  OkButtonClicked() {


    try {

      this.DBProjektpunkte.CurrentProjektpunkt.BauteilID  = this.DBGebaeude.CurrentBauteil  !== null ? this.DBGebaeude.CurrentBauteil.BauteilID   : null;
      this.DBProjektpunkte.CurrentProjektpunkt.GeschossID = this.DBGebaeude.CurrentGeschoss !== null ? this.DBGebaeude.CurrentGeschoss.GeschossID : null;
      this.DBProjektpunkte.CurrentProjektpunkt.RaumID     = this.DBGebaeude.CurrentRaum     !== null ? this.DBGebaeude.CurrentRaum.RaumID         : null;

      this.OkClickedEvent.emit();


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Gebaeude Raumauswahl', 'OkButtonClicked', this.Debug.Typen.Component);
    }
  }

  ContentClicked(event: MouseEvent) {

    event.preventDefault();
    event.stopPropagation();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Gebaeude Raumauswahl', 'ContentClicked', this.Debug.Typen.Component);
    }
  }

  BauteilIndexChanged(event: any) {

    try {

      if(event.detail.value !== null) {

        this.DBGebaeude.CurrentBauteilindex = event.detail.value;
        this.DBGebaeude.CurrentBauteil      = this.DB.CurrentProjekt.Bauteilliste[this.DBGebaeude.CurrentBauteilindex];
      }
      else {

        this.DBGebaeude.CurrentBauteilindex = null;
        this.DBGebaeude.CurrentBauteil      = null;
      }

      this.DBGebaeude.CurrentGeschossindex = null;
      this.DBGebaeude.CurrentGeschoss      = null;

      this.DBGebaeude.CurrentRaumindex     = null;
      this.DBGebaeude.CurrentRaum          = null;


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Gebaeude Raumauswahl', 'BauteilIndexChanged', this.Debug.Typen.Component);
    }
  }

  GeschossIndexChanged(event: any) {

    try {

      if(event.detail.value !== null) {

        this.DBGebaeude.CurrentGeschossindex = event.detail.value;
        this.DBGebaeude.CurrentGeschoss      = this.DB.CurrentProjekt.Bauteilliste[this.DBGebaeude.CurrentBauteilindex].Geschossliste[this.DBGebaeude.CurrentGeschossindex];
      }
      else {

        this.DBGebaeude.CurrentGeschossindex = null;
        this.DBGebaeude.CurrentGeschoss      = null;
      }

      this.DBGebaeude.CurrentRaumindex     = null;
      this.DBGebaeude.CurrentRaum          = null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Gebaeude Raumauswahl', 'GeschossIndexChanged', this.Debug.Typen.Component);
    }
  }

  RaumIndexChanged(event: any) {

    try {

      if(event.detail.value !== null) {

        this.DBGebaeude.CurrentRaumindex = event.detail.value;
        this.DBGebaeude.CurrentRaum      = this.DB.CurrentProjekt.Bauteilliste[this.DBGebaeude.CurrentBauteilindex].Geschossliste[this.DBGebaeude.CurrentGeschossindex].Raumliste[this.DBGebaeude.CurrentRaumindex];
      }
      else {

        this.DBGebaeude.CurrentRaumindex = null;
        this.DBGebaeude.CurrentRaum      = null;
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Gebaeude Raumauswahl', 'RaumIndexChanged', this.Debug.Typen.Component);
    }
  }
}
