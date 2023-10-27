import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output,} from '@angular/core';
import {DebugProvider} from "../../services/debug/debug";
import * as lodash from "lodash-es";
import {DisplayService} from "../../services/diplay/display.service";
import {ConstProvider} from "../../services/const/const";
import {HttpErrorResponse} from "@angular/common/http";
import {ToolsProvider} from "../../services/tools/tools";
import * as Joi from "joi";
import {ObjectSchema} from "joi";
import {DatabaseBautagebuchService} from "../../services/database-bautagebuch/database-bautagebuch.service";
import moment, {Moment} from "moment";
import {BasicsProvider} from "../../services/basics/basics";
import {Bautagebucheintragstruktur} from "../../dataclasses/bautagebucheintragstruktur";
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'pj-bautagebuch-editor',
  templateUrl: './pj-bautagebuch-editor.component.html',
  styleUrls: ['./pj-bautagebuch-editor.component.scss'],
})

export class PjBautagebuchEditorComponent implements OnInit, OnDestroy, AfterViewInit {

  public Valid: boolean;
  public CanDelete: boolean;
  private JoiShema: ObjectSchema;
  public DeleteEnabled: boolean;
  public Gesamthoehe: number;
  public Headerhoehe: number;
  public   Listehoehe: number;
  public LinesanzahlTeilnehmer: number;

  @Output() ValidChange = new EventEmitter<boolean>();
  @Output() CancelClickedEvent         = new EventEmitter<any>();
  @Output() OkClickedEvent             = new EventEmitter<any>();
  @Output() DeleteClickedEvent         = new EventEmitter<any>();
  @Output() AddTaetigkeiteintragEvent  = new EventEmitter<any>();
  @Output() EintragClickedEvent        = new EventEmitter<any>();
  @Output() BeteiligteteilnehmerClicked = new EventEmitter();

  @Input() Titel: string;
  @Input() Iconname: string;
  @Input() Dialogbreite: number;
  @Input() Dialoghoehe: number;
  @Input() PositionY: number;
  @Input() ZIndex: number;
  private MitarbeiterSubscription: Subscription;

  constructor(public Debug: DebugProvider,
              public Displayservice: DisplayService,
              public Const: ConstProvider,
              private Tools: ToolsProvider,
              public Basics: BasicsProvider,
              public Pool: DatabasePoolService,
              public DB: DatabaseBautagebuchService) {

    try {

      this.Valid = true;
      this.Valid             = true;
      this.Titel             = this.Const.NONE;
      this.Iconname          = 'book-outline';
      this.Dialogbreite      = 400;
      this.Dialoghoehe       = 300;
      this.LinesanzahlTeilnehmer    = 1;
      this.PositionY         = 100;
      this.ZIndex            = 2000;
      this.CanDelete         = false;
      this.DeleteEnabled     = false;
      this.Gesamthoehe       = 350;
      this.Headerhoehe       = 30;
      this.Listehoehe        = this.Gesamthoehe - this.Headerhoehe;
      this.MitarbeiterSubscription = null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bautagebuch Editor', 'constructor', this.Debug.Typen.Component);
    }
  }

  ngOnDestroy(): void {

      try {

        this.MitarbeiterSubscription.unsubscribe();

        this.Displayservice.RemoveDialog(this.Displayservice.Dialognamen.Bautagebucheditor);

      } catch (error) {

        this.Debug.ShowErrorMessage(error.message, 'Bautagebuch Editor', 'OnDestroy', this.Debug.Typen.Component);
      }
  }

  private SetupValidation() {

    try {


      this.JoiShema = Joi.object({

        Auftraggeber:  Joi.string().required().max(100),
        Leistung:      Joi.string().required().min(5).max(200),
        Nummer:        Joi.string().required().min(1).max(4),
        Bezeichnung:   Joi.string().required().min(2).max(200),
        Temperatur:    Joi.string().required().min(1).max(2),

      }).options({ stripUnknown: true });


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bautagebuch Editor', 'SetupValidation', this.Debug.Typen.Component);
    }
  }

  PrepareData() {

    try {

      this.LinesanzahlTeilnehmer = this.DB.CurrentTagebuch.BeteiligtInternIDListe.length;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Bautagebuch Editor', 'function', this.Debug.Typen.Component);
    }
  }

  ngOnInit() {

    try {

      this.MitarbeiterSubscription = this.Pool.MitarbeiterAuswahlChanged.subscribe(() => {

        this.PrepareData();
      });

      this.PrepareData();
      this.SetupValidation();

      this.Displayservice.AddDialog(this.Displayservice.Dialognamen.Bautagebucheditor, this.ZIndex);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bautagebuch Editor', 'OnInit', this.Debug.Typen.Component);
    }
  }

  ValidateInput() {

    try {

      let Result = this.JoiShema.validate(this.DB.CurrentTagebuch);

      if(Result.error) this.Valid = false;
      else             this.Valid = true;

      this.ValidChange.emit(this.Valid);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bautagebuch Editor', 'ValidateInput', this.Debug.Typen.Component);
    }
  }

  TextChanged(event: { Titel: string; Text: string; Valid: boolean }) {

    try {

      this.ValidateInput();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bautagebuch Editor', 'TextChanged', this.Debug.Typen.Component);
    }
  }

  ngAfterViewInit(): void {

    try {

      window.setTimeout( () => {

        this.ValidateInput();

        this.Titel = this.DB.CurrentTagebuch._id !== null ? 'Bautagebuch bearbeiten' : 'Neues Bautagebuch';

      }, 30);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bautagebuch Editor', 'AfterViewInit', this.Debug.Typen.Component);
    }
  }


  CancelButtonClicked() {

    // this.ResetEditor();

    this.CancelClickedEvent.emit();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bautagebuch Editor', 'CancelButtonClicked', this.Debug.Typen.Component);
    }
  }

  DeleteButtonClicked() {

    try {

      if(this.CanDelete) {

        this.DB.DeleteBautagebuch().then(() => {

          this.DeleteClickedEvent.emit();

        }).catch((exception: HttpErrorResponse) => {

          this.Tools.ShowHinweisDialog(exception.error.message);
        });

      }


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bautagebuch Editor', 'DeleteButtonClicked', this.Debug.Typen.Component);
    }
  }

  OkButtonClicked() {

    try {

      if(this.DB.CurrentTagebuch._id === null) {

        this.DB.AddBautagebuch().then((result: any) => {

          this.OkClickedEvent.emit();

        }).catch((error: HttpErrorResponse) => {

          this.Tools.ShowHinweisDialog(error.error);

        });
      }
      else {

        this.DB.UpdateBautagebuch().then(() => {


          this.OkClickedEvent.emit();

        }).catch((exception: HttpErrorResponse) => {

          this.Tools.ShowHinweisDialog(exception.error.message);
        });
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bautagebuch Editor', 'OkButtonClicked', this.Debug.Typen.Component);
    }
  }

  ContentClicked(event: MouseEvent) {

    event.preventDefault();
    event.stopPropagation();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bautagebuch Editor', 'ContentClicked', this.Debug.Typen.Component);
    }
  }

  CanDeleteCheckedChanged(event: {status: boolean; index: number; event: any}) {

    try {

      this.CanDelete = event.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bautagebuch Editor', 'CanDeleteCheckedChanged', this.Debug.Typen.Component);
    }

  }

  DatumClicked() {

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Bautagebuch Editor', 'DatumClicked', this.Debug.Typen.Component);
    }
  }

  GetDatum(): Moment {

    try {

      if (this.DB.CurrentTagebuch !== null) return moment(this.DB.CurrentTagebuch.Zeitstempel);

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Bautagebuch Editor', 'GetDatum', this.Debug.Typen.Component);
    }
  }

  RegenCheckedChanged(event: { status: boolean; index: number; event: any }) {

    try {

      this.DB.CurrentTagebuch.Regen = event.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Bautagebuch Editor', 'RegenCheckedChanged', this.Debug.Typen.Component);
    }
  }

  FrostCheckedChanged(event: { status: boolean; index: number; event: any }) {

    try {

      this.DB.CurrentTagebuch.Frost = event.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Bautagebuch Editor', 'FrostCheckedChanged', this.Debug.Typen.Component);
    }
  }

  SchneeCheckedChanged(event: { status: boolean; index: number; event: any }) {

    try {

      this.DB.CurrentTagebuch.Schnee = event.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Bautagebuch Editor', 'SchneeCheckedChanged', this.Debug.Typen.Component);
    }
  }
  WindCheckedChanged(event: { status: boolean; index: number; event: any }) {

    try {

      this.DB.CurrentTagebuch.Wind = event.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Bautagebuch Editor', 'SchneeCheckedChanged', this.Debug.Typen.Component);
    }
  }

  SonnigCheckedChanged(event: { status: boolean; index: number; event: any }) {

    try {

      this.DB.CurrentTagebuch.Sonnig = event.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Bautagebuch Editor', 'SonnigCheckedChanged', this.Debug.Typen.Component);
    }
  }

  BewoelktCheckedChanged(event: { status: boolean; index: number; event: any }) {

    try {

      this.DB.CurrentTagebuch.Bewoelkt = event.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Bautagebuch Editor', 'BewoelktCheckedChanged', this.Debug.Typen.Component);
    }
  }

  BedecktCheckedChanged(event: { status: boolean; index: number; event: any }) {

    try {

      this.DB.CurrentTagebuch.Bewoelkt = event.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Bautagebuch Editor', 'BedecktCheckedChanged', this.Debug.Typen.Component);
    }
  }

  LoeschenCheckboxChanged(event: { status: boolean; index: number; event: any }) {

    try {

      this.DeleteEnabled = event.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Bautagebuch Editor', 'LoeschenCheckboxChanged', this.Debug.Typen.Component);
    }
  }

  public LoeschenButtonClicked() {

    try {

      this.DB.DeleteBautagebuch().then(() => {

        this.OkClickedEvent.emit();
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Bautagebuch Editor', 'LoeschenButtonClicked', this.Debug.Typen.Component);
    }
  }

  AddTaetigkeitClicked() {

    try {

      this.DB.CurrentTagebucheintrag = this.DB.GetEmptyBautagebucheintrag();

      this.AddTaetigkeiteintragEvent.emit();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Bautagebuch Editor', 'AddTaetigkeitClicked', this.Debug.Typen.Component);
    }
  }

  BehinderungTextChanged(event: any) {

    try {

      if(!lodash.isUndefined(event.detail)) {

        this.DB.CurrentTagebuch.Behinderungen = event.detail.value !== null ? event.detail.value : '';
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Bautagebuch Editor', 'BehinderungTextChanged', this.Debug.Typen.Component);
    }
  }

  VorkommnisseTextChanged(event: any) {

    try {

      if(!lodash.isUndefined(event.detail)) {

        this.DB.CurrentTagebuch.Vorkommnisse = event.detail.value !== null ? event.detail.value : '';
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Bautagebuch Editor', 'VorkommnisseTextChanged', this.Debug.Typen.Component);
    }
  }

  TagebucheintragClicked(Eintrag: Bautagebucheintragstruktur) {

    try {

      this.DB.CurrentTagebucheintrag = lodash.cloneDeep(Eintrag);
      this.EintragClickedEvent.emit();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Bautagebuch Editor', 'TagebucheintragClicked', this.Debug.Typen.Component);
    }
  }

  DatumChangedHandler(zeitpunkt: moment.Moment) {

    try {

      this.DB.CurrentTagebuch.Zeitstempel = zeitpunkt.valueOf();
      this.DB.CurrentTagebuch.Zeitstring  = zeitpunkt.format('DD.MM.YYYY');

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Bautagebuch Editor', 'DatumChangedHandler', this.Debug.Typen.Component);
    }
  }
}
