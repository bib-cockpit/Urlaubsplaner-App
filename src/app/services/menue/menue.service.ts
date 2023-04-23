import { Injectable } from '@angular/core';
import {DebugProvider} from "../debug/debug";
import {ToolsProvider} from "../tools/tools";
import {ConstProvider} from "../const/const";
import {DatabaseAuthenticationService} from "../database-authentication/database-authentication.service";
import {DatabaseProjekteService} from "../database-projekte/database-projekte.service";

@Injectable({
  providedIn: 'root'
})
export class MenueService {

  public MainMenuebereich: string;
  public MainMenuebereiche = {

    Home:          'Home',
    Debug:         'Debug',
    Logout:        'Logout',
    Einstellungen: 'Einstellungen',
    Projekte:      'Projekte',
  };

  public ProjekteMenuebereich: string;
  public ProjekteMenuebereiche = {

    Aufgabenliste: 'Aufgabenliste',
    Protokolle:    'Protokolle',
    LOPListe:      'LOP Liste',
    Bautagebuch:   'Bautagebuch',
    Festlegungen:  'Festlegungen',
    Fileliste:     'Fileliste',
  };

  public Aufgabenlisteansicht: string;
  public Aufgabenlisteansichten = {

    Mein_Tag:     'Mein Tag',
    Meine_Woche:  'Meine Woche',
    Meilensteine: 'Meilensteine',
    Projekt:      'Projekt'
  };

  public FirmaMenuebereich: string;
  public FirmaMenuebereiche = {

    Standorte:   'Standorte',
    Mitarbeiter: 'Mitarbeiter',
    Projekte:    'Projekte',
    Favoriten:   'Favoriten',
    Play:        'Play'
  };

  public FilelisteAufrufer: string;
  public FilelisteAufrufervarianten = {

    Aufgabenliste: 'Aufgabenliste',
    Protokollliste: 'Protokollliste',
    LOPListe:      'LOP Liste',
    Bautagebuch:   'Bautagebuch',
    Festlegungen:  'Festlegungen',
  };

  constructor(private Debug: DebugProvider,
              private Tools: ToolsProvider,
              private DBProjekte: DatabaseProjekteService,
              private AuthService: DatabaseAuthenticationService,
              private Const: ConstProvider) {

    try {

      this.MainMenuebereich     = this.MainMenuebereiche.Projekte;
      this.FirmaMenuebereich    = this.FirmaMenuebereiche.Projekte;
      this.ProjekteMenuebereich = this.ProjekteMenuebereiche.Aufgabenliste;
      this.Aufgabenlisteansicht = this.Aufgabenlisteansichten.Projekt;
      this.FilelisteAufrufer    = this.FilelisteAufrufervarianten.Aufgabenliste;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Menue', 'constructor', this.Debug.Typen.Service);
    }
  }


  public SetCurrentPage() {

    try {

      switch (this.MainMenuebereich) {

        case this.MainMenuebereiche.Home:

          this.Tools.SetRootPage(this.Const.Pages.HomePage);

          break;

        case this.MainMenuebereiche.Projekte:

          switch (this.ProjekteMenuebereich) {

            case this.ProjekteMenuebereiche.Aufgabenliste:

              switch (this.Aufgabenlisteansicht) {

                case this.Aufgabenlisteansichten.Mein_Tag:

                    this.Tools.SetRootPage(this.Const.Pages.PjAufgabenlistePage);

                  break;

                case this.Aufgabenlisteansichten.Meilensteine:

                  this.Tools.SetRootPage(this.Const.Pages.PjAufgabenlistePage);

                  break;

                case this.Aufgabenlisteansichten.Projekt:

                  this.Tools.SetRootPage(this.Const.Pages.PjAufgabenlistePage);

                  break;
              }

              break;

            case this.ProjekteMenuebereiche.Fileliste:

              this.Tools.PushPage(this.Const.Pages.PjFilebrowserPage);

              break;

            case this.ProjekteMenuebereiche.Protokolle:

              this.Tools.SetRootPage(this.Const.Pages.PjProtokolleListePage);

              break;

            case this.ProjekteMenuebereiche.LOPListe:

              this.Tools.SetRootPage(this.Const.Pages.PjBaustelleLoplistePage);

              break;

            case this.ProjekteMenuebereiche.Bautagebuch:

              this.Tools.SetRootPage(this.Const.Pages.PjBaustelleTagebuchlistePage);

              break;

            case this.ProjekteMenuebereiche.Festlegungen:

              this.Tools.SetRootPage(this.Const.Pages.PjFestlegungslistePage);

              break;
          }

          break;
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Menue', 'SetCurrentPage', this.Debug.Typen.Service);
    }
  }
}
