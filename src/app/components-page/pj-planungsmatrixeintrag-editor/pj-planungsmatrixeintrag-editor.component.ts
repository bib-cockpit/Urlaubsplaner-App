import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {DebugProvider} from "../../services/debug/debug";
import {InputCloneComponent} from "../../components/input-clone/input-clone.component";
import {DisplayService} from "../../services/diplay/display.service";
import {ConstProvider} from "../../services/const/const";
import {HttpErrorResponse} from "@angular/common/http";
import {ToolsProvider} from "../../services/tools/tools";
import * as Joi from "joi";
import {ObjectSchema} from "joi";
import {DatabaseProjektpunkteService} from "../../services/database-projektpunkte/database-projektpunkte.service";
import {BasicsProvider} from "../../services/basics/basics";
import {Moment} from "moment";
import moment from "moment";

@Component({
  selector: 'pj-planungsmatrixeintrag-editor',
  templateUrl: './pj-planungsmatrixeintrag-editor.component.html',
  styleUrls: ['./pj-planungsmatrixeintrag-editor.component.scss'],
})

export class PjPlanungsmatrixeintragEditorComponent implements OnInit, OnDestroy, AfterViewInit {

  public Valid: boolean;
  public CanDelete: boolean;
  private JoiShema: ObjectSchema;

  @Output() ValidChange = new EventEmitter<boolean>();
  @Output() CancelClickedEvent         = new EventEmitter<any>();
  @Output() OkClickedEvent             = new EventEmitter<any>();
  @Output() DeleteClickedEvent         = new EventEmitter<any>();
  @Output() FortschrittClickedEvent    = new EventEmitter<any>();
  @Output() TerminButtonClicked        = new EventEmitter<any>();
  @Output() KostengruppeButtonClicked  = new EventEmitter<any>();

  @Input() Titel: string;
  @Input() Iconname: string;
  @Input() Dialogbreite: number;
  @Input() Dialoghoehe: number;
  @Input() PositionY: number;
  @Input() ZIndex: number;

  constructor(public Debug: DebugProvider,
              public Displayservice: DisplayService,
              public Const: ConstProvider,
              private Tools: ToolsProvider,
              public Basics: BasicsProvider,
              public DB: DatabaseProjektpunkteService) {
    try {

      this.Valid = true;
      this.Valid             = true;
      this.Titel             = this.Const.NONE;
      this.Iconname          = 'location-outline';
      this.Dialogbreite      = 400;
      this.Dialoghoehe       = 300;
      this.PositionY         = 100;
      this.ZIndex            = 2000;
      this.CanDelete         = false;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Planungsmatrixeintrag Editor', 'constructor', this.Debug.Typen.Component);
    }
  }

  ngOnDestroy(): void {

      try {

        this.Displayservice.RemoveDialog(this.Displayservice.Dialognamen.Planungsmatrixeintrageditor);

      } catch (error) {

        this.Debug.ShowErrorMessage(error.message, 'Planungsmatrixeintrag Editor', 'OnDestroy', this.Debug.Typen.Component);
      }
  }

  private SetupValidation() {

    try {

      this.JoiShema = Joi.object({

        Aufgabe: Joi.string().required().min(5).max(100)

      }).options({ stripUnknown: true });


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Planungsmatrixeintrag Editor', 'SetupValidation', this.Debug.Typen.Component);
    }
  }

  ngOnInit() {

    try {

      this.SetupValidation();

      this.Displayservice.AddDialog(this.Displayservice.Dialognamen.Planungsmatrixeintrageditor, this.ZIndex);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Planungsmatrixeintrag Editor', 'OnInit', this.Debug.Typen.Component);
    }
  }

  ValidateInput() {

    try {

      let Result = this.JoiShema.validate(this.DB.CurrentProjektpunkt);

      if(Result.error) this.Valid = false;
      else             this.Valid = true;

      this.ValidChange.emit(this.Valid);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Planungsmatrixeintrag Editor', 'ValidateInput', this.Debug.Typen.Component);
    }
  }

  TextChanged(event: { Titel: string; Text: string; Valid: boolean }) {

    try {

      this.ValidateInput();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Planungsmatrixeintrag Editor', 'TextChanged', this.Debug.Typen.Component);
    }
  }

  ngAfterViewInit(): void {

    try {

      this.ValidateInput();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Planungsmatrixeintrag Editor', 'AfterViewInit', this.Debug.Typen.Component);
    }
  }

  CancelButtonClicked() {

    this.CancelClickedEvent.emit();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Planungsmatrixeintrag Editor', 'CancelButtonClicked', this.Debug.Typen.Component);
    }
  }

  DeleteButtonClicked() {

    try {

      if(this.CanDelete) {

        this.DB.DeleteProjektpunkt(this.DB.CurrentProjektpunkt).then(() => {

          this.DeleteClickedEvent.emit();

        }).catch((exception: HttpErrorResponse) => {

          this.Tools.ShowHinweisDialog(exception.error.message);
        });

      }


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Planungsmatrixeintrag Editor', 'DeleteButtonClicked', this.Debug.Typen.Component);
    }
  }

  OkButtonClicked() {

    try {

      debugger;

      if(this.DB.CurrentProjektpunkt._id === null) {

        this.DB.AddProjektpunkt(this.DB.CurrentProjektpunkt).then((result: any) => {

          this.OkClickedEvent.emit();

        }).catch((error: HttpErrorResponse) => {

          this.Tools.ShowHinweisDialog(error.error);

        });
      }
      else {

        this.DB.UpdateProjektpunkt(this.DB.CurrentProjektpunkt, true).then(() => {


          this.OkClickedEvent.emit();

        }).catch((exception: HttpErrorResponse) => {

          this.Tools.ShowHinweisDialog(exception.error.message);
        });
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Planungsmatrixeintrag Editor', 'OkButtonClicked', this.Debug.Typen.Component);
    }
  }

  ContentClicked(event: MouseEvent) {

    event.preventDefault();
    event.stopPropagation();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Planungsmatrixeintrag Editor', 'ContentClicked', this.Debug.Typen.Component);
    }
  }

  StatusCheckedChanged(event: { status: boolean; index: number; event: any }) {

    try {

      if(event.status === true) {

        this.DB.CurrentProjektpunkt.Status      = this.Const.Projektpunktstatustypen.Geschlossen.Name;
        this.DB.CurrentProjektpunkt.Fortschritt = 100;
      }
      else {

        this.DB.CurrentProjektpunkt.Status      = this.Const.Projektpunktstatustypen.Offen.Name;
        this.DB.CurrentProjektpunkt.Fortschritt = 0;
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Planungsmatrixeintrag Editor', 'StatusCheckedChanged', this.Debug.Typen.Component);
    }
  }

  CanDeleteCheckedChanged(event: { status: boolean; index: number; event: any }) {

    try {

      this.CanDelete = event.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Planungsmatrixeintrag Editor', 'CanDeleteCheckedChanged', this.Debug.Typen.Component);
    }
  }

  AnwendungCheckedChanged(event: { status: boolean; index: number; event: any }) {

    try {

      this.DB.CurrentProjektpunkt.Matrixanwendung = event.status;
      this.DB.CurrentProjektpunkt.Fortschritt     = 0;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Planungsmatrixeintrag Editor', 'AnwendungCheckedChanged', this.Debug.Typen.Component);
    }
  }

  GetTerminWert(): string {

    try {

      let Datum: Moment = moment();

      if(this.DB.CurrentProjektpunkt !== null && this.DB.CurrentProjektpunkt.Endezeitstempel !== null) {

        Datum = moment(this.DB.CurrentProjektpunkt.Endezeitstempel);

        return Datum.format('DD.MM.YYYY');

      }
      else {

        Datum.add(1, 'month');

        if(this.DB.CurrentProjektpunkt !== null) {

          this.DB.CurrentProjektpunkt.Endezeitstempel = Datum.valueOf();
          this.DB.CurrentProjektpunkt.Endezeitstring  = Datum.format('DD.MM.YYYY');

        }

        return Datum.format('DD.MM.YYYY');
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Planungsmatrixeintrag Editor', 'GetTerminWert', this.Debug.Typen.Component);
    }
  }

  MeilensteinCheckChanged(event: { status: boolean; index: number; event: any; value: string }) {

    try {

      if(this.DB.CurrentProjektpunkt !== null) {

        this.DB.CurrentProjektpunkt.Meilenstein = event.status;
      }

      if(event.status === true) {

        this.DB.CurrentProjektpunkt.Meilensteinstatus = 'ON';
      }
      else {

        this.DB.CurrentProjektpunkt.Meilensteinstatus = 'OFF';
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Planungsmatrixeintrag Editor', 'MeilensteinCheckChanged', this.Debug.Typen.Component);
    }
  }
}
