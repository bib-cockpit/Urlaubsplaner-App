import {
  AfterViewInit,
  Component,
  EventEmitter, Input, OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {DebugProvider} from "../../services/debug/debug";
import {DisplayService} from "../../services/diplay/display.service";
import {ConstProvider} from "../../services/const/const";
import {Subscription} from "rxjs";
import {Projektestruktur} from "../../dataclasses/projektestruktur";
import * as lodash from "lodash-es";
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
import {DatabaseStandorteService} from "../../services/database-standorte/database-standorte.service";
import {Favoritenstruktur} from "../../dataclasses/favoritenstruktur";
import {DatabaseProjekteService} from "../../services/database-projekte/database-projekte.service";
import {Standortestruktur} from "../../dataclasses/standortestruktur";
import {DatabaseMitarbeiterService} from "../../services/database-mitarbeiter/database-mitarbeiter.service";
import {
  DatabaseMitarbeitersettingsService
} from "../../services/database-mitarbeitersettings/database-mitarbeitersettings.service";

@Component({
  selector: 'pj-projekte-schnellauswahl',
  templateUrl: './pj-projekte-schnellauswahl.component.html',
  styleUrls: ['./pj-projete-schnellauswahl.component.scss'],
})

export class PjProjeteSchnellauswahlComponent implements OnInit, OnDestroy, AfterViewInit {

  public Valid: boolean;
  public Projektliste: Projektestruktur[];
  public Datenliste: Projektestruktur[];
  public DataSubscription: Subscription;

  @Output() CancelClickedEvent    = new EventEmitter<any>();
  @Output() OkClickedEvent        = new EventEmitter<any>();
  @Output() ProjektClickedEvent   = new EventEmitter<Projektestruktur>();


  @Input() Titel: string;
  @Input() Iconname: string;
  @Input() Dialogbreite: number;
  @Input() Dialoghoehe: number;
  @Input() PositionY: number;
  @Input() ZIndex: number;

  public CurrentIndex: number;

  constructor(public Debug: DebugProvider,
              public Displayservice: DisplayService,
              public Const: ConstProvider,
              public  Pool: DatabasePoolService,
              private DBMitarbeiter: DatabaseMitarbeiterService,
              private DBMitarbeitersettings: DatabaseMitarbeitersettingsService,
              public DBStandort: DatabaseStandorteService,
              public DBProjekte: DatabaseProjekteService) {
    try {

      this.Titel             = this.Const.NONE;
      this.Iconname          = 'location-outline';
      this.Dialogbreite      = 700;
      this.Dialoghoehe       = 300;
      this.PositionY         = 100;
      this.ZIndex            = 2000;
      this.Projektliste      = [];
      this.Datenliste        = [];
      this.DataSubscription  = null;
      this.CurrentIndex      = -1;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Aufgabe Projektauswahl', 'constructor', this.Debug.Typen.Component);
    }
  }

  ngOnDestroy(): void {

      try {

        this.Displayservice.RemoveDialog(this.Displayservice.Dialognamen.AufgabeProjektauswahl);

        if(this.DataSubscription !== null) {

          this.DataSubscription.unsubscribe();
          this.DataSubscription = null;
        }

      } catch (error) {

        this.Debug.ShowErrorMessage(error.message, 'Aufgabe Projektauswahl', 'OnDestroy', this.Debug.Typen.Component);
      }

    }

  ngOnInit() {

    try {


      this.Displayservice.AddDialog(this.Displayservice.Dialognamen.AufgabeProjektauswahl, this.ZIndex);

      this.DataSubscription = this.Pool.LoadingAllDataFinished.subscribe(() => {

        this.PrepareData();
      });


      this.PrepareData();



    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Aufgabe Projektauswahl', 'OnInit', this.Debug.Typen.Component);
    }
  }


  ngAfterViewInit(): void {

    try {


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Aufgabe Projektauswahl', 'AfterViewInit', this.Debug.Typen.Component);
    }
  }


  CancelButtonClicked() {

    this.CancelClickedEvent.emit();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Aufgabe Projektauswahl', 'CancelButtonClicked', this.Debug.Typen.Component);
    }
  }

  ContentClicked(event: MouseEvent) {

    event.preventDefault();
    event.stopPropagation();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Aufgabe Projektauswahl', 'ContentClicked', this.Debug.Typen.Component);
    }
  }

  private PrepareData() {

    try {

      let Projektindex: number = 0;
      let Projekt: Projektestruktur;

      this.Datenliste  = [];
      this.Dialoghoehe = 100;

      if (this.Pool.Mitarbeiterdaten !== null) {

        debugger;

        for (let ProjektID of this.Pool.Mitarbeiterdaten.Favoritenliste[this.DBProjekte.CurrentFavoritenlisteindex].Projekteliste) {

          Projekt = lodash.find(this.DBProjekte.Gesamtprojektliste, {_id: this.Pool.Mitarbeiterdaten.Favoritenliste[this.DBProjekte.CurrentFavoritenlisteindex].Projekteliste[Projektindex]});

          if (!lodash.isUndefined(Projekt)) this.Datenliste.push(Projekt);

          Projektindex++;
        }

        this.Dialoghoehe = this.Datenliste.length * 40 + 2 * 56;
      }


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Aufgabe Projektauswahl', 'PrepareData', this.Debug.Typen.Component);
    }
  }

  GetStandortname(StandortID: string) {

    try {

      let Standort: Standortestruktur = lodash.find(this.Pool.Standorteliste, {_id: StandortID});

      if(!lodash.isUndefined(Standort)) return Standort.Ort;
      else return 'unbekannt';

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Aufgabe Projektauswahl', 'GetStandortname', this.Debug.Typen.Component);
    }
  }


  ProjektButtonClicked(Projekt: Projektestruktur) {

    try {

      this.ProjektClickedEvent.emit(Projekt);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Aufgabe Projektauswahl', 'ProjektButtonClicked', this.Debug.Typen.Component);
    }
  }
}
