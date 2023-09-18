import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren, ViewEncapsulation
} from '@angular/core';
import {ToolsProvider} from '../../services/tools/tools';
import {BasicsProvider} from '../../services/basics/basics';
import {DebugProvider} from '../../services/debug/debug';
import {ConstProvider} from '../../services/const/const';
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
import {Subscription} from "rxjs";
import * as lodash from "lodash-es";
import {AuswahlDialogComponent} from "../../components/auswahl-dialog/auswahl-dialog";
import {Projektpunktestruktur} from "../../dataclasses/projektpunktestruktur";
import {Moment} from 'moment';
import moment from 'moment';
import {Projektbeteiligtestruktur} from "../../dataclasses/projektbeteiligtestruktur";
import {Mitarbeiterstruktur} from "../../dataclasses/mitarbeiterstruktur";
import {LoadingAnimationService} from "../../services/loadinganimation/loadinganimation";
import {DatabaseProjektpunkteService} from "../../services/database-projektpunkte/database-projektpunkte.service";
import {DatabaseProtokolleService} from "../../services/database-protokolle/database-protokolle.service";
import {DatabaseProjekteService} from "../../services/database-projekte/database-projekte.service";
import {DisplayService} from "../../services/diplay/display.service";
import {InputCloneComponent} from "../../components/input-clone/input-clone.component";
import {DatabaseProjektbeteiligteService} from "../../services/database-projektbeteiligte/database-projektbeteiligte.service";
import * as Joi from "joi";
import {Protokollstruktur} from "../../dataclasses/protokollstruktur";
import {ObjectSchema} from "joi";
import {HttpErrorResponse} from "@angular/common/http";
import {KostengruppenService} from "../../services/kostengruppen/kostengruppen.service";
import {Thumbnailstruktur} from "../../dataclasses/thumbnailstrucktur";
import {Teamsfilesstruktur} from "../../dataclasses/teamsfilesstruktur";
import {Graphservice} from "../../services/graph/graph";
// import tinymce from "../../../assets/tinymce/tinymce";

@Component({
  selector:    'pj-protokoll-editor',
  templateUrl: 'pj-protokoll-editor.component.html',
  styleUrls: ['pj-protokoll-editor.component.scss'],
  // encapsulation: ViewEncapsulation.ShadowDom,
})
export class PjProtokollEditorComponent implements OnDestroy, OnInit, AfterViewInit {

  @Output() OkClickedEvent              = new EventEmitter<any>();
  @Output() CancelClickedEvent          = new EventEmitter();
  @Output() TeamteilnehmerClicked       = new EventEmitter();
  @Output() BeteiligteteilnehmerClicked = new EventEmitter();
  @Output() AddProtokollpunktClicked    = new EventEmitter();
  @Output() ProtokollpunktClicked       = new EventEmitter();
  @Output() ValidChanged                = new EventEmitter<boolean>();
  @Output() ThumbnailClickedEvent       = new EventEmitter<{
    Index: number;
    Thumbliste: Thumbnailstruktur[];
  }>();

  public Bereiche = {

    Allgemein:   'Allgemein',
    Themenliste: 'Themenliste',
  };

  /*
  public HideAuswahl: boolean;
  public Auswahlliste: string[];
  public Auswahlindex: number;
  public Auswahltitel: string;

   */
  public Title: string;
  // public MyForm: FormGroup;
  // public Modus: string;
  public Projektbeteiligteliste: Projektbeteiligtestruktur[];
  public Teammitgliederliste: Mitarbeiterstruktur[];
  /*
  public Be_Spaltenanzahl: number;
  public Be_Zeilenanzahl: number;
  public Te_Spaltenanzahl: number;
  public Te_Zeilenanzahl: number;

   */
  public Punkteliste: Projektpunktestruktur[];
  private SaveTimer: any;
  public ProtokollSaved: boolean;
  public ShowDatumStatusDialog: boolean;
  public CanDelete: boolean;
  public CreatePDFRunning: boolean;
  public PageLoaded: boolean;
  public ShowUpload: boolean;
  public Zoomfaktorenliste: number[];
  public isHovering: boolean;
  public ProtokollSubscription: Subscription;
  public ProjektpunktSubscription: Subscription;
  public Valid: boolean;
  public Bereich: string;
  private JoiShema: ObjectSchema;
  public Gesamthoehe: number;
  public Titelhoehe: number;
  public Listeheaderhoehe: number;
  public Listehoehe: number;
  public LinesanzahlTeilnehmer: number;
  private MitarbeiterSubscription: Subscription;
  private BeteiligteSubscription: Subscription;
  public Thumbnailliste: Thumbnailstruktur[][][];
  public Zeilenanzahl: number;
  public Thumbbreite: number;
  public Spaltenanzahl: number;

  @Input() Titel: string;
  @Input() Iconname: string;
  @Input() Dialogbreite: number;
  @Input() Dialoghoehe: number;
  @Input() PositionY: number;
  @Input() ZIndex: number;

  constructor(public Basics: BasicsProvider,
              public Debug: DebugProvider,
              public Tools: ToolsProvider,
              public Const: ConstProvider,
              public DB: DatabaseProtokolleService,
              public DBProjekte: DatabaseProjekteService,
              public DBProjektpunkte: DatabaseProjektpunkteService,
              public KostenService: KostengruppenService,
              public Displayservice: DisplayService,
              public GraphService: Graphservice,
              private LoadingAnimation: LoadingAnimationService,
              private Pool: DatabasePoolService) {
    try {

      this.Bereich                  = this.Bereiche.Allgemein;
      this.Zoomfaktorenliste        = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 2, 3, 4];
      this.isHovering               = false;
      this.Gesamthoehe              = 0;
      this.Titelhoehe               = 0;
      this.Listeheaderhoehe         = 0;
      this.Listehoehe               = 0;
      this.LinesanzahlTeilnehmer    = 1;
      this.Valid                    = false;
      this.Projektbeteiligteliste   = [];
      this.Punkteliste              = [];
      this.Teammitgliederliste      = [];
      this.SaveTimer                = null;
      this.ProtokollSaved           = true;
      this.ShowDatumStatusDialog    = false;
      this.CanDelete                = false;
      this.CreatePDFRunning         = false;
      this.PageLoaded               = false;
      this.ShowUpload               = false;
      this.ProtokollSubscription    = null;
      this.ProjektpunktSubscription = null;
      this.MitarbeiterSubscription  = null;
      this.BeteiligteSubscription   = null;
      this.Titel = this.Const.NONE;
      this.Iconname = 'help-circle-outline';
      this.Dialogbreite = 400;
      this.Dialoghoehe = 300;
      this.PositionY = 100;
      this.ZIndex = 2000;
      this.Thumbnailliste = [];
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'constructor', this.Debug.Typen.Component);
    }
  }

  ngOnInit(): void {

    try {

      this.Displayservice.AddDialog(this.Displayservice.Dialognamen.Protokolleditor, this.ZIndex);

      this.SetupValidation();

      this.Gesamthoehe      = this.Dialoghoehe;
      this.Titelhoehe       = 70;
      this.Listeheaderhoehe = 30;
      this.Listehoehe       = this.Gesamthoehe - this.Titelhoehe - this.Listeheaderhoehe;
      this.CanDelete        = false;
      this.CreatePDFRunning = false;
      this.PageLoaded       = false;
      this.Bereich          = this.DB.CurrentProtokoll._id === null ? this.Bereiche.Allgemein : this.Bereiche.Themenliste;

      this.MitarbeiterSubscription = this.Pool.MitarbeiterAuswahlChanged.subscribe(() => {

        this.PrepareData();
      });

      this.BeteiligteSubscription = this.Pool.BeteiligteAuswahlChanged.subscribe(() => {

        this.PrepareData();
      });

      this.ProtokollSubscription = this.Pool.ProtokolllisteChanged.subscribe(() => {

        this.PrepareData();
      });

      this.ProjektpunktSubscription = this.Pool.ProtokollprojektpunktChanged.subscribe(() => {

        this.PrepareData();
      });

      this.PrepareData();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'OnInit', this.Debug.Typen.Component);
    }

  }

  ContentClicked(event: MouseEvent) {

    event.preventDefault();
    event.stopPropagation();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'ContentClicked', this.Debug.Typen.Component);
    }
  }


  ngOnDestroy(): void {

    try {


      this.Displayservice.RemoveDialog(this.Displayservice.Dialognamen.Protokolleditor);

      this.PageLoaded = false;

      if(this.ProtokollSubscription !== null) {

        this.ProtokollSubscription.unsubscribe();
        this.ProtokollSubscription = null;
      }

      if(this.ProjektpunktSubscription !== null) {

        this.ProjektpunktSubscription.unsubscribe();
        this.ProjektpunktSubscription = null;
      }

      if(this.MitarbeiterSubscription !== null) {

        this.MitarbeiterSubscription.unsubscribe();
        this.MitarbeiterSubscription = null;
      }

      if(this.BeteiligteSubscription !== null) {

        this.BeteiligteSubscription.unsubscribe();
        this.BeteiligteSubscription = null;
      }


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'OnDestroy', this.Debug.Typen.Component);
    }
  }


  public ionViewDidEnter() {

    try {

      this.PageLoaded = true;

      this.PrepareData();

    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'ionViewDidEnter', this.Debug.Typen.Component);
    }
  }

  ionViewDidLeave() {

    try {

      this.PageLoaded = false;
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'ionViewDidLeave', this.Debug.Typen.Component);
    }
  }

  /*

  AufgabeClickedHandler(Projektpunkt: Projektpunktestruktur) {

    try {


      tinymce.init({

        menubar:false,
        statusbar: false,
        selector: 'div#' + Projektpunkt._id,  // change this value according to your HTML
        auto_focus : true,
        // plugins: 'autoresize',
        // icons: 'material',
        language: 'de',
        browser_spellcheck: true,
        height: 200,
        // forced_root_block: 'span',
        base_url: 'assets/tinymce', // Root for resources
        suffix: '.min',        // Suffix to use when loading resources
        toolbar: [
          { name: 'history',     items: [ 'undo', 'redo' ] },
          { name: 'styles',      items: [ 'forecolor', 'backcolor', 'fontfamily', 'fontsize' ] },
          { name: 'formatting',  items: [ 'bold', 'italic', 'underline' ] },
          { name: 'alignment',   items: [ 'alignleft', 'aligncenter', 'alignright', 'alignjustify' ] },
          { name: 'indentation', items: [ 'outdent', 'indent' ] }
        ],
      });



      if(this.ShowUpload === false) {

        for(let Punkt of this.Punkteliste) {

          if(Punkt._id !== Projektpunkt._id)  Punkt.LiveEditor = false;
        }

        Projektpunkt.LiveEditor = true;

        this.LiveEditorOpen = true;
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Projektpunkteintrag', 'AufgabeClickedHandler', this.Debug.Typen.Component);
    }
  }

   */

  /*

  private PreparePersonen() {

    try {

      let Mitarbeiter: Mitarbeiterstruktur;
      let Projektbeteiligter: Projektbeteiligtestruktur;

      if(this.DB.CurrentProtokoll !== null) {

        this.Projektbeteiligteliste = [];

        for (let ProjektbeteiligteID of this.DB.CurrentProtokoll.ProjektbeteiligteIDListe) {

          Projektbeteiligter = <Projektbeteiligtestruktur>lodash.find(this.Pool.Projektbeteiligtenliste[this.DBProjekte.CurrentProjektindex], {ProjektbeteiligteID: ProjektbeteiligteID});

          if (lodash.isUndefined(Projektbeteiligter) === false) this.Projektbeteiligteliste.push(Projektbeteiligter);
        }

        this.Teammitgliederliste = [];

        for (let MitarbeiterID of this.DB.CurrentProtokoll.TeambeteiligtenIDListe) {

          Mitarbeiter = <Mitarbeiterstruktur>lodash.find(this.Pool.Mitarbeiterliste, {MitarbeiterID: MitarbeiterID});

          if (lodash.isUndefined(Mitarbeiter) === false) this.Teammitgliederliste.push(Mitarbeiter);
        }
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Projektpunkteintrag', 'PreparePersonen', this.Debug.Typen.Component);
    }
  }

   */

  private async PrepareData() {

    try {

      let Projektpunkt: Projektpunktestruktur;
      let Nummer: number = 1;
      let Thumb: Thumbnailstruktur, Merker: Thumbnailstruktur;
      let Anzahl: number;
      let Index: number;
      let Punktindex: number;
      let Liste: Thumbnailstruktur[] = [];
      let Imageliste: Teamsfilesstruktur[] = [];
      let File: Teamsfilesstruktur;


      if(this.DB.CurrentProtokoll !== null) {

        let AnzahlExtern   = this.DB.CurrentProtokoll.BeteiligExternIDListe.length;
        let AnzahlBurnickl = this.DB.CurrentProtokoll.BeteiligtInternIDListe.length;

        this.LinesanzahlTeilnehmer = Math.max(AnzahlExtern, AnzahlBurnickl);

        this.Punkteliste = [];

        for(let id of this.DB.CurrentProtokoll.ProjektpunkteIDListe) {

          Projektpunkt = lodash.find(this.Pool.Projektpunkteliste[this.DBProjekte.CurrentProjekt.Projektkey], (punkt: Projektpunktestruktur) => {

            return punkt._id === id && punkt.ProtokollID === this.DB.CurrentProtokoll._id;
          });

          if(lodash.isUndefined(Projektpunkt) === false) {

            this.Punkteliste.push(Projektpunkt);
          }
        }

        this.Punkteliste.sort((a: Projektpunktestruktur, b: Projektpunktestruktur) => {

          if (a.Startzeitsptempel < b.Startzeitsptempel) return -1;
          if (a.Startzeitsptempel > b.Startzeitsptempel) return 1;
          return 0;
        });

        for(let Punkt of this.Punkteliste) {

          Punkt.Nummer = Nummer.toString();
          Nummer++;
        }
      }

      this.DBProjektpunkte.CurrentProjektpunkteliste = lodash.cloneDeep(this.Punkteliste);

      // Bilder

      this.Thumbnailliste = [];
      this.Thumbbreite    = 140;
      this.Spaltenanzahl  = 4;
      Punktindex          = 0;

      for(let Punkt of this.DBProjektpunkte.CurrentProjektpunkteliste) {

        for(let Bild of Punkt.Bilderliste) {

          File        = this.GraphService.GetEmptyTeamsfile();
          File.id     = Bild.FileID;
          File.webUrl = Bild.WebUrl;

          Imageliste.push(File);
        }

        Liste = [];

        for(File of Imageliste) {

          Thumb        = await this.GraphService.GetSiteThumbnail(File);
          Thumb.weburl = File.webUrl;
          Merker       = lodash.find(Liste, {id: File.id});

          if(lodash.isUndefined(Merker)) Liste.push(Thumb);
        }

        debugger;

        Anzahl                          = Liste.length;
        this.Zeilenanzahl               = Math.ceil(Anzahl / this.Spaltenanzahl);
        this.Thumbnailliste[Punktindex] = [];
        Index                           = 0;

        for(let Zeilenindex = 0; Zeilenindex < this.Zeilenanzahl; Zeilenindex++) {

          this.Thumbnailliste[Punktindex][Zeilenindex] = [];

          for(let Spaltenindex = 0; Spaltenindex < this.Spaltenanzahl; Spaltenindex++) {

            if(!lodash.isUndefined(Liste[Index])) {

              this.Thumbnailliste[Punktindex][Zeilenindex][Spaltenindex] = Liste[Index];
            }
            else {

              this.Thumbnailliste[Punktindex][Zeilenindex][Spaltenindex] = null;
            }

            Index++;
          }
        }

        Punktindex++;
      }

      debugger;
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'PrepareData', this.Debug.Typen.Component);
    }
  }

  DeleteImageClicked(Projektpunkt: Projektpunktestruktur) {

    try {

      // this.DBProjektpunkte.CurrentProtokoll = Projektpunkt;

      /*
      this.StopSaveProtokollTimer();

      this.PoolStorage.DeleteProjektpunktImage(Projektpunkt, this.DBProjekte.CurrentProjekt).then(() => {

        this.StartSaveProtokollTimer();
      });

       */

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'ZoomImageClicked', this.Debug.Typen.Component);
    }
  }

  /*
  public AuswahlIndexChanged(Index: number) {

    try {

      switch (this.Auswahltitel) {

        case 'Bildzoom':

          this.StopSaveProtokollTimer();

          // this.DB.Projektpunkt.Filezoom = this.Zoomfaktorenliste[Index];

          this.StartSaveProtokollTimer();

          break;

        case 'Projektauswahl':

          this.StopSaveProtokollTimer();

          this.DBProjekte.CurrentProjekt          = this.Pool.Gesamtprojektliste[Index];
          this.DBProjekte.CurrentProjektindex            = Index;
          this.DB.CurrentProtokoll.ProjektID      = this.DBProjekte.CurrentProjekt._id;

          this.StartSaveProtokollTimer();

          break;

        case 'Leistungsphase':

          this.StopSaveProtokollTimer();

          this.DB.CurrentProtokoll.Leistungsphase = this.Auswahlliste[Index];

          this.StartSaveProtokollTimer();

          break;
      }

      this.HideAuswahl = true;
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'AuswahlIndexChanged', this.Debug.Typen.Component);
    }
  }

   */

  CancelButtonClicked() {

    try {


      this.CancelClickedEvent.emit();

      /*

      this.StopSaveProtokollTimer();

      if(this.ShowUpload === true) {

        this.ShowUpload = false;
      }
      else {

        this.Tools.PopPage();
      }

       */
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'CancelButtonClicked', this.Debug.Typen.Component);
    }
  }



  OkButtonClicked() {

    try {

      this.StopSaveProtokollTimer();

      if(this.Valid) {

        this.DB.SaveProtokoll().then(() => {



            this.OkClickedEvent.emit();



        }).catch((error: any) => {

          this.Debug.ShowErrorMessage(error.message,'Protokoll Editor', 'OkButtonClicked', this.Debug.Typen.Component);
        });

      }

    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'OkButtonClicked', this.Debug.Typen.Component);
    }
  }

  /*
  ProjektButtonClicked() {

    try {

      this.Auswahlliste = [];

      for(let Projekt of this.Pool.Gesamtprojektliste) {

        this.Auswahlliste.push(Projekt.Projektkurzname);
      }

      if(this.DBProjekte.CurrentProjekt !== null) {

        this.Auswahlindex = lodash.findIndex(this.Pool.Gesamtprojektliste, {id: this.DB.CurrentProtokoll._id});

      }
      else this.Auswahlindex = -1;

      this.Auswahltitel = 'Projektauswahl';

      // this.MyAuswahlDialog.Open(false, this.Auswahlindex);
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'ProjektButtonClicked', this.Debug.Typen.Component);
    }
  }

   */



  GetProjektname(): string {

    try {

      return this.DBProjekte.CurrentProjekt !== null ? this.DBProjekte.CurrentProjekt.Projektname : 'unbekannt';


    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'GetProjektname', this.Debug.Typen.Component);
    }
  }

  GetProjektkurzname(): string {

    try {

      return this.DBProjekte.CurrentProjekt !== null ? this.DBProjekte.CurrentProjekt.Projektkurzname : 'unbekannt';


    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'GetProjektkurzname', this.Debug.Typen.Component);
    }
  }


  DatumChanged(currentmoment: Moment) {

    try {

      let Startzeitpunkt: Moment;
      let Endezeitpunkt: Moment;
      let Dauer: number;

      this.StopSaveProtokollTimer();

      /*


      Startzeitpunkt = moment(this.DB.CurrentProtokoll.Startstempel);
      Endezeitpunkt  = moment(this.DB.CurrentProtokoll.Endestempel);
      Dauer          = moment.duration(Endezeitpunkt.diff(Startzeitpunkt)).asMinutes();

       */

      this.DB.CurrentProtokoll.Zeitstempel = currentmoment.valueOf();
      this.DB.CurrentProtokoll.Zeitstring  = currentmoment.format('DD.MM.YYYY');


      this.StartSaveProtokollTimer();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'DatumChanged', this.Debug.Typen.Component);
    }
  }

  ngAfterViewInit(): void {

    try {

      window.setTimeout( () => {

        this.ValidateInput();

      }, 30);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projekt Editor', 'AfterViewInit', this.Debug.Typen.Component);
    }
  }

  private SetupValidation() {

    try {


      this.JoiShema = Joi.object<Protokollstruktur>({

        Titel:           Joi.string().required().max(150),
        Besprechungsort: Joi.string().required().max(150),
        Protokollnummer: Joi.string().required().max(20),

      }).options({ stripUnknown: true });


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projekt Editor', 'SetupValidation', this.Debug.Typen.Component);
    }
  }

  ValidateInput() {

    try {

      let Result = this.JoiShema.validate(this.DB.CurrentProtokoll);

      if(Result.error) this.Valid = false;
      else             this.Valid = true;

      this.ValidChanged.emit(this.Valid);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'ValidateInput', this.Debug.Typen.Component);
    }
  }

  CheckOkButtonEnabled(): boolean {

    try {

      let ok: boolean = false;

      if(this.DB.CurrentProtokoll !== null) {

        ok =  this.DB.CurrentProtokoll.Titel !== '' && this.DB.CurrentProtokoll.Besprechungsort !== '' && this.DB.CurrentProtokoll.Protokollnummer !== '';

        if(ok) {

          if(this.DB.CurrentProtokoll._id === this.Const.NONE) {

            this.StartSaveProtokollTimer();

            return true;
          }
          else return true;
        }
        else {

          return false;
        }
      }
      else return false;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'CheckOkButtonEnabled', this.Debug.Typen.Component);
    }
  }

  DeleteProtokollClicked() {

    try {

      if(this.CanDelete === true) {

        this.StopSaveProtokollTimer();

        this.DBProjektpunkte.DeleteProjektpunkteliste(this.Punkteliste, this.DBProjekte.CurrentProjekt).then(() => {

          this.Punkteliste = [];

          this.DB.DeleteProtokoll(this.DB.CurrentProtokoll).then(() => {

            this.Tools.PopPage();

          }).catch((error: any) => {

            this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'DeleteProtokollClicked', this.Debug.Typen.Component);
          });
        }).catch((error: any) => {

          this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'DeleteProtokollClicked', this.Debug.Typen.Component);
        });
      }


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'DeleteProtokollClicked', this.Debug.Typen.Component);
    }
  }

  GetDatum() {

    try {

      return moment(this.DB.CurrentProtokoll.Zeitstempel);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'GetDatum', this.Debug.Typen.Component);
    }
  }


  CheckProjektbeteiligterExist(index: number): boolean {

    try {

      if(lodash.isUndefined(this.Projektbeteiligteliste[index]) === true) return false;
      else return true;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'CheckProjektbeteiligterExist', this.Debug.Typen.Component);
    }
  }

  CheckTeammitgliedExist(index: number): boolean {

    try {

      if(lodash.isUndefined(this.Teammitgliederliste[index]) === true) return false;
      else return true;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'CheckTeammitgliedExist', this.Debug.Typen.Component);
    }
  }

  public CheckProtokollpunktBearbeitung(): boolean {

    try {

      let yes: boolean = false;

      for(let Eintrag of this.Punkteliste) {

        if(Eintrag.LiveEditor === true) yes = true;
      }

      return yes;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'function', this.Debug.Typen.Component);
    }

  }

  private StopSaveProtokollTimer() {

    try {


      if(this.PageLoaded === true) {

        this.ProtokollSaved = false;

        if(this.SaveTimer !== null) {

          window.clearTimeout(this.SaveTimer);

          this.SaveTimer = null;
        }
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'StopSaveProtokollTimer', this.Debug.Typen.Component);
    }
  }

  private StartSaveProtokollTimer() {

    try {


      if(this.PageLoaded === true) {

        this.SaveTimer = window.setTimeout(() => {

          this.DB.SaveProtokoll();

        }, 3000);
      }


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'StartSaveProtokollTimer', this.Debug.Typen.Component);
    }
  }

  /*

  ProjektpunktAufgabeTextChangedHandler(event: any, Detailindex) {

    try {

      this.Punkteliste[Detailindex].Aufgabe     = event.detail.value;
      this.Punkteliste[Detailindex].DataChanged = true;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'ProjektpunktAufgabeTextChangedHandler', this.Debug.Typen.Component);
    }
  }

   */

  DeleteOrCancelProjektpunkt(Projektpunkt: Projektpunktestruktur) {

    try {

      let Nummer: number = 1;


      this.StopSaveProtokollTimer();


      this.Punkteliste = lodash.filter(this.Pool.Projektpunkteliste[this.DBProjekte.CurrentProjektindex], (punkt: Projektpunktestruktur) => {

        return punkt._id !== Projektpunkt._id && punkt._id === this.DB.CurrentProtokoll._id;
      });

      this.Punkteliste.sort((a: Projektpunktestruktur, b: Projektpunktestruktur) => {

        if (a.Startzeitsptempel < b.Startzeitsptempel) return -1;
        if (a.Startzeitsptempel > b.Startzeitsptempel) return 1;
        return 0;
      });

      this.DB.CurrentProtokoll.ProjektpunkteIDListe = [];

      for(let Punkt of this.Punkteliste) {

        this.DB.CurrentProtokoll.ProjektpunkteIDListe.push(Punkt._id);

        Punkt.LiveEditor = false;
        Punkt.Nummer     = Nummer.toString();
        Nummer++;
      }



      this.DBProjektpunkte.DeleteProjektpunkt(Projektpunkt).then(() => {

        this.StartSaveProtokollTimer();
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'DeleteOrCancelProjektpunkt', this.Debug.Typen.Component);
    }
  }

  GetTermindatum(Projektpunkt: Projektpunktestruktur) {

    try {

      if(Projektpunkt.EndeKalenderwoche !== null) return 'KW ' + Projektpunkt.EndeKalenderwoche;
      else {

        return moment(Projektpunkt.Endezeitstempel).format('DD.MM.YYYY');
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'GetTermindatum', this.Debug.Typen.Component);
    }
  }

  ProjektpunktStatusClicked(Projektpunkt: Projektpunktestruktur) {

    try {

      if(this.CheckProtokollpunktBearbeitung() === false) {

        this.DBProjektpunkte.CurrentProjektpunkt = Projektpunkt;
        this.ShowDatumStatusDialog               = true;
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'ProjektpunktStatusClicked', this.Debug.Typen.Component);
    }
  }

  /*

  ProjektpunktProtokollPublicChanged(event: { status: boolean; index: number; event: any }) {

    try {

      this.StopSaveProtokollTimer();

      this.Punkteliste[event.index].ProtokollPublic = event.status;
      this.Punkteliste[event.index].DataChanged     = true;

      this.StartSaveProtokollTimer();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'ProjektpunktProtokollPublicChanged', this.Debug.Typen.Component);
    }

  }

   */

  /*

  BeteiligteButtonClicked() {

    try {

      if(this.CheckOkButtonEnabled()) {

        this.StopSaveProtokollTimer();

       // this.Personenauswahlservice.Auswahlursprung = this.Personenauswahlservice.Auswahlurspungsvarianten.Protokoll;
       // this.DB.PersonenauswahlModus = this.Constclass.Eventvarianten.BesprechungsteilnehmerExtern;

        this.StartSubscription();

        // this.Tools.PushPage(this.Constclass.Pages.PJProjektbeteiligteauswalPage);
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'BeteiligteButtonClicked', this.Debug.Typen.Component);
    }
  }

   */

  /*
  ZustaendigExternZuweisenClicked(Projektpunkt: Projektpunktestruktur) {

    try {


      if(this.CheckProtokollpunktBearbeitung() === false) {

        this.StopSaveProtokollTimer();

        this.StartSubscription();

        this.DBProjekte.Projektpunkt        = Projektpunkt;
        this.DB.PersonenauswahlModus   = this.Constclass.Eventvarianten.ZustaendigkeitExtern;
        this.Personenauswahlservice.Auswahlursprung   = this.Personenauswahlservice.Auswahlurspungsvarianten.Protokoll;

        this.Tools.PushPage(this.Constclass.Pages.PJProjektbeteiligteauswalPage);

      }


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'ZustaendigExternZuweisenClicked', this.Debug.Typen.Component);
    }
  }
  */

  /*
  ZustaendigInternZuweisenClicked(Projektpunkt: Projektpunktestruktur) {

    try {


      let Mitarbeiterliste: Mitarbeiterstruktur[] = [];
      let Mitarbeiter: Mitarbeiterstruktur;

      if(this.CheckProtokollpunktBearbeitung() === false) {

        this.StopSaveProtokollTimer();

        this.DBProjekte.Projektpunkt = Projektpunkt;

        for (let MitarbeiterID of Projektpunkt.ZustaendigeInternIDListe) {

          Mitarbeiter = lodash.find(this.Pool.Mitarbeiterliste, {MitarbeiterID: MitarbeiterID});

          if (lodash.isUndefined(Mitarbeiter) === false) Mitarbeiterliste.push(Mitarbeiter);
        }

        this.NavParams.Mitarbeiterauswahl = {

          Auswahlliste: Mitarbeiterliste,
          FastSelection:      false,
          NoSelectionEnabled: true,
          Title: "Zuständige Teammitglieder wählen"
        };

        this.DB.PersonenauswahlModus = this.Constclass.Eventvarianten.ZustaendigkeitIntern;
        this.Personenauswahlservice.Auswahlursprung = this.Personenauswahlservice.Auswahlurspungsvarianten.Protokoll;

        this.StartSubscription();

        this.Tools.PushPage(this.Constclass.Pages.FiMitarbeiterauswahlPage);
      }




    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'ZustaendigInternZuweisenClicked', this.Debug.Typen.Component);
    }
  }


   */




  DuplicateProtokollClicked() {

    try {

      /*

      this.ProtokolleDatabase.DuplicateProtokoll(this.DB.CurrentProtokoll).then(() => {

        this.Tools.PopPage();
      });

       */

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'DuplicateProtokollClicked', this.Debug.Typen.Component);
    }
  }

  StartzeitChanged(event: Moment) {

    try {

      this.StopSaveProtokollTimer();

      this.DB.CurrentProtokoll.Startstempel = event.valueOf();

      this.StartSaveProtokollTimer();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'StartzeitChanged', this.Debug.Typen.Component);
    }

  }

  EndezeitChanged(event: Moment) {

    try {

      this.StopSaveProtokollTimer();

      this.DB.CurrentProtokoll.Endestempel = event.valueOf();

      this.StartSaveProtokollTimer();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'EndezeitChanged', this.Debug.Typen.Component);
    }
  }


  public GetStartzeit():Moment {

    try {

      return moment(this.DB.CurrentProtokoll.Startstempel);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'GetStartzeit', this.Debug.Typen.Component);
    }
  }

  public GetEndezeit():Moment {

    try {

      return moment(this.DB.CurrentProtokoll.Endestempel);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'GetEndezeit', this.Debug.Typen.Component);
    }
  }

  ShowDetailsChanged(event: any) {

    try {

      this.DB.CurrentProtokoll.ShowDetails = !this.DB.CurrentProtokoll.ShowDetails;

      this.StartSaveProtokollTimer();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'ShowDetailsChanged', this.Debug.Typen.Component);
    }
  }

  /*
  private StopSubscription() {

    try {

      if(this.MessageSubscription !== null) {

        this.MessageSubscription.unsubscribe();
        this.MessageSubscription = null;
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'StopSubscription', this.Debug.Typen.Component);
    }

  }
   */

  /*

  public StartSubscription() {

    try {

      let Liste: Mitarbeiterstruktur[];
      let Index: number;
      let Punkteliste: Projektpunktestruktur[] = [];
      let Punkt: Projektpunktestruktur;
      let Projektbeteiligter: Projektbeteiligtestruktur;
      let Mitarbeiter: Mitarbeiterstruktur;

      /*
      this.MessageSubscription = this.Messenger.MessageReplaySubject.subscribe((message: string) => {

        switch (message) {

          case this.Personenauswahlservice.Auswahlurspungsvarianten.Protokoll:

            switch (this.DB.PersonenauswahlModus) {

              case this.Constclass.Eventvarianten.BesprechungsteilnehmerIntern:

                Liste = this.DatabaseFirma.GetMitarbeiterauswahlliste();

                this.Teammitgliederliste = [];
                this.DB.CurrentProtokoll.TeambeteiligtenIDListe = [];

                for(Mitarbeiter of Liste) {

                  this.DB.CurrentProtokoll.TeambeteiligtenIDListe.push(Mitarbeiter.MitarbeiterID);
                  this.Teammitgliederliste.push(Mitarbeiter);
                }

                this.Messenger.ClearMessage();

                this.StopSaveProtokollTimer();
                this.SaveProtokoll();

                break;

              case this.Constclass.Eventvarianten.BesprechungsteilnehmerExtern:

                this.Projektbeteiligteliste = [];

                for(let ProjektbeteiligteID of this.DB.CurrentProtokoll.ProjektbeteiligteIDListe) {

                  Projektbeteiligter = lodash.find(this.Pool.Projektbeteiligteliste[this.Projektservice.CurrentProjektindex], {ProjektbeteiligteID: ProjektbeteiligteID});

                  if (lodash.isUndefined(Projektbeteiligter) === false) this.Projektbeteiligteliste.push(Projektbeteiligter);
                }

                this.Be_Zeilenanzahl = Math.ceil(this.Projektbeteiligteliste.length / this.Be_Spaltenanzahl);

                this.Messenger.ClearMessage();
                this.StopSaveProtokollTimer();
                this.SaveProtokoll();

                break;

              case this.Constclass.Eventvarianten.ZustaendigkeitExtern:

                let text  = this.DBProjekte.Projektpunkt.ZustaendigeExternIDListe;
                let text2 = this.Punkteliste;

                Punkt = lodash.find(this.Pool.Projektpunkteliste[this.Projektservice.CurrentProjektindex], {id: this.DBProjekte.Projektpunkt._id});

                console.log('Zustaendige: ' + Punkt.ZustaendigeExternIDListe.length);

                this.Messenger.ClearMessage();

                this.StopSaveProtokollTimer();
                this.SaveProtokoll();

                break;

              case this.Constclass.Eventvarianten.ZustaendigkeitIntern:

                Index       = lodash.findIndex(this.Punkteliste, {id: this.DBProjekte.Projektpunkt._id});
                Liste       = this.DatabaseFirma.GetMitarbeiterauswahlliste();
                Punkteliste = [];

                for(Index = 0; Index < this.Punkteliste.length; Index++) {

                  Punkt = lodash.cloneDeep(this.Punkteliste[Index]);

                  if(Punkt._id === this.DBProjekte.Projektpunkt._id) {

                    Punkt.ZustaendigeInternIDListe = [];

                    for(Mitarbeiter of Liste) {

                      Punkt.ZustaendigeInternIDListe.push(Mitarbeiter.MitarbeiterID);
                    }

                    console.log('Anzahl: ' + Punkt.ZustaendigeExternIDListe.length);
                  }

                  Punkteliste.push(Punkt);
                }

                this.Punkteliste = [];
                this.Punkteliste = lodash.cloneDeep(Punkteliste);

                this.Messenger.ClearMessage();

                this.StopSaveProtokollTimer();
                this.SaveProtokoll();

                break;
            }

            break;
        }

        this.StopSubscription();
      });



    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'StartSubscription', this.Debug.Typen.Component);
    }
  }

   */


  TeammitgliederButtonClicked() {

    try {

      /*
      let Mitarbeiterliste: Mitarbeiterstruktur[] = [];
      let Mitarbeiter: Mitarbeiterstruktur;

      if(this.CheckOkButtonEnabled()) {

        this.StopSaveProtokollTimer();

        for (let MitarbeiterID of this.DB.CurrentProtokoll.TeambeteiligtenIDListe) {

          Mitarbeiter = lodash.find(this.Pool.Mitarbeiterliste, {MitarbeiterID: MitarbeiterID});

          if (lodash.isUndefined(Mitarbeiter) === false) Mitarbeiterliste.push(Mitarbeiter);
        }

        this.NavParams.Mitarbeiterauswahl = {

          Auswahlliste: Mitarbeiterliste,
          FastSelection: false,
          NoSelectionEnabled: true,
          Title: "Teammitglieder wählen"
        };

        this.StartSubscription();

        this.Personenauswahlservice.Auswahlursprung    = this.Personenauswahlservice.Auswahlurspungsvarianten.Protokoll;
        this.DB.PersonenauswahlModus    = this.Constclass.Eventvarianten.BesprechungsteilnehmerIntern;

        this.Tools.PushPage(this.Constclass.Pages.FiMitarbeiterauswahlPage);
      }

       */

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'TeammitgliederButtonClicked', this.Debug.Typen.Component);
    }
  }

  GetTeammitgliedername(Index: number) {

    try {

      let Mitarbeiter: Mitarbeiterstruktur;

      if (lodash.isUndefined(this.Teammitgliederliste[Index]) === false) {

        Mitarbeiter = this.Teammitgliederliste[Index];

        return Mitarbeiter.Vorname + ' ' + Mitarbeiter.Name;

      } else {

        return 'unbekannt';
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'GetTeammitgliedername', this.Debug.Typen.Component);
    }
  }

  GetTeammitgliederkuerzel(Index: number) {

    try {

      let Mitarbeiter: Mitarbeiterstruktur;

      if (lodash.isUndefined(this.Teammitgliederliste[Index]) === false) {

        Mitarbeiter = this.Teammitgliederliste[Index];

        return Mitarbeiter.Kuerzel;

      } else {

        return 'unbekannt';
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'GetTeammitgliederkuerzel', this.Debug.Typen.Component);
    }
  }


  ZoomImageClicked(Projektpunkt: Projektpunktestruktur) {

    try {

      /*

      this.DBProjekte.Projektpunkt = Projektpunkt;

      this.Auswahltitel = 'Bildzoom';

      this.Auswahlliste = [];

      for(let Zahl of this.Zoomfaktorenliste) {

        this.Auswahlliste.push(Zahl.toFixed(1));
      }

      this.Auswahlindex = this.Zoomfaktorenliste.indexOf(Projektpunkt.Filezoom);

      this.MyAuswahlDialog.Open(false, this.Auswahlindex);


       */

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'ZoomImageClicked', this.Debug.Typen.Component);
    }
  }

  public TextChangedHandler() {

    try {

      this.ValidateInput();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Festlegung Liste', 'TextChangedHandler', this.Debug.Typen.Component);
    }
  }



  AllgemeinMenuButtonClicked() {

    try {

      this.Bereich = this.Bereiche.Allgemein;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'AllgemeinMenuButtonClicked', this.Debug.Typen.Component);
    }
  }

  ThemenlisteMenuButtonClicked() {

    try {

      this.Bereich = this.Bereiche.Themenliste;

      this.DB.SaveProtokoll().then(() => {


      }).catch((error: HttpErrorResponse) => {

        this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'ThemenlisteMenuButtonClicked', this.Debug.Typen.Component);
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'ThemenlisteMenuButtonClicked', this.Debug.Typen.Component);
    }
  }

  GetTeamteilnehmerliste() {

    try {

      let Teammitglied: Mitarbeiterstruktur;
      let Value: string = '';

      for(let id of this.DB.CurrentProtokoll.BeteiligtInternIDListe) {

        Teammitglied = <Mitarbeiterstruktur>lodash.find(this.Pool.Mitarbeiterliste, {_id: id});

        if(!lodash.isUndefined(Teammitglied)) {

          Value += Teammitglied.Vorname + ' ' + Teammitglied.Name + ' / ' + Teammitglied.Kuerzel + '\n';
        }
      }

      return Value;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'GetTeamteilnehmerliste', this.Debug.Typen.Component);
    }
  }



  GetThemenlisteIconcolor(): string {

    try {

      if(this.Valid) {

        return this.Bereich === this.Bereiche.Themenliste ? 'schwarz' : 'weiss';

      }
      else {

        return 'grau';
      }


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'GetThemenlisteIconcolor', this.Debug.Typen.Component);
    }
  }

  GetThemenlisteTextcolor() {

    try {

      if(this.Valid) {

        return this.Bereich === this.Bereiche.Themenliste ? 'black' : 'white';
      }
      else {

        return '#454545';
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Protokoll Editor', 'GetThemenlisteTextcolor', this.Debug.Typen.Component);
    }
  }

  ThumbnailClicked(event: MouseEvent, Thumbliste: Thumbnailstruktur[], Index: number) {

    try {

      event.preventDefault();
      event.stopPropagation();

      this.ThumbnailClickedEvent.emit({
        Index:      Index,
        Thumbliste: Thumbliste
      });



    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Protokoll Editor', 'ThumbnailClicked', this.Debug.Typen.Component);
    }
  }
}
