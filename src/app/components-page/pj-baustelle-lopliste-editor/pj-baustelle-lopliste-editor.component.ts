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
import {Projektpunktestruktur} from "../../dataclasses/projektpunktestruktur";
import {Moment} from 'moment';
import moment from 'moment';
import {Projektbeteiligtestruktur} from "../../dataclasses/projektbeteiligtestruktur";
import {Mitarbeiterstruktur} from "../../dataclasses/mitarbeiterstruktur";
import {LoadingAnimationService} from "../../services/loadinganimation/loadinganimation";
import {DatabaseProjektpunkteService} from "../../services/database-projektpunkte/database-projektpunkte.service";
import {DatabaseProjekteService} from "../../services/database-projekte/database-projekte.service";
import {DisplayService} from "../../services/diplay/display.service";
import * as Joi from "joi";
import {ObjectSchema} from "joi";
import {HttpErrorResponse} from "@angular/common/http";
import {KostengruppenService} from "../../services/kostengruppen/kostengruppen.service";
import {DatabaseLoplisteService} from "../../services/database-lopliste/database-lopliste.service";
import {LOPListestruktur} from "../../dataclasses/loplistestruktur";
import {DatabaseGebaeudestrukturService} from "../../services/database-gebaeudestruktur/database-gebaeudestruktur";
import {Projektestruktur} from "../../dataclasses/projektestruktur";
import {Fachbereiche} from "../../dataclasses/fachbereicheclass";

@Component({
  selector:    'pj-baustelle-lopliste-editor',
  templateUrl: 'pj-baustelle-lopliste-editor.component.html',
  styleUrls: ['pj-baustelle-lopliste-editor.component.scss'],
  // encapsulation: ViewEncapsulation.ShadowDom,
})
export class PjBaustelleLoplisteEditorComponent implements OnDestroy, OnInit, AfterViewInit {

  @Output() OkClickedEvent              = new EventEmitter<any>();
  @Output() CancelClickedEvent          = new EventEmitter();
  @Output() LeistungsphaseClickedEvent  = new EventEmitter();
  @Output() TeamteilnehmerClicked       = new EventEmitter();
  @Output() BeteiligteteilnehmerClicked = new EventEmitter();
  @Output() AddLOPListepunktClicked     = new EventEmitter();
  @Output() LOPListeDeleted             = new EventEmitter();
  @Output() LOPListepunktClicked        = new EventEmitter<Projektpunktestruktur>();
  @Output() ValidChanged                = new EventEmitter<boolean>();


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
  public LOPListeSaved: boolean;
  public ShowDatumStatusDialog: boolean;
  public CanDelete: boolean;
  public CreatePDFRunning: boolean;
  public PageLoaded: boolean;
  public ShowUpload: boolean;
  public Zoomfaktorenliste: number[];
  public isHovering: boolean;
  public LOPListeSubscription: Subscription;
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
              public DB: DatabaseLoplisteService,
              public DBProjekte: DatabaseProjekteService,
              public DBProjektpunkte: DatabaseProjektpunkteService,
              public DBGebaeude: DatabaseGebaeudestrukturService,
              public Displayservice: DisplayService,
              private LoadingAnimation: LoadingAnimationService,
              public Pool: DatabasePoolService) {
    try {

      this.Bereich                  = this.DB.LOPListeEditorViewModus;
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
      this.LOPListeSaved            = true;
      this.ShowDatumStatusDialog    = false;
      this.CanDelete                = false;
      this.CreatePDFRunning         = false;
      this.PageLoaded               = false;
      this.ShowUpload               = false;
      this.LOPListeSubscription     = null;
      this.ProjektpunktSubscription = null;
      this.MitarbeiterSubscription  = null;
      this.BeteiligteSubscription   = null;
      this.Titel = this.Const.NONE;
      this.Iconname = 'help-circle-outline';
      this.Dialogbreite = 400;
      this.Dialoghoehe = 300;
      this.PositionY = 100;
      this.ZIndex = 2000;
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Editor', 'constructor', this.Debug.Typen.Component);
    }
  }

  ngOnInit(): void {

    try {

      this.Displayservice.AddDialog(this.Displayservice.Dialognamen.LOPListeEditor, this.ZIndex);

      this.SetupValidation();

      this.Gesamthoehe      = this.Dialoghoehe;
      this.Titelhoehe       = 70;
      this.Listeheaderhoehe = 30;
      this.Listehoehe       = this.Gesamthoehe - this.Titelhoehe - this.Listeheaderhoehe;
      this.CanDelete        = false;
      this.CreatePDFRunning = false;
      this.PageLoaded       = false;
      this.Bereich          = this.DB.LOPListeEditorViewModus;

      this.MitarbeiterSubscription = this.Pool.MitarbeiterAuswahlChanged.subscribe(() => {

        this.PrepareData();
      });

      this.BeteiligteSubscription = this.Pool.BeteiligteAuswahlChanged.subscribe(() => {

        this.PrepareData();
      });

      this.LOPListeSubscription = this.Pool.LOPListeChanged.subscribe(() => {

        this.PrepareData();
      });

      this.ProjektpunktSubscription = this.Pool.LOPListeprojektpunktChanged.subscribe(() => {

        this.PrepareData();
      });

      this.PrepareData();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Editor', 'OnInit', this.Debug.Typen.Component);
    }

  }

  ContentClicked(event: MouseEvent) {

    event.preventDefault();
    event.stopPropagation();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Editor', 'ContentClicked', this.Debug.Typen.Component);
    }
  }

  ngOnDestroy(): void {

    try {

      this.Displayservice.RemoveDialog(this.Displayservice.Dialognamen.LOPListeEditor);

      this.PageLoaded = false;

      if(this.LOPListeSubscription !== null) {

        this.LOPListeSubscription.unsubscribe();
        this.LOPListeSubscription = null;
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

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Editor', 'OnDestroy', this.Debug.Typen.Component);
    }
  }


  public ionViewDidEnter() {

    try {

      this.PageLoaded = true;

      this.PrepareData();

    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Editor', 'ionViewDidEnter', this.Debug.Typen.Component);
    }
  }

  ionViewDidLeave() {

    try {

      this.PageLoaded = false;
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Editor', 'ionViewDidLeave', this.Debug.Typen.Component);
    }
  }

  private PrepareData() {

    try {

      let Projektpunkt: Projektpunktestruktur;

      if(this.DB.CurrentLOPListe !== null) {

        let AnzahlExtern   = this.DB.CurrentLOPListe.BeteiligExternIDListe.length;
        let AnzahlBurnickl = this.DB.CurrentLOPListe.BeteiligtInternIDListe.length;

        this.LinesanzahlTeilnehmer = Math.max(AnzahlExtern, AnzahlBurnickl);

        this.Punkteliste = [];

        for(let id of this.DB.CurrentLOPListe.ProjektpunkteIDListe) {

          Projektpunkt = lodash.find(this.Pool.Projektpunkteliste[this.DBProjekte.CurrentProjekt.Projektkey], (punkt: Projektpunktestruktur) => {

            return punkt._id === id && punkt.LOPListeID === this.DB.CurrentLOPListe._id;
          });

          if(lodash.isUndefined(Projektpunkt) === false) {

            this.Punkteliste.push(Projektpunkt);
          }
        }

        this.Punkteliste.sort((a: Projektpunktestruktur, b: Projektpunktestruktur) => {

          if (parseInt(a.Nummer) > parseInt(b.Nummer)) return -1;
          if (parseInt(a.Nummer) < parseInt(b.Nummer)) return  1;

          return 0;
        });
      }

      this.DBProjektpunkte.CurrentProjektpunkteliste = lodash.cloneDeep(this.Punkteliste);
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Editor', 'PrepareData', this.Debug.Typen.Component);
    }
  }


  CancelButtonClicked() {

    try {


      this.StopSaveLOPListeTimer();
      this.CancelClickedEvent.emit();
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Editor', 'CancelButtonClicked', this.Debug.Typen.Component);
    }
  }



  OkButtonClicked() {

    try {

      this.StopSaveLOPListeTimer();

      if(this.Valid) {

        this.DB.SaveLOPListe().then(() => {

            this.OkClickedEvent.emit();


        }).catch((error: any) => {

          this.Debug.ShowErrorMessage(error.message,'LOP Liste Editor', 'OkButtonClicked', this.Debug.Typen.Component);
        });

      }

    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Editor', 'OkButtonClicked', this.Debug.Typen.Component);
    }
  }

  DatumChanged(currentmoment: Moment) {

    try {

      let Startzeitpunkt: Moment;
      let Endezeitpunkt: Moment;
      let Dauer: number;

      this.StopSaveLOPListeTimer();

      /*


      Startzeitpunkt = moment(this.DB.CurrentLOPListe.Startstempel);
      Endezeitpunkt  = moment(this.DB.CurrentLOPListe.Endestempel);
      Dauer          = moment.duration(Endezeitpunkt.diff(Startzeitpunkt)).asMinutes();

       */

      this.DB.CurrentLOPListe.Zeitstempel = currentmoment.valueOf();
      this.DB.CurrentLOPListe.Zeitstring  = currentmoment.format('DD.MM.YYYY');


      this.StartSaveLOPListeTimer();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Editor', 'DatumChanged', this.Debug.Typen.Component);
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


      this.JoiShema = Joi.object<LOPListestruktur>({

        Titel:           Joi.string().required().max(150),
        Besprechungsort: Joi.string().required().max(150),
        LOPListenummer:  Joi.string().required().max(20),

      }).options({ stripUnknown: true });


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projekt Editor', 'SetupValidation', this.Debug.Typen.Component);
    }
  }

  ValidateInput() {

    try {

      let Result = this.JoiShema.validate(this.DB.CurrentLOPListe);

      if(Result.error) this.Valid = false;
      else             this.Valid = true;

      this.ValidChanged.emit(this.Valid);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Editor', 'ValidateInput', this.Debug.Typen.Component);
    }
  }

  CheckOkButtonEnabled(): boolean {

    try {

      let ok: boolean = false;

      if(this.DB.CurrentLOPListe !== null) {

        ok =  this.DB.CurrentLOPListe.Titel !== '' && this.DB.CurrentLOPListe.Besprechungsort !== '' && this.DB.CurrentLOPListe.LOPListenummer !== '';

        if(ok) {

          if(this.DB.CurrentLOPListe._id === this.Const.NONE) {

            this.StartSaveLOPListeTimer();

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

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Editor', 'CheckOkButtonEnabled', this.Debug.Typen.Component);
    }
  }

  DeleteLOPListeClicked() {

    try {

      if(this.CanDelete === true) {

        this.StopSaveLOPListeTimer();

        this.DBProjektpunkte.DeleteProjektpunkteliste(this.Punkteliste, this.DBProjekte.CurrentProjekt).then(() => {

          this.Punkteliste = [];

          this.DB.DeleteLOPListe(this.DB.CurrentLOPListe).then(() => {

            this.LOPListeDeleted.emit();

          }).catch((error: any) => {

            this.Debug.ShowErrorMessage(error.message, 'LOP Liste Editor', 'DeleteLOPListeClicked', this.Debug.Typen.Component);
          });
        }).catch((error: any) => {

          this.Debug.ShowErrorMessage(error.message, 'LOP Liste Editor', 'DeleteLOPListeClicked', this.Debug.Typen.Component);
        });
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Editor', 'DeleteLOPListeClicked', this.Debug.Typen.Component);
    }
  }

  GetDatum() {

    try {

      return moment(this.DB.CurrentLOPListe.Zeitstempel);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Editor', 'GetDatum', this.Debug.Typen.Component);
    }
  }


  public CheckLOPListepunktBearbeitung(): boolean {

    try {

      let yes: boolean = false;

      for(let Eintrag of this.Punkteliste) {

        if(Eintrag.LiveEditor === true) yes = true;
      }

      return yes;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Editor', 'CheckLOPListepunktBearbeitung', this.Debug.Typen.Component);
    }

  }

  private StopSaveLOPListeTimer() {

    try {


      if(this.PageLoaded === true) {

        this.LOPListeSaved = false;

        if(this.SaveTimer !== null) {

          window.clearTimeout(this.SaveTimer);

          this.SaveTimer = null;
        }
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Editor', 'StopSaveLOPListeTimer', this.Debug.Typen.Component);
    }
  }

  private StartSaveLOPListeTimer() {

    try {


      if(this.PageLoaded === true) {

        this.SaveTimer = window.setTimeout(() => {

          this.DB.SaveLOPListe();

        }, 3000);
      }


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Editor', 'StartSaveLOPListeTimer', this.Debug.Typen.Component);
    }
  }

  GetTermindatum(Projektpunkt: Projektpunktestruktur) {

    try {

      if(Projektpunkt.EndeKalenderwoche !== null) return 'KW ' + Projektpunkt.EndeKalenderwoche;
      else {

        return moment(Projektpunkt.Endezeitstempel).format('DD.MM.YYYY');
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Editor', 'GetTermindatum', this.Debug.Typen.Component);
    }
  }

  ProjektpunktStatusClicked(Projektpunkt: Projektpunktestruktur) {

    try {

      if(this.CheckLOPListepunktBearbeitung() === false) {

        this.DBProjektpunkte.CurrentProjektpunkt = Projektpunkt;
        this.ShowDatumStatusDialog               = true;
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Editor', 'ProjektpunktStatusClicked', this.Debug.Typen.Component);
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

      this.Bereich = this.DB.LOPListeEditorViewModusvarianten.Allgemein;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Editor', 'AllgemeinMenuButtonClicked', this.Debug.Typen.Component);
    }
  }

  ThemenlisteMenuButtonClicked() {

    try {

      this.Bereich = this.DB.LOPListeEditorViewModusvarianten.Eintraege;

      this.DB.SaveLOPListe().then(() => {


      }).catch((error: HttpErrorResponse) => {

        this.Debug.ShowErrorMessage(error.message, 'LOP Liste Editor', 'ThemenlisteMenuButtonClicked', this.Debug.Typen.Component);
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Editor', 'ThemenlisteMenuButtonClicked', this.Debug.Typen.Component);
    }
  }

  GetTeamteilnehmerliste() {

    try {

      let Teammitglied: Mitarbeiterstruktur;
      let Value: string = '';

      for(let id of this.DB.CurrentLOPListe.BeteiligtInternIDListe) {

        Teammitglied = <Mitarbeiterstruktur>lodash.find(this.Pool.Mitarbeiterliste, {_id: id});

        if(!lodash.isUndefined(Teammitglied)) {

          Value += Teammitglied.Vorname + ' ' + Teammitglied.Name + ' / ' + Teammitglied.Kuerzel + '\n';
        }
      }

      return Value;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Editor', 'GetTeamteilnehmerliste', this.Debug.Typen.Component);
    }
  }

  GetThemenlisteIconcolor(): string {

    try {

      if(this.Valid) {

        return this.Bereich === this.DB.LOPListeEditorViewModusvarianten.Eintraege ? 'schwarz' : 'weis';

      }
      else {

        return 'grau';
      }


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Editor', 'GetThemenlisteIconcolor', this.Debug.Typen.Component);
    }
  }

  GetThemenlisteTextcolor() {

    try {

      if(this.Valid) {

        return this.Bereich === this.DB.LOPListeEditorViewModusvarianten.Eintraege ? 'black' : 'white';
      }
      else {

        return '#454545';
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LOP Liste Editor', 'GetThemenlisteTextcolor', this.Debug.Typen.Component);
    }
  }

  GetBauteilnamen(Projektpunkt: Projektpunktestruktur): string {

    try {

      let Projekt: Projektestruktur = lodash.find(this.DBProjekte.Gesamtprojektliste, { _id: Projektpunkt.ProjektID });

      if(!lodash.isUndefined(Projekt)) {

        return this.DBGebaeude.GetGebaeudeteilname(Projekt, Projektpunkt);
      }
      else {

        return 'Gesamtes Gebäude';
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'LOP Liste Editor', 'GetBauteilnamen', this.Debug.Typen.Page);
    }
  }


  CanDeleteCheckedChanged(event: { status: boolean; index: number; event: any }) {

    try {

      this.CanDelete = event.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'LOP Liste Editor', 'CanDeleteCheckedChanged', this.Debug.Typen.Page);
    }
  }
}
