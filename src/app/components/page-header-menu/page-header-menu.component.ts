import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {DebugProvider} from "../../services/debug/debug";
import {BasicsProvider} from "../../services/basics/basics";
import {MenueService} from "../../services/menue/menue.service";
import {IonSearchbar} from "@ionic/angular";
import {Subscription} from "rxjs";
import {DatabaseStandorteService} from "../../services/database-standorte/database-standorte.service";
import {DatabaseMitarbeiterService} from "../../services/database-mitarbeiter/database-mitarbeiter.service";
import * as lodash from 'lodash-es';
import {Projektauswahlmenuestruktur} from "../../dataclasses/projektauswahlmenuestruktur";
import {Projektestruktur} from "../../dataclasses/projektestruktur";
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
import {DatabaseProtokolleService} from "../../services/database-protokolle/database-protokolle.service";
import {ConstProvider} from "../../services/const/const";
import {DatabaseProjekteService} from "../../services/database-projekte/database-projekte.service";
import {AuswahlDialogService} from "../../services/auswahl-dialog/auswahl-dialog.service";
import {DatabaseAuthenticationService} from "../../services/database-authentication/database-authentication.service";
import {HttpErrorResponse} from "@angular/common/http";
// import {LocalstorageService} from "../../services/localstorage/localstorage";
import {DatabaseProjektpunkteService} from "../../services/database-projektpunkte/database-projektpunkte.service";
import moment, {Moment} from "moment";
import {
  DatabaseMitarbeitersettingsService
} from "../../services/database-mitarbeitersettings/database-mitarbeitersettings.service";
import {Graphservice} from "../../services/graph/graph";
import {KostengruppenService} from "../../services/kostengruppen/kostengruppen.service";
import {DatabaseOutlookemailService} from "../../services/database-email/database-outlookemail.service";

@Component({
  selector: 'page-header-menu',
  templateUrl: './page-header-menu.component.html',
  styleUrls: ['./page-header-menu.component.scss'],
})
export class PageHeaderMenuComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('Suchleiste', { static: false }) Suchleiste: IonSearchbar;
  @ViewChild('Suchleiste2', { static: false }) Suchleiste2: IonSearchbar;

  @Input()  ShowSandortfilter: boolean;
  @Input()  ShowSuchleiste:    boolean;
  @Input()  Filterorigin:      string;
  @Input()  ShowStandorttitle:    boolean;
  @Input()  ShowMitarbeitertitle: boolean;
  @Input()  ShowProjektetitle:    boolean;
  @Input()  ShowFavoritentitle:   boolean;
  @Input()  SendFestlegungenEnabled:   boolean;

  @Output()  SucheChanged = new EventEmitter<string>();
  @Output()  StandortfilterClicked = new EventEmitter<string>();
  @Output()  ZeitspanneFilterClicked = new EventEmitter<string>();
  @Output()  LeistungsphaseFilterClicked = new EventEmitter<any>();
  @Output()  FilterChanged = new EventEmitter<string>();
  @Output()  ShowProjektauswahlEvent = new EventEmitter<any>();
  @Output()  ShowProjektfilesEvent = new EventEmitter<any>();
  @Output()  LOPListeZeitspanneEvent = new EventEmitter<any>();
  @Output()  KostengruppeFilterClicked = new EventEmitter<any>();
  @Output()  ShowOpenFestlegungOnlyEvent = new EventEmitter<any>();
  @Output()  SendFestlegungenClicked = new EventEmitter<any>();
  @Output()  ShowUngelesenOnlyChanged = new EventEmitter<any>();
  @Output()  ProjektsortierungChanged = new EventEmitter<any>();
  @Output()  EmailDatumChanged = new EventEmitter<any>();

  private SuchleisteInputSubscription: Subscription;
  private Suchleiste2InputSubscription: Subscription;
  private SuchleisteClearSubscription: Subscription;
  private Suchleiste2ClearSubscription: Subscription;
  private FavoritenSubscription: Subscription;
  public Inputtimer: any;
  public Projektauswahlbreite: number;
  public Wochentaghoehe: number;
  public Tagbreite: number;
  public HomeMouseOver: boolean;
  public EmailMouseOver: boolean;
  public FilesMouseOver: boolean;
  public ShowOpenFestlegungOnly: boolean;
  public BackMouseOver: boolean;

  constructor(private Debug: DebugProvider,
              public Basics: BasicsProvider,
              public Const: ConstProvider,
              public DBMitarbeiter: DatabaseMitarbeiterService,
              private DBMitarbeitersettings: DatabaseMitarbeitersettingsService,
              public Auswahlservice: AuswahlDialogService,
              public  DBStandort: DatabaseStandorteService,
              public DBProjekte: DatabaseProjekteService,
              public DBEmail: DatabaseOutlookemailService,
              public DBProjektpunkte: DatabaseProjektpunkteService,
              public GraphService: Graphservice,
              public  AuthService: DatabaseAuthenticationService,
              public  Pool: DatabasePoolService,
              public Kostengruppenservice: KostengruppenService,
              public  Menuservice: MenueService) {
    try {

      this.ShowSuchleiste               = false;
      this.SuchleisteClearSubscription  = null;
      this.Suchleiste2ClearSubscription = null;
      this.SuchleisteInputSubscription  = null;
      this.Suchleiste2InputSubscription = null;
      this.FavoritenSubscription        = null;
      this.Inputtimer                   = null;
      this.ShowSandortfilter            = false;
      this.Projektauswahlbreite         = 200;
      this.Filterorigin                 = this.Const.NONE;
      this.Wochentaghoehe               = 30;
      this.Tagbreite                    = 0;
      this.HomeMouseOver                = false;
      this.EmailMouseOver               = false;
      this.ShowStandorttitle            = false;
      this.ShowMitarbeitertitle         = false;
      this.ShowProjektetitle            = false;
      this.ShowFavoritentitle           = false;
      this.FilesMouseOver               = false;
      this.ShowOpenFestlegungOnly       = false;
      this.SendFestlegungenEnabled      = false;
      this.BackMouseOver                = false;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Page Header Menu', 'consturctor', this.Debug.Typen.Component);
    }
  }

  ngOnDestroy(): void {

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Page Header Menu', 'OnDestroy', this.Debug.Typen.Component);
    }
  }

  BackButtonClicked() {

    try {

      this.Menuservice.MainMenuebereich = this.Menuservice.MainMenuebereiche.Projekte;

      this.Menuservice.SetCurrentPage();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Page Header Menu', 'BackButtonClicked', this.Debug.Typen.Component);
    }
  }

  ngOnInit() {

    try {

      this.Projektauswahlbreite = this.Basics.Contentbreite - 630;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Page Header Menu', 'OnInit', this.Debug.Typen.Component);
    }
  }

  ProjektsortierungChangedHandler(event: { status: boolean; index: number; event: any }) {

    try {

      this.DBEmail.Projektsortierung = event.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Page Header Menu', 'ProjektsortierungChangedHandler', this.Debug.Typen.Component);
    }
  }

  ShowUngelesenCheckChanged(event: { status: boolean; index: number; event: any }) {

    try {

      this.DBEmail.ShowUngelesenOnly = event.status;

      this.ShowUngelesenOnlyChanged.emit();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Page Header Menu', 'ShowUngelesenCheckChanged', this.Debug.Typen.Component);
    }
  }

  async ngAfterViewInit() {

    try {

      let Text: string;

      this.Tagbreite = (this.Basics.Contentbreite - 4) / 5;

      if(this.Suchleiste) { // Muss hier stehen / funktioniert in OnInit() nicht

        this.SuchleisteInputSubscription = this.Suchleiste.ionInput.subscribe((data: any) => {

          Text = data.target.value;

          if(this.Inputtimer !== null) {

            window.clearTimeout(this.Inputtimer);

            this.Inputtimer = null;
          }

          if(Text.length >= 3 || Text.length === 0) {

            this.Inputtimer = window.setTimeout(()  => {

              this.SucheChanged.emit(Text);

            }, 600);
          }

        });

        this.SuchleisteClearSubscription = this.Suchleiste.ionClear.subscribe(() => {

          this.SucheChanged.emit('');
        });


      }
      else this.Suchleiste = null;

      if(this.Suchleiste2) { // Muss hier stehen / funktioniert in OnInit() nicht

        this.Suchleiste2InputSubscription = this.Suchleiste2.ionInput.subscribe((data: any) => {

          Text = data.target.value;

          if(this.Inputtimer !== null) {

            window.clearTimeout(this.Inputtimer);

            this.Inputtimer = null;
          }

          if(Text.length >= 3 || Text.length === 0) {

            this.Inputtimer = window.setTimeout(()  => {

              this.SucheChanged.emit(Text);

            }, 600);
          }

        });

        this.Suchleiste2ClearSubscription = this.Suchleiste2.ionClear.subscribe(() => {

          this.SucheChanged.emit('');
        });


      }
      else this.Suchleiste2 = null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Page Header Menu', 'ngAfterViewInit', this.Debug.Typen.Component);
    }
  }

  MainMenueButtonClicked(mainmenubereich: string) {

    try {

      this.Menuservice.MainMenuebereich = mainmenubereich;

      this.Menuservice.SetCurrentPage();
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Page Header Menu', 'MainMenueButtonClicked', this.Debug.Typen.Component);
    }
  }

  FirmaMenueButtonClicked(firmamenubereich: string) {

    try {

      this.Menuservice.FirmaMenuebereich = firmamenubereich;

      this.Menuservice.SetCurrentPage();
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Page Header Menu', 'FirmaMenueButtonClicked', this.Debug.Typen.Component);
    }
  }

  ProjekteMenueButtonClicked(projektmenubereich: string) {

    try {

      this.Menuservice.ProjekteMenuebereich = projektmenubereich;

      this.Menuservice.SetCurrentPage();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Page Header Menu', 'ProjekteMenueButtonClicked', this.Debug.Typen.Component);
    }
  }

  GetProjekteMenueIconcolor(projektemenubereich: string) {

    try {

      return projektemenubereich === this.Menuservice.ProjekteMenuebereich ? 'burnicklgruen' : 'weiss';

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Page Header Menu', 'GetProjekteMenueIconcolor', this.Debug.Typen.Component);
    }
  }

  GetProjekteMenueFontcolor(projektemenubereich: string) {

    try {

      return projektemenubereich === this.Menuservice.ProjekteMenuebereich ? '#000000' : 'white';

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Page Header Menu', 'GetProjekteMenueIconcolor', this.Debug.Typen.Component);
    }
  }

  StandortButtonClicked() {

    try {

      this.StandortfilterClicked.emit();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Page Header Menu', 'StandortButtonClicked', this.Debug.Typen.Component);
    }
  }

  ZeitspaneClickedHandler(origin: string) {

    try {

      this.ZeitspanneFilterClicked.emit(origin);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Page Header Menu', 'ZeitspaneClickedHandler', this.Debug.Typen.Component);
    }
  }

  LeistungsphaseClickedHandler() {

    try {

      this.LeistungsphaseFilterClicked.emit();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Page Header Menu', 'LeistungsphaseClickedHandler', this.Debug.Typen.Component);
    }
  }

  StatusFilterChanged(event: any, Statusname: string) {

    try {

      let status = event.status;

      switch (Statusname) {

        case this.Const.Projektpunktstatustypen.Offen.Name:

          this.Pool.Mitarbeitersettings.AufgabenShowOffen = status;

          break;

        case this.Const.Projektpunktstatustypen.Geschlossen.Name:

          this.Pool.Mitarbeitersettings.AufgabenShowGeschlossen= status;

          break;

        case this.Const.Projektpunktstatustypen.Bearbeitung.Name:

          this.Pool.Mitarbeitersettings.AufgabenShowBearbeitung = status;

          break;

        case this.Const.Projektpunktstatustypen.Ruecklauf.Name:

          this.Pool.Mitarbeitersettings.AufgabenShowRuecklauf = status;

          break;

        case 'Meilenstein':

          this.Pool.Mitarbeitersettings.AufgabenShowMeilensteinOnly = status;

          break;
      }

      this.DBMitarbeitersettings.UpdateMitarbeitersettings(this.Pool.Mitarbeitersettings).then(() => {

        this.FilterChanged.emit(Statusname);

      }).catch((error: HttpErrorResponse) => {

        this.Debug.ShowErrorMessage(error.message, 'Page Header Menu', 'StatusFilterChanged', this.Debug.Typen.Component);
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Page Header Menu', 'StatusFilterChanged', this.Debug.Typen.Component);
    }
  }

  StatusFilterShowFaelligOnlyChanged(event: { status: boolean; index: number; event: any }) {

    try {

      // this.DBProjekte.CurrentProjekt.Aufgabenlistefilter.FilterShowFaelligOnly = event.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Page Header Menu', 'StatusFilterShowFaelligOnlyChanged', this.Debug.Typen.Component);
    }
  }

  GetZeitfilterButtontext(): string {

    try {


      switch (this.Filterorigin) {

        case this.Auswahlservice.Auswahloriginvarianten.Aufgabenliste_Zeitfilter:

          switch (this.Pool.Mitarbeitersettings.AufgabenTerminfiltervariante) {

            case this.Const.Faelligkeitsterminfiltervarianten.Seit_dem_Zeitpunkt:

              return 'Seit dem Zeitpunkt';

              break;

            case this.Const.Faelligkeitsterminfiltervarianten.Bis_zum_Zeitpunkt:

              return 'Bis zum Zeitpunkt';

              break;

            case this.Const.Faelligkeitsterminfiltervarianten.Zeitspanne:

              return 'Zeitspanne';

              break;

            case this.Const.Faelligkeitsterminfiltervarianten.Nur_diesen_Monat:

              return 'Monat';

              break;

            case this.Const.Faelligkeitsterminfiltervarianten.Nur_diese_Woche:

              return 'Woche';

              break;

            default:

              return 'Zeitfilter';

              break;
          }

          break;

        default:

          return 'Zeitfilter';

          break;

      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Page Header Menu', 'GetZeitfilterButtontext', this.Debug.Typen.Component);
    }
  }

  GetZeitfilterButtonwert(): string {

    try {

      let Starttag: Moment;
      let Endetag: Moment;
      let Text: string = '';

      if(this.Pool.Mitarbeitersettings !== null) {

        switch (this.Filterorigin) {

          case this.Auswahlservice.Auswahloriginvarianten.Aufgabenliste_Zeitfilter:

            switch (this.Pool.Mitarbeitersettings.AufgabenTerminfiltervariante) {

              case this.Const.Faelligkeitsterminfiltervarianten.Seit_dem_Zeitpunkt:

                if(this.Pool.Mitarbeitersettings.AufgabenTerminfilterStartwert !== null) {

                  Starttag = moment(this.Pool.Mitarbeitersettings.AufgabenTerminfilterStartwert);

                  return Starttag.format('DD.MM.YYYY');
                }
                else return 'Unbekannt';

                break;

              case this.Const.Faelligkeitsterminfiltervarianten.Bis_zum_Zeitpunkt:

                if(this.Pool.Mitarbeitersettings.AufgabenTerminfilterEndewert !== null) {

                  Endetag = moment(this.Pool.Mitarbeitersettings.AufgabenTerminfilterEndewert);

                  return Endetag.format('DD.MM.YYYY');
                }
                else return 'Unbekannt';

                break;

              case this.Const.Faelligkeitsterminfiltervarianten.Zeitspanne:

                if(this.Pool.Mitarbeitersettings.AufgabenTerminfilterStartwert !== null) {

                  Starttag = moment(this.Pool.Mitarbeitersettings.AufgabenTerminfilterStartwert);

                  Text += Starttag.format('DD.MM.YYYY');
                }
                else Text += 'Unbekannt';

                Text += ' - ';

                if(this.Pool.Mitarbeitersettings.AufgabenTerminfilterEndewert !== null) {

                  Endetag = moment(this.Pool.Mitarbeitersettings.AufgabenTerminfilterEndewert);

                  Text += Endetag.format('DD.MM.YYYY');
                }
                else Text += 'Unbekannt';

                return Text;

                break;

              case this.Const.Faelligkeitsterminfiltervarianten.Nur_diesen_Monat:

                return 'Unbekannt';

                break;

              case this.Const.Faelligkeitsterminfiltervarianten.Nur_diese_Woche:

                return 'Unbekannt';

                break;

              default:

                return 'kein Filter';

                break;
            }

            break;

          default:

            return 'Zeitfilter';

            break;

        }

      }


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Page Header Menu', 'GetZeitfilterButtonwert', this.Debug.Typen.Component);
    }
  }


  MeintagClicked() {

    try {

      this.Menuservice.Aufgabenlisteansicht = this.Menuservice.Aufgabenlisteansichten.Mein_Tag;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Page Header Menu', 'MeintagClicked', this.Debug.Typen.Component);
    }
  }

  MeilensteineClicked() {

    try {

      this.Menuservice.Aufgabenlisteansicht = this.Menuservice.Aufgabenlisteansichten.Meilensteine;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Page Header Menu', 'MeilensteineClicked', this.Debug.Typen.Component);
    }
  }

  ProjektClicked() {

    try {

      if(this.Menuservice.Aufgabenlisteansicht !== this.Menuservice.Aufgabenlisteansichten.Projekt) {

        this.Menuservice.Aufgabenlisteansicht = this.Menuservice.Aufgabenlisteansichten.Projekt;
      }
      else {

        this.ShowProjektauswahlEvent.emit();
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Page Header Menu', 'ProjektClicked', this.Debug.Typen.Component);
    }
  }

  MeineWocheClicked() {

    try {

      this.Menuservice.Aufgabenlisteansicht = this.Menuservice.Aufgabenlisteansichten.Meine_Woche;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Page Header Menu', 'MeineWocheClicked', this.Debug.Typen.Component);
    }
  }

  ProjektGoBackClicked() {

    try {

      if(this.DBProjekte.CurrentProjektindex > 0) {

        this.DBProjekte.CurrentProjektindex--;

        this.DBProjekte.CurrentProjekt                    = this.DBProjekte.Projektliste[this.DBProjekte.CurrentProjektindex];
        this.Pool.Mitarbeitersettings.Favoritprojektindex = this.DBProjekte.CurrentProjektindex;
        this.Pool.Mitarbeitersettings.ProjektID           = this.DBProjekte.CurrentProjekt._id;

        this.DBMitarbeitersettings.UpdateMitarbeitersettings(this.Pool.Mitarbeitersettings);

        this.DBProjekte.CurrentFavoritenProjektChanged.emit();
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Page Header Menu', 'ProjektGoBackClicked', this.Debug.Typen.Component);
    }
  }

  ProjektGoForwardClicked() {

    try {

      if(this.DBProjekte.CurrentProjektindex < this.DBProjekte.Projektliste.length - 1) {

        this.DBProjekte.CurrentProjektindex++;
        this.DBProjekte.CurrentProjekt = this.DBProjekte.Projektliste[this.DBProjekte.CurrentProjektindex];

        this.Pool.Mitarbeitersettings.Favoritprojektindex = this.DBProjekte.CurrentProjektindex;
        this.Pool.Mitarbeitersettings.ProjektID           = this.DBProjekte.CurrentProjekt._id;

        this.DBMitarbeitersettings.UpdateMitarbeitersettings(this.Pool.Mitarbeitersettings);

        this.DBProjekte.CurrentFavoritenProjektChanged.emit();
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Page Header Menu', 'ProjektGoForwardClicked', this.Debug.Typen.Component);
    }
  }

  GetProjektBackButtoncolor(): string {

    try {

      if(this.Menuservice.Aufgabenlisteansicht === this.Menuservice.Aufgabenlisteansichten.Projekt && this.DBProjekte.CurrentProjektindex > 0) {

        return 'grau';
      }
      else {

        return 'silber';
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Page Header Menu', 'GetProjektBackButtoncolor', this.Debug.Typen.Component);
    }
  }

  GetProjektForwardButtoncolor(): string {

    try {

      if(this.Menuservice.Aufgabenlisteansicht === this.Menuservice.Aufgabenlisteansichten.Projekt && this.DBProjekte.CurrentProjektindex < this.DBProjekte.Projektliste.length - 1) {

        return 'grau';
      }
      else {

        return 'silver';
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Page Header Menu', 'GetProjektForwardButtoncolor', this.Debug.Typen.Component);
    }
  }

  ProjektfilesClicked() {

    try {

      this.ShowProjektfilesEvent.emit();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Page Header Menu', 'ProjektfilesClicked', this.Debug.Typen.Component);
    }
  }

  GetKostengruppenname(): string {

    try {

      let Name: string;

      if(this.Pool.Mitarbeitersettings !== null) {

        Name = this.Kostengruppenservice.GetKostengruppennameByGruppennummern(
          this.Pool.Mitarbeitersettings.UnterkostengruppeFilter,
          this.Pool.Mitarbeitersettings.HauptkostengruppeFilter,
          this.Pool.Mitarbeitersettings.OberkostengruppeFilter,
        );

        return Name !== null ? Name : 'Alle';

        return Name;

      }
      else {

        return 'Alle';
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Page Header Menu', 'GetKostengruppenname', this.Debug.Typen.Component);
    }

  }

  ShowOpenFestlegungOnlyChanged(event: { status: boolean; index: number; event: any }) {

    try {

      this.ShowOpenFestlegungOnly = event.status;

      this.ShowOpenFestlegungOnlyEvent.emit(event.status);

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Page Header Menu', 'ShowOpenFestlegungOnlyChanged', this.Debug.Typen.Component);
    }
  }

  GetMailDatum(): any {

    try {

      return this.DBEmail.Emaildatum;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Page Header Menu', 'GetMailDatum', this.Debug.Typen.Component);
    }
  }

  EmailDatumChangedHandler(datum: moment.Moment) {

    try {

      this.DBEmail.Emaildatum = datum.clone();

      this.EmailDatumChanged.emit();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Page Header Menu', 'EmailDatumChangedHandler', this.Debug.Typen.Component);
    }
  }
}
