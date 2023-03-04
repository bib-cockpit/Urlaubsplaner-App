import {ElementRef, Injectable} from '@angular/core';
import {Platform} from '@ionic/angular';
// import {Startseitestruktur} from '../../datenstrukturen/startseitestruktur';
import {PageHeaderComponent} from '../../components/page-header/page-header';
import {PageFooterComponent} from '../../components/page-footer/page-footer';
// import {Colorstruktur} from '../../datenstrukturen/colorstruktur';
// import {Deviceinfostruktur} from "../../datenstrukturen/deviceinfostruktur";
import {Mitarbeiterstruktur} from '../../dataclasses/mitarbeiterstruktur';
import {Mitarbeitersettingsstruktur} from "../../dataclasses/mitarbeitersettingsstruktur";
import {ConstProvider} from "../const/const";
import {LOPListefelderSettingsstruktur} from "../../dataclasses/loplistefeldersettingsstruktur";


@Injectable({

  providedIn: 'root'
})
export class BasicsProvider {

  public Pagebreite: number           = 0;
  public Pagehoehe: number            = 0;
  public Headerhoehe: number          = 0;
  public Footerhoehe: number          = 0;
  public Contenthoehe: number         = 0;
  public Contentbreite: number        = 0;
  public InnerContenthoehe: number    = 0;
  public Waittime: number             = 300;
  public ClickTime: number            = 130;
  public Svgpath: string              = 'assets/svgs/';
  public readonly AppVersionName: string       = '0.01';
  public readonly AppVersionDatum: string      = '16.12.2022';
  public readonly DeveloperEmail: string = 'p.hornburger@gmil.com';
  public readonly DeveloperName: string = 'Hornburger';
  public readonly DeveloperVorname: string = 'Peter';


  public Farben = {

    Gruen:         '#006400',
    Burnicklgruen: '#c7d304',
    Buttoncolor:   '#444444',
    Blau:          '#00008B',
    Orange:        '#FF8C00',
    Bordercolor:   '#3880ff',
    Burnicklbraun: '#7b6a58',
    Burnicklgrau:  '#354547',
    ButtongrauDisabled: '#444444'
  };

  public Ionicfarben = {

    BurnicklGruen: 'burnicklgruen',
    BurnicklGrau:  'burnicklgrau',
    BurnicklBraun: 'burnicklbraun',
    Gruen:         'gruen',
    Orange:        'orange',
    Grau:          'grau',
    Silber:        'silber',
    Schwarz:       'schwarz',
    Weiss:         'weiss',
    Rot:           'rot',
    Blau:          'blau',
    Dunkelblau:    'dunkelblau',
    Braun:         'braun',
    Teal:          'teal',
    Gelb:          'gelb'
  };

  /*
  private _Developeremail: string       = 'info@alinea-software.net';
  private _Imagepath: string            = 'assets/images/';
  private _Iconpath: string             = 'assets/icons/';
  private _Svgpath: string              = 'assets/svgs/';
  private _Buttoniconpath: string       = 'assets/svgs/buttonicons/';
  private _Datapath: string             = 'assets/data/';
  private _PDFpath: string              = 'assets/pdf/';

   */


  // public Appiconpath: string            = this.Svgpath + 'appicon/proicon.svg';
  // private _DeviceID                     = -1;
  /*
  private _Startseitesetup: Startseitestruktur = null;
  private _Zeiterfassungsetup: Zeiterfassungsetupstruktur = null;
  private _Zeitjahresuebersichtsetup: Jahresuebersichtsetupstruktur = null;
  private _ZeitMonatsuebersichtsetup: Jahresuebersichtsetupstruktur = null;
  private _ConsolenOutput: boolean      = true;
  private _Sprache: string              = 'de';

   */
  // public   Schriftgroesse: number       = 15;

  /*
  public   StandartSchriftgroesse: number = 15;
  private _Titelschriftgroesse: number  = 16;
  private _Smallschriftgroesse: number  = 12;
  private _Titelcolor: string           = '#0099CC';
  private _Bordercolor: string          = '#3880ff';
  private _Contentcolor: string         = '#000000';
  private _Listenendehoehe: number      = 100;
  private _Einheitenbreite: number      = 40;
  private _Einheitenhoehe: number       = 40;
  private _Buttonbreite: number         = 40;
  private _Buttonhoehe: number          = 40;
  private _ValueButtonhoehe: number     = 40;
  private _Buttoncolor: string          = '#444444';
  private _Buttonclickedcolor: string   = '#0099cc';
  private _Buttonaktivcolor: string     = '#ff6600';
  private _Buttonabstand: number        = 6;
  private _Buttonradius: number         = 6;
  private _SmallButtonradius: number    = 3;

  private _PageBorderbreite: number     = 1;
  private _Menubuttonhoehe: number      = 40;
  private _Menubilderhoehe: number      = 40;
  private _Backgroundcolor: string      = '#000000';

  private _AppVersion: number           = 211;
  private _MobilMenufaktor: number      = 0.85;
  private _TabletMenufaktor: number     = 0.3;
  private _ClickTime: number            = 60;
  private _Timeout: number              = 5000;
  private _Menucontenthoehe: number     = 0;
  private _Formelschriftgroesse: number = 0;
  private _NoSpacingClass: string      = 'NoSpacingClass';
  private _InfoTableClass: string      = 'InfoTableClass';
  private _TablePaddingClass: string   = 'TablePaddingClass';
  private _TableSpacingClass: string   = 'TableSpacingClass';
  private _MathWhiteClass: string      = 'MathWhiteClass';
  private _MathBlueClass: string       = 'MathBlueClass';
  public  NoBorderClass: string        = 'NoBorderClass';
  private _Infobreite: number          = 20;
  private _Waittime                    = 2000;
  private  _CanPlaySound: boolean      = true;
  private _DB_Strukturversion: number  = 3;
  private _Treebuttonbreite:   number  = 0;
  private _Treebuttonhoehe:    number  = 0;
  private _Treeformelbuttonhoehe:    number  = 0;
  private _Aktivierung:    string          = 'none';
  private _Geraetename: string = '';
  private _StartsUntilRate: number = 3;
  private  _StoreAppID;
  private _Urlaubsanspruch: number = 24;
  private _ShowCryptschluessel: boolean = false;
  private _Synchzeitraumindex: number = 2;
  private _MeassureDiv: ElementRef;
  private _PageHeader: PageHeaderComponent = null;
  private _PageFooter: PageFooterComponent = null;
  public Farben;
  public TopSpaceHeight: number    = 0;
  public CanStartPage: boolean = false;
  public AppNameShort: string = 'BIB Cockpit';
  public LastRootPage: string;
  public DebugMessage: string[]  = [];
  public Orientation: string;
  public Screensizekategorie: string;
  private _InnerContenthoehe: number;
  public Localstorage: string;
  public Ionicfarben;
  public MenueIsVisible: boolean = true;
  public Devicesize: number = 0;
  public MathJaxLoaded: boolean = false;
  public ShowStatuszeile: number = 1;
  // public Hintergrundfarbe: Colorstruktur;
  // public Hintergrundfarben: Colorstruktur[] = [];
  public Standardhintergrundfarbe: Colorstruktur;

   */
  /*
  public Deviceinfo: Deviceinfostruktur;

   */
  public Packagename: string;
  // public Firmendaten: Firmendatenstruktur = null;
  // public Mitarbeiterdaten: Mitarbeiterstruktur = null;
  // public Firmenadresse: Adressbuchstruktur;
  private _Audioprofilindex  : number  = 1;
  public  ShowFehlerbericht: boolean  = true;


  private _ValueButtonabstand: number;
  // private _AppName: string = this.AppNameShort;
  public IsAdmin: boolean = false;

  constructor(public platform: Platform, public Const: ConstProvider) {



    /*

    this._StoreAppID = [];
    this._StoreAppID.android_pro  = 'de.kabelbuecherei.pro';
    this._StoreAppID.android_edu  = 'de.kabelbuecherei.edu';
    this._StoreAppID.android_lite = 'de.kabelbuecherei.application';
    this._StoreAppID.ios_pro      = 'id1124298404';
    this._StoreAppID.ios_lite     = 'id1184167292';
    this._StoreAppID.ios_edu      = 'id1217097549';

    this._Zeitjahresuebersichtsetup = {

      Abkuerzungen: false,
      Abwesenheit: false,
      Arbeitszeit: true,
      Krankenstand: false,
      Pause: false,
      Regiestunden: true,
      Stunden: true,
      Ueberstunden: true,
      Urlaub: false
    };

    this.DebugMessage = [];
     */
  }


    /*
  set Synchzeitraumindex(value: number) { this._Synchzeitraumindex = value; }
  set Audioprofilindex  (value: number) { this._Audioprofilindex   = value; }
  set Startseitesetup   (value: Startseitestruktur) { this._Startseitesetup          = value; }
  set Zeiterfassungsetup   (value: Zeiterfassungsetupstruktur) { this._Zeiterfassungsetup         = value; }
  set Zeitjahresuebersichtsetup   (value: Jahresuebersichtsetupstruktur) { this._Zeitjahresuebersichtsetup          = value; }
  set ZeitMonatsuebersichtsetup   (value: Jahresuebersichtsetupstruktur) { this._ZeitMonatsuebersichtsetup          = value; }

  get Datapath          ():any { return this._Datapath; }
  get Zeitjahresuebersichtsetup   ():Jahresuebersichtsetupstruktur { return this._Zeitjahresuebersichtsetup; }
  get ZeitMonatsuebersichtsetup   ():Jahresuebersichtsetupstruktur { return this._ZeitMonatsuebersichtsetup; }
  get Startseitesetup   ():Startseitestruktur { return this._Startseitesetup; }
  get Zeiterfassungsetup   ():Zeiterfassungsetupstruktur { return this._Zeiterfassungsetup; }
  get Audioprofilindex  ():number { return this._Audioprofilindex  ; }
  get AppVersionDatum    ():string { return this._AppVersionDatum            ; }
  get Urlaubsanspruch(): number { return this._Urlaubsanspruch           ; }
  get AppName(): string { return this._AppName; }
  get Developeremail(): string      { return this._Developeremail;     }
  get AppVersionName(): string      { return this._AppVersionName;     }
  get AppVersion(): number      { return this._AppVersion;     }
  get ConsolenOutput(): boolean { return this._ConsolenOutput; }
  get Sprache():string          { return this._Sprache; }
  get Waittime():number         { return this._Waittime; }

  get Imagepath(): string { return this._Imagepath; }
  get Iconpath(): string { return this._Iconpath; }
  get Svgpath(): string { return this._Svgpath; }
  get Buttoniconpath(): string { return this._Buttoniconpath; }

  get Backgroundcolor(): string { return this._Backgroundcolor; }

  get NoSpacingClass(): string { return this._NoSpacingClass; }
  get InfoTableClass(): string { return this._InfoTableClass; }
  get TableSpacingClass(): string { return this._TableSpacingClass; }
  get TablePaddingClass(): string { return this._TablePaddingClass; }
  get MathWhiteClass(): string { return this._MathWhiteClass; }
  get MathBlueClass(): string { return this._MathBlueClass; }
  get Pagehoehe(): number        { return this._Pagehoehe;   }
  get Contenthoehe(): number     { return this._Contenthoehe; }
  get Contentbreite(): number     { return this._Contentbreite; }
  get InnerContenthoehe(): number     { return this._InnerContenthoehe; }
  get Buttonbreite(): number { return this._Buttonbreite; }
  get Buttonhoehe(): number { return this._Buttonhoehe; }
  get Buttonabstand(): number { return this._Buttonabstand; }
  get Buttoncolor(): string { return this._Buttoncolor; }
  get Buttonclickedcolor(): string { return this._Buttonclickedcolor; }
  get Buttonaktivcolor(): string { return this._Buttonaktivcolor; }
  get Menubuttonhoehe(): number { return this._Menubuttonhoehe; }
  get Einheitenbreite(): number { return this._Einheitenbreite; }
  get Headerhoehe(): number { return this._Headerhoehe; }
  get PageBorderbreite(): number { return this._PageBorderbreite; }
  get Titelcolor(): string { return this._Titelcolor; }
  get Bordercolor(): string { return this._Bordercolor; }
  get Contentcolor(): string { return this._Contentcolor; }
  get Titelschriftgroesse(): number { return this._Titelschriftgroesse; }
  get TabletMenufaktor(): number { return this._TabletMenufaktor; }
  get CanPlaySound(): boolean { return this._CanPlaySound; }
  get ClickTime(): number { return this._ClickTime; }
  get Timeout(): number { return this._Timeout; }
  get Infobreite(): number { return this._Infobreite; }
  get ValueButtonabstand(): number { return this._ValueButtonabstand; }


  */

  /*

  public GetNewMitarbeitersettings(): Mitarbeitersettingsstruktur {

    try {

      return {

        _id:                     null,
        MitarbeiterID:           null,
        FavoritenID:             null,
        ProjektID:               null,
        StandortFilter:          null,
        AufgabenShowBearbeitung: true,
        AufgabenShowGeschlossen: false,
        AufgabenShowOffen:       true,
        AufgabenShowRuecklauf:   true,
        Deleted:                 false

        /*
        StandortFilter:         this.Const.NONE,
        ProjektID:              this.Const.NONE,
        Faelligkeitsspanne:     this.Const.NONE,
        Listenmodus:            this.Const.NONE,
        FilterShowBearbeitung:  true,
        FilterShowGeschlossen:  true,
        FilterShowMeilensteine: true,
        FilterShowOffen:        true,
        FilterShowRuecklauf:    true,
        FilterShowFaelligOnly:  false,
        LOPShowEmptyProjekte:   false,
        LOPFullscreen:          false,
        HeadermenueMaxProjekte: 6,

        Zeitfilter:             this.Const.NONE,
        Einfachlistefeldersettings:  this.GetLOPListefelderEinfachSetting(),
        Zweifachlistefeldersettings: this.GetLOPListefelderZweifachSetting(),
        Dreifachlistefeldersettings: this.GetLOPListefelderDreifachSetting()

         */

  /*
      };

    } catch (error) {

      console.log(error.message);
    }

  }
   */


  public GetLOPListefelderEinfachSetting(): LOPListefelderSettingsstruktur {

    try {

      return {
        ShowAufgabe:     true,
        ShowBemerkung:   true,
        ShowNummer:      true,
        ShowStartdatum:  true,
        ShowStatus:      true,
        ShowTage:        true,
        ShowTermin:      true,
        ShowFortschritt: true,
        ShowZustaendig:  true,
        ShowMeintag:     true,
        ShowZeitansatz:  true
      };
    } catch (error) {

    }
  }

  public GetLOPListefelderZweifachSetting(): LOPListefelderSettingsstruktur {

    try {

      return {
        ShowAufgabe:     true,
        ShowBemerkung:   true,
        ShowNummer:      true,
        ShowStartdatum:  true,
        ShowTermin:      true,
        ShowTage:        false,
        ShowStatus:      true,
        ShowFortschritt: false,
        ShowZustaendig:  false,
        ShowMeintag:     true,
        ShowZeitansatz:  false,
      };
    } catch (error) {


    }
  }

  public GetLOPListefelderDreifachSetting(): LOPListefelderSettingsstruktur {

    try {

      return {
        ShowNummer:      false,
        ShowStartdatum:  false,
        ShowAufgabe:     true,
        ShowBemerkung:   false,
        ShowTermin:      true,
        ShowTage:        false,
        ShowStatus:      true,
        ShowFortschritt: false,
        ShowZustaendig:  false,
        ShowMeintag:     true,
        ShowZeitansatz:  false
      };
    } catch (error) {

    }
  }

  public MeassureInnercontent(header: PageHeaderComponent, footer: PageFooterComponent) {

    try {

      if(typeof header !== 'undefined' && header !== null) {

        this.Headerhoehe = header.PageHeaderDiv.nativeElement.clientHeight;
      }
      else this.Headerhoehe = 56;

      if(typeof footer !== 'undefined' &&footer !== null) {

        this.Footerhoehe = footer.PageFooterFrameDiv.nativeElement.clientHeight;
      }
      else this.Footerhoehe = 55;

      this.InnerContenthoehe = this.Contenthoehe - this.Headerhoehe - this.Footerhoehe;


      console.log('Basics MeassureScreen -> Screenbreite: ' + this.platform.width() + ' / Screenhoehe: ' + this.platform.height());
      console.log('Basics MeassureScreen -> Headerhoehe: ' + this.Headerhoehe + ' / Footerhoehe: ' + this.Footerhoehe);
      console.log('Basics MeassureScreen -> InnerContenthoehe: ' + this.InnerContenthoehe);
    }
    catch (error) {

      window.console.log(error +  ' / Basics '  + ' / MeassureInnercontent ');
    }
  }
}
