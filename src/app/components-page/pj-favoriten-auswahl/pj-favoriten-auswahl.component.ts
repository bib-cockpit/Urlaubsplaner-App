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
import {HttpErrorResponse} from "@angular/common/http";
import {Mitarbeitersettingsstruktur} from "../../dataclasses/mitarbeitersettingsstruktur";
import {
  DatabaseMitarbeitersettingsService
} from "../../services/database-mitarbeitersettings/database-mitarbeitersettings.service";

@Component({
  selector: 'pj-favoriten-auswahl',
  templateUrl: './pj-favoriten-auswahl.component.html',
  styleUrls: ['./pj-favoriten-auswahl.component.scss'],
})

export class PjFavoritenAuswahlComponent implements OnInit, OnDestroy, AfterViewInit {

  public Valid: boolean;
  public Projektliste: Projektestruktur[];
  public Datenliste: Projektestruktur[][];
  public DataSubscription: Subscription;
  private Favorit: Favoritenstruktur;

  @Output() CancelClickedEvent    = new EventEmitter<any>();
  @Output() OkClickedEvent        = new EventEmitter<any>();
  @Output() FavoritClickedEvent   = new EventEmitter<any>();


  @Input() Titel: string;
  @Input() Iconname: string;
  @Input() Dialogbreite: number;
  @Input() Dialoghoehe: number;
  @Input() PositionY: number;
  @Input() ZIndex: number;

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
      this.Favorit           = null;
      this.DataSubscription  = null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Favoriten Auswahl', 'constructor', this.Debug.Typen.Component);
    }
  }

  ngOnDestroy(): void {

      try {

        this.Displayservice.RemoveDialog(this.Displayservice.Dialognamen.Favoritenauswahl);

        if(this.DataSubscription !== null) {

          this.DataSubscription.unsubscribe();
          this.DataSubscription = null;
        }

      } catch (error) {

        this.Debug.ShowErrorMessage(error.message, 'Favoriten Auswahl', 'OnDestroy', this.Debug.Typen.Component);
      }

    }

  ngOnInit() {

    try {


      this.Displayservice.AddDialog(this.Displayservice.Dialognamen.Favoritenauswahl, this.ZIndex);

      this.DataSubscription = this.Pool.LoadingAllDataFinished.subscribe(() => {

        this.PrepareData();
      });


      this.PrepareData();



    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Favoriten Auswahl', 'OnInit', this.Debug.Typen.Component);
    }
  }


  ngAfterViewInit(): void {

    try {

      this.Favorit = lodash.cloneDeep(this.DBProjekte.CurrentFavorit);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Favoriten Auswahl', 'AfterViewInit', this.Debug.Typen.Component);
    }
  }


  CancelButtonClicked() {

    if(this.DBProjekte.CurrentFavorit === null) {

      this.DBProjekte.CurrentFavoritprojektindex = null;
      // this.Pool.Mitarbeitersettings.ProjektID = null;
    }
    else {

      if(this.DBProjekte.Favoritenprojekteanzahl > 0) {

        this.DBProjekte.CurrentFavoritprojektindex = 0;
      }
      else {

        this.DBProjekte.CurrentFavoritprojektindex = null;
      }
    }

    this.CancelClickedEvent.emit();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Favoriten Auswahl', 'CancelButtonClicked', this.Debug.Typen.Component);
    }
  }

  async OkButtonClicked() {

    try {

      this.DBProjekte.CurrentFavorit = lodash.cloneDeep(this.Favorit);

      if(this.DBProjekte.CurrentFavorit === null) {

        this.Pool.Mitarbeitersettings.FavoritenID      = null;
        this.DBProjekte.CurrentFavoritenlisteindex     = null;
        this.Pool.Mitarbeitersettings.ProjektID        = null;
      }
      else {

        this.Pool.Mitarbeitersettings.FavoritenID  = this.DBProjekte.CurrentFavorit.FavoritenID;
        this.DBProjekte.CurrentFavoritenlisteindex = lodash.findIndex(this.Pool.Mitarbeiterdaten.Favoritenliste, {FavoritenID: this.DBProjekte.CurrentFavorit.FavoritenID});
        this.Pool.Mitarbeitersettings.ProjektID    = null;
      }

      await this.DBMitarbeitersettings.UpdateMitarbeitersettings(this.Pool.Mitarbeitersettings);

      this.DBProjekte.InitProjektfavoritenliste();

      await this.Pool.ReadProjektdaten(this.DBProjekte.Projektliste);

      this.DBProjekte.InitMenuProjektauswahl();

      this.Pool.LoadingAllDataFinished.emit();
      this.DBProjekte.CurrentFavoritenChanged.emit();
      this.OkClickedEvent.emit();


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Favoriten Auswahl', 'OkButtonClicked', this.Debug.Typen.Component);
    }
  }

  ContentClicked(event: MouseEvent) {

    event.preventDefault();
    event.stopPropagation();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Favoriten Auswahl', 'ContentClicked', this.Debug.Typen.Component);
    }
  }

  private PrepareData() {

    try {

      let Favoritenindex: number = 0;
      let Projektindex: number = 0;
      let Projekt: Projektestruktur;

      this.Datenliste = [];

      if (this.Pool.Mitarbeiterdaten !== null) {

        for (let Favorit of this.Pool.Mitarbeiterdaten.Favoritenliste) {

          this.Datenliste[Favoritenindex] = [];

          Projektindex = 0;

          for (let ProjektID of this.Pool.Mitarbeiterdaten.Favoritenliste[Favoritenindex].Projekteliste) {

            Projekt = lodash.find(this.Pool.Gesamtprojektliste, {_id: this.Pool.Mitarbeiterdaten.Favoritenliste[Favoritenindex].Projekteliste[Projektindex]});

            if (!lodash.isUndefined(Projekt)) this.Datenliste[Favoritenindex].push(Projekt);

            Projektindex++;
          }

          Favoritenindex++;
        }
      }


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Favoriten Auswahl', 'PrepareData', this.Debug.Typen.Component);
    }
  }

  GetStandortname(StandortID: string) {

    try {

      let Standort: Standortestruktur = lodash.find(this.Pool.Standorteliste, {_id: StandortID});

      if(!lodash.isUndefined(Standort)) return Standort.Ort;
      else return 'unbekannt';

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Favoriten Auswahl', 'GetStandortname', this.Debug.Typen.Component);
    }
  }

  FavoritButtonClicked(Favorit: Favoritenstruktur) {

    try {

      this.Favorit = Favorit;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Favoriten Auswahl', 'FavoritButtonClicked', this.Debug.Typen.Component);
    }
  }
}
