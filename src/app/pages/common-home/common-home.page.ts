import {Component, OnDestroy, OnInit} from '@angular/core';
import {BasicsProvider} from "../../services/basics/basics";
import {DebugProvider} from "../../services/debug/debug";
import {ToolsProvider} from "../../services/tools/tools";
import {ConstProvider} from "../../services/const/const";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoadingAnimationService} from "../../services/loadinganimation/loadinganimation";
import {DatabaseAuthenticationService} from "../../services/database-authentication/database-authentication.service";
import {MenueService} from "../../services/menue/menue.service";
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
import * as lodash from "lodash-es";
import {DatabaseProjekteService} from "../../services/database-projekte/database-projekte.service";


@Component({
  selector: 'common-home-page',
  templateUrl: './common-home.page.html',
  styleUrls: ['./common-home.page.scss'],
})
export class CommonHomePage implements OnInit, OnDestroy {

  public Title: string;
  public StandortMouseOver: boolean;
  public MitarbeiterMouseOver: boolean;
  public ProjekteMouseOver: boolean;
  public FavoritenMouseOver: boolean;
  public LogoutMouseOver: boolean;
  public DebugMouseOver: boolean;
  public EinstellungenMouseOver: boolean;
  public PlayMouseOver: boolean;
  public BackgroundimageURL: string;
  public Backgroundinterval: any;

  constructor(public Basics: BasicsProvider,
              public Debug: DebugProvider,
              public Tools: ToolsProvider,
              public Const: ConstProvider,
              public fb: FormBuilder,
              public Pool: DatabasePoolService,
              public DBProjekte: DatabaseProjekteService,
              public AuthService: DatabaseAuthenticationService,
              private Menuservice: MenueService) {
    try
    {
      this.StandortMouseOver      = false;
      this.MitarbeiterMouseOver   = false;
      this.ProjekteMouseOver      = false;
      this.FavoritenMouseOver     = false;
      this.LogoutMouseOver        = false;
      this.DebugMouseOver         = false;
      this.EinstellungenMouseOver = false;
      this.PlayMouseOver          = false;
      this.BackgroundimageURL     = '../../../assets/background/' + lodash.random(1, 36, false).toString() + '.jpg';
      this.Backgroundinterval     = null;
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error, 'Home', 'constructor', this.Debug.Typen.Page);
    }
  }

  ngOnInit(): void {

    try {



    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Home', 'OnInit', this.Debug.Typen.Page);
    }
  }

  ionViewDidEnter() {

    try {

      let Nummer: number;

      this.Menuservice.MainMenuebereich = this.Menuservice.MainMenuebereiche.Home;

      this.Backgroundinterval = window.setInterval(() => {

        Nummer = lodash.random(1, 36, false);

        this.BackgroundimageURL = '../../../assets/background/' + Nummer.toString() + '.jpg';


      }, 60000);

    }
    catch (error) {

      this.Debug.ShowErrorMessage(error, 'Home', 'ionViewDidEnter', this.Debug.Typen.Page);
    }
  }

  ionViewDidLeave() {

    try {

      this.Backgroundinterval = null;

    }
    catch (error) {

      this.Debug.ShowErrorMessage(error, 'Home', 'ionViewDidLeave', this.Debug.Typen.Page);
    }
  }

  ngOnDestroy(): void {

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Home', 'OnDestroy', this.Debug.Typen.Page);
    }
  }

  FavoritChangedHandler(event: any) {

    try {

      this.DBProjekte.CurrentFavorit = lodash.find(this.Pool.Mitarbeiterdaten.Favoritenliste, {FavoritenID: event.detail.value});

      debugger;

      if(lodash.isUndefined(this.DBProjekte.CurrentFavorit)) this.DBProjekte.CurrentFavorit = null;

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

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Home', 'FavoritChangedHandler', this.Debug.Typen.Page);
    }
  }

  DebugButtonClicked() {

    try {

      this.Tools.SetRootPage(this.Const.Pages.DebugPage);

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Home', 'DebugButtonClicked', this.Debug.Typen.Page);
    }
  }

  EinstellungenButtonClicked() {

    try {

      this.Tools.SetRootPage(this.Const.Pages.EinstellungenPage);

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Home', 'EinstellungenButtonClicked', this.Debug.Typen.Page);
    }
  }

  LogoutButtonClicked() {

    try {

      this.AuthService.Logout();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Home', 'LogoutButtonClicked', this.Debug.Typen.Page);
    }
  }

  StandorteButtonClicked() {

    try {

      this.Tools.SetRootPage(this.Const.Pages.FiStandortelistePage);

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Home', 'StandorteButtonClicked', this.Debug.Typen.Page);
    }
  }

  MitarbeiterButtonClicked() {

    try {

      this.Tools.SetRootPage(this.Const.Pages.FiMitarbeiterlistePage);

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Home', 'MitarbeiterButtonClicked', this.Debug.Typen.Page);
    }
  }

  ProjekteButtonClicked() {

    try {

      this.Tools.SetRootPage(this.Const.Pages.PjListePage);

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Home', 'ProjekteButtonClicked', this.Debug.Typen.Page);
    }
  }

  FavoritenButtonClicked() {

    try {

      this.Tools.SetRootPage(this.Const.Pages.PjFavoritenlistePage);

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Home', 'FavoritenButtonClicked', this.Debug.Typen.Page);
    }
  }

  PlayButtonClicked() {

    try {

      if(this.DBProjekte.CurrentFavorit !== null) {

        this.Menuservice.MainMenuebereich     = this.Menuservice.MainMenuebereiche.Projekte;
        this.Menuservice.ProjekteMenuebereich = this.Menuservice.ProjekteMenuebereiche.LOPListe;

        this.Tools.SetRootPage(this.Const.Pages.PjAufgabenlistePage);
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Home', 'PlayButtonClicked', this.Debug.Typen.Page);
    }
  }

  GetFavoritenlistehoehe(): number {

    try {

      let Anzahl: number = 0;

      if(this.Pool.Mitarbeiterdaten !== null) {

        Anzahl = this.Pool.Mitarbeiterdaten.Favoritenliste.length === 0 ? 2 : this.Pool.Mitarbeiterdaten.Favoritenliste.length;
      }

      return  Anzahl * 50;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Home', 'GetFavoritenlistehoehe', this.Debug.Typen.Page);
    }
  }
}
