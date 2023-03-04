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

@Component({
  selector: 'page-header-menu',
  templateUrl: './page-header-menu.component.html',
  styleUrls: ['./page-header-menu.component.scss'],
})
export class PageHeaderMenuComponent implements OnInit, OnDestroy, AfterViewInit{

  @ViewChild('Suchleiste', { static: false }) Suchleiste: IonSearchbar;

  @Input()  ShowSandortfilter: boolean;
  @Input()  ShowSuchleiste:    boolean;
  @Input()  Filterorigin:      string;
  @Input()  ShowStandorttitle:    boolean;
  @Input()  ShowMitarbeitertitle: boolean;
  @Input()  ShowProjektetitle:    boolean;
  @Input()  ShowFavoritentitle:   boolean;

  @Output()  SucheChanged = new EventEmitter<string>();
  @Output()  StandortfilterClicked = new EventEmitter<string>();
  @Output()  ZeitspanneFilterClicked = new EventEmitter<string>();
  @Output()  LeistungsphaseFilterClicked = new EventEmitter<any>();
  @Output()  FavoritenClicked = new EventEmitter<number>();
  @Output()  FilterChanged = new EventEmitter<string>();

  private SuchleisteInputSubscription: Subscription;
  private SuchleisteClearSubscription: Subscription;
  private FavoritenSubscription: Subscription;
  public Inputtimer: any;
  public Projektauswahlbreite: number;
  public Wochentaghoehe: number;
  public Tagbreite: number;
  public HomeMouseOver: boolean;

  constructor(private Debug: DebugProvider,
              public Basics: BasicsProvider,
              public Const: ConstProvider,
              public DBMitarbeiter: DatabaseMitarbeiterService,
              private DBMitarbeitersettings: DatabaseMitarbeitersettingsService,
              public Auswahlservice: AuswahlDialogService,
              public  DBStandort: DatabaseStandorteService,
              public DBProjekte: DatabaseProjekteService,
              public DBProjektpunkte: DatabaseProjektpunkteService,
              public  AuthService: DatabaseAuthenticationService,
              public  Pool: DatabasePoolService,
              public  Menuservice: MenueService) {

    try {

      this.ShowSuchleiste               = false;
      this.SuchleisteClearSubscription  = null;
      this.SuchleisteInputSubscription  = null;
      this.FavoritenSubscription        = null;
      this.Inputtimer                   = null;
      this.ShowSandortfilter            = false;
      this.Projektauswahlbreite         = 200;
      this.Filterorigin                 = this.Const.NONE;
      this.Wochentaghoehe               = 30;
      this.Tagbreite                    = 0;
      this.HomeMouseOver                = false;
      this.ShowStandorttitle            = false;
      this.ShowMitarbeitertitle         = false;
      this.ShowProjektetitle            = false;
      this.ShowFavoritentitle           = false;

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

  ngOnInit() {

    try {

      this.Projektauswahlbreite = this.Basics.Contentbreite - 630;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Page Header Menu', 'OnInit', this.Debug.Typen.Component);
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

      /*
      this.FavoritenSubscription = this.DBProjekte.CurrentFavoritenChanged.subscribe(() => {

        debugger;

        this.DBProjekte.InitProjektfavoritenliste();

        this.Pool.ReadProjektdaten(this.DBProjekte.Projektliste).then(() => {


          this.DBProjekte.InitMenuProjektauswahl();
          this.Pool.LoadingAllDataFinished.emit();
        });
      });

       */
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

  GetMainMenueColor(mainmenubereich: string) {

    try {

      return mainmenubereich === this.Menuservice.MainMenuebereich ? 'burnicklgruen' : 'weis';

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Page Header Menu', 'GetMainMenueColor', this.Debug.Typen.Component);
    }
  }

  GetProjekteMenueIconcolor(projektemenubereich: string) {

    try {

      return projektemenubereich === this.Menuservice.ProjekteMenuebereich ? 'burnicklgruen' : 'weis';

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Page Header Menu', 'GetProjekteMenueIconcolor', this.Debug.Typen.Component);
    }
  }

  GetProjekteMenueFontcolor(projektemenubereich: string) {

    try {

      return projektemenubereich === this.Menuservice.ProjekteMenuebereich ? '#c7d304' : 'white';

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

  FavoritenClickedHandler(settings: Projektauswahlmenuestruktur) {

    try {

      this.DBProjekte.CurrentFavoritprojektindex = settings.Index;

      switch (settings.Index) {

        case 1000: // = Favoriten

          break;

        case 1500: // = Meilensteine

          break;

        case 2000: // = Mein Tag

          // this.Menuservice.SetCurrentPage();

          break;

        case 3000: // = Meine Woche

          // this.Menuservice.SetCurrentPage();

          break;

        default:

          this.DBProjekte.CurrentProjekt = lodash.find(this.Pool.Gesamtprojektliste, (projekt: Projektestruktur) => {

            return projekt.Projektkey === settings.Projektkey;
          });

          this.Pool.Mitarbeitersettings.ProjektID = this.DBProjekte.CurrentProjekt._id;

          break;
      }

      if(settings.Index !== 1000) this.Pool.Mitarbeitersettings.Favoritprojektindex = settings.Index;

      this.DBMitarbeitersettings.UpdateMitarbeitersettings(this.Pool.Mitarbeitersettings);

      this.FavoritenClicked.emit(this.DBProjekte.CurrentFavoritprojektindex);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Page Header Menu', 'FavoritenClickedHandler', this.Debug.Typen.Component);
    }
  }

  GetProjektbuttoncolor(settings: Projektauswahlmenuestruktur) {

    try {

      switch (settings.Index) {

        default:

          return settings.Index === this.DBProjekte.CurrentFavoritprojektindex ? this.Basics.Farben.Burnicklgruen : 'white';

          break;
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Page Header Menu', 'GetProjektbuttoncolor', this.Debug.Typen.Component);
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

  MainMenueHomeButtonClicked() {

    try {



    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Page Header Menu', 'MainMenueHomeButtonClicked', this.Debug.Typen.Page);
    }
  }
}
