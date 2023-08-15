import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DebugProvider} from "../../services/debug/debug";
import {Favoritenstruktur} from "../../dataclasses/favoritenstruktur";
import * as lodash from 'lodash-es';
import {BasicsProvider} from "../../services/basics/basics";
import {PageHeaderComponent} from "../../components/page-header/page-header";
import {PageFooterComponent} from "../../components/page-footer/page-footer";
import {AuswahlDialogService} from "../../services/auswahl-dialog/auswahl-dialog.service";
import {ConstProvider} from "../../services/const/const";
import {Auswahldialogstruktur} from "../../dataclasses/auswahldialogstruktur";
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
import {DatabaseStandorteService} from "../../services/database-standorte/database-standorte.service";
import {cloneDeep} from "lodash-es";
import {DatabaseMitarbeiterService} from "../../services/database-mitarbeiter/database-mitarbeiter.service";
import {Projektestruktur} from "../../dataclasses/projektestruktur";
import {DatabaseProjekteService} from "../../services/database-projekte/database-projekte.service";
import {Standortestruktur} from "../../dataclasses/standortestruktur";
import {Subscription} from "rxjs";
import {Projektbeteiligtestruktur} from "../../dataclasses/projektbeteiligtestruktur";
import {
  DatabaseMitarbeitersettingsService
} from "../../services/database-mitarbeitersettings/database-mitarbeitersettings.service";


@Component({
  selector: 'pj-favoriten-liste-page',
  templateUrl: './pj-favoriten-liste.page.html',
  styleUrls: ['./pj-favoriten-liste.page.scss'],
})
export class PjFavoritenListePage implements OnInit, OnDestroy {

  @ViewChild('PageHeader', { static: false }) PageHeader: PageHeaderComponent;
  @ViewChild('PageFooter', { static: false }) PageFooter: PageFooterComponent;

  public ShowEditor: boolean;
  public DialogPosY: number;
  public Dialoghoehe: number;
  public Dialogbreite: number;
  public ShowProjekteauswahl: boolean;
  public ProjekteauswahlTitel: string;
  public AuswahlIDliste: string[];
  private Auswahldialogorigin: string;
  public Auswahlliste: Auswahldialogstruktur[];
  public Auswahlindex: number;
  public Auswahltitel: string;
  public ShowAuswahl: boolean;
  public Datenliste: Projektestruktur[][];
  public DataSubscription: Subscription;
  private MitarbeiterSubscription: Subscription;

  constructor(public Debug: DebugProvider,
              public DBMitarbeiter: DatabaseMitarbeiterService,
              public DBStandort: DatabaseStandorteService,
              public Basics: BasicsProvider,
              public Auswahlservice: AuswahlDialogService,
              public Const: ConstProvider,
              public DBProjekt: DatabaseProjekteService,
              private DBMitarbeitersettings: DatabaseMitarbeitersettingsService,
              public Pool: DatabasePoolService) {

    try {

      this.ShowEditor           = false;
      this.Dialoghoehe          = 400;
      this.Dialogbreite         = 600;
      this.DialogPosY           = 100;
      this.ShowProjekteauswahl  = false;
      this.AuswahlIDliste       = [];
      this.Auswahldialogorigin  = this.Const.NONE;
      this.Auswahlliste         = [{ Index: 0, FirstColumn: '', SecoundColumn: '', Data: null}];
      this.Auswahlindex         = 0;
      this.Auswahltitel         = '';
      this.AuswahlIDliste       = [];
      this.ProjekteauswahlTitel = 'Projekte festlegen';
      this.Datenliste           = [];
      this.DataSubscription     = null;
      this.MitarbeiterSubscription = null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projekt Favoriten', 'constructor', this.Debug.Typen.Page);
    }
  }

  ngOnDestroy(): void {

    try {

      this.DataSubscription.unsubscribe();
      this.MitarbeiterSubscription.unsubscribe();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projekt Favoriten', 'OnDestroy', this.Debug.Typen.Page);
    }
  }

  private PrepareData() {

    try {

      let Favoritenindex: number = 0;
      let Projektindex: number   = 0;
      let Projekt: Projektestruktur;

      this.Datenliste = [];

      if(this.Pool.Mitarbeiterdaten !== null) {

        for (let Favorit of this.Pool.Mitarbeiterdaten.Favoritenliste) {

          this.Datenliste[Favoritenindex] = [];

          Projektindex = 0;


          for (let ProjektID of this.Pool.Mitarbeiterdaten.Favoritenliste[Favoritenindex].Projekteliste) {

            Projekt = lodash.find(this.DBProjekt.Gesamtprojektliste, {_id: this.Pool.Mitarbeiterdaten.Favoritenliste[Favoritenindex].Projekteliste[Projektindex]});

            if (!lodash.isUndefined(Projekt)) this.Datenliste[Favoritenindex].push(Projekt);

            Projektindex++;
          }

          this.Datenliste[Favoritenindex].sort( (a: Projektestruktur, b: Projektestruktur) => {

            if (a.Projektnummer < b.Projektnummer) return -1;
            if (a.Projektnummer > b.Projektnummer) return 1;
            return 0;
          });


          Favoritenindex++;
        }
      }


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projekt Favoriten', 'PrepareData', this.Debug.Typen.Page);
    }
  }
  ionViewDidLeave() {

    try {

    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projekt Favoriten', 'ionViewDidLeave', this.Debug.Typen.Page);
    }
  }

  public ionViewDidEnter() {

    try {

      this.Basics.MeassureInnercontent(this.PageHeader, this.PageFooter);

      this.Dialoghoehe  = this.Basics.Contenthoehe - this.DialogPosY - 100 - 100;
      this.Dialogbreite = this.Basics.Contentbreite - 100 - 100;
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projekt Favoriten', 'ionViewDidEnter', this.Debug.Typen.Page);
    }
  }

  ngOnInit() {

    try {

      this.DataSubscription = this.Pool.LoadingAllDataFinished.subscribe(() => {

        this.PrepareData();
      });

      this.MitarbeiterSubscription = this.Pool.MitarbeiterdatenChanged.subscribe(() => {

        this.PrepareData();
      });


      this.PrepareData();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projekt Favoriten', 'ngOnInit', this.Debug.Typen.Page);
    }
  }

  AddFavoritenButtonClicked() {

    try {

      this.DBProjekt.CurrentFavorit = lodash.cloneDeep(this.DBProjekt.GetEmptyProjektfavoriten());
      this.ShowEditor                 = true;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projekt Favoriten', 'AddFavoritenButtonClicked', this.Debug.Typen.Page);
    }
  }

  GetFavoritenTitel(): string {

    try {

      if(this.DBProjekt.CurrentFavorit !== null) {

        return this.DBProjekt.CurrentFavorit.FavoritenID === null ? 'Neue Favoriten anlegen' : 'Favoriten bearbeiten';

      }
      else return 'Unbekannt';

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projekt Favoriten', 'GetFavoritenTitel', this.Debug.Typen.Page);
    }
  }

  FavoritButtonClicked(favorit: Favoritenstruktur) {

    try {

      this.DBProjekt.CurrentFavorit = lodash.cloneDeep(favorit);
      this.ShowEditor                 = true;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projekt Favoriten', 'FavoritButtonClicked', this.Debug.Typen.Page);
    }
  }

  ProjekteauswahlOkButtonClicked(idliste: any) {

    try {

      this.ShowProjekteauswahl                      = false;
      this.DBProjekt.CurrentFavorit.Projekteliste = idliste;

      this.DBProjekt.CurrentFavoritenChanged.emit();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projekt Favoriten', 'ProjekteauswahlOkButtonClicked', this.Debug.Typen.Page);
    }
  }

  ProjekteStandortfilterClickedHandler() {

    try {

      let Index = 0;

      this.Auswahldialogorigin = this.Auswahlservice.Auswahloriginvarianten.Favoriten_Editor_Projekteauswahl_Standortfilter;

      this.ShowAuswahl   = true;
      this.Auswahltitel  = 'Standortfilter festlegen';
      this.Auswahlliste  = [];

      this.Auswahlliste.push({Index: Index, FirstColumn: 'kein Filter', SecoundColumn: '', Data: null});
      Index++;

      for(let Eintrag of this.Pool.Standorteliste) {

        this.Auswahlliste.push({ Index: Index, FirstColumn: Eintrag.Kuerzel, SecoundColumn: Eintrag.Standort, Data: Eintrag });
        Index++;
      }

      if(this.DBStandort.CurrentStandortfilter === null) {

        this.Auswahlindex = 0;
      }
      else {

        this.Auswahlindex = lodash.findIndex(this.Pool.Standorteliste, {_id: this.DBStandort.CurrentStandortfilter._id});
        this.Auswahlindex++;
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projekt Favoriten', 'StandortfilterClickedHandler', this.Debug.Typen.Page);
    }
  }

  GetDialogTitelicon(): string {

    try {

      switch (this.Auswahltitel) {


        case 'Standortfilter festlegen':

          return 'location-outline';

          break;


        default:

          return 'help-outline';

          break;
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projekt Favoriten', 'GetDialogTitelicon', this.Debug.Typen.Page);
    }
  }

  AuswahlOkButtonClicked(data: any) {

    try {

      let Filter: string;


      switch (this.Auswahldialogorigin) {

        case this.Auswahlservice.Auswahloriginvarianten.Favoriten_Editor_Projekteauswahl_Standortfilter:

          Filter =

          this.DBStandort.CurrentStandortfilter        = data;
          this.Pool.Mitarbeitersettings.StandortFilter = data !== null ? data._id : this.Const.NONE;

          this.DBMitarbeitersettings.UpdateMitarbeitersettings(this.Pool.Mitarbeitersettings).then(() => {

            this.DBStandort.StandortfilterChanged.emit();

          }).catch((error) => {

            this.Debug.ShowErrorMessage(error.message, 'Projekt Favoriten', 'AuswahlOkButtonClicked', this.Debug.Typen.Page);
          });

          this.DBStandort.StandortfilterChanged.emit();

          break;

        default:

          break;
      }

      this.ShowAuswahl = false;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projekt Favoriten', 'AuswahlOkButtonClicked', this.Debug.Typen.Page);
    }
  }

  public GetFavoritenanzahl(): number {

    try {

      let Anzahl: number = 0;

      if(this.Pool.Mitarbeiterdaten !== null) {

        Anzahl = this.Pool.Mitarbeiterdaten.Favoritenliste.length;
      }

      return Anzahl;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projekt Favoriten', 'GetFavoritenanzahl', this.Debug.Typen.Page);
    }
  }

  EditProjektlisteEventHandler() {

    try {

      this.ShowProjekteauswahl = true;
      this.AuswahlIDliste      = this.DBProjekt.CurrentFavorit.Projekteliste;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projekt Favoriten', 'EditProjektlisteEventHandler', this.Debug.Typen.Page);
    }
  }


  GetStandortname(StandortID: string) {

    try {

      let Standort: Standortestruktur = lodash.find(this.Pool.Standorteliste, {_id: StandortID});

      if(!lodash.isUndefined(Standort)) return Standort.Ort;
      else return 'unbekannt';

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projekt Favoriten', 'GetStandortname', this.Debug.Typen.Page);
    }
  }
}
