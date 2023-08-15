import {
  AfterViewInit,
  Component,
  EventEmitter, Input, OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {DebugProvider} from "../../services/debug/debug";
import * as lodash from "lodash-es";
import {DisplayService} from "../../services/diplay/display.service";
import {ConstProvider} from "../../services/const/const";
import {HttpErrorResponse} from "@angular/common/http";
import {ToolsProvider} from "../../services/tools/tools";
import * as Joi from "joi";
import {ObjectSchema} from "joi";
import {DatabaseBautagebuchService} from "../../services/database-bautagebuch/database-bautagebuch.service";
import {BasicsProvider} from "../../services/basics/basics";
import {Bautagebucheintragstruktur} from "../../dataclasses/bautagebucheintragstruktur";
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";

@Component({
  selector: 'pj-bautagebuch-eintrageditor',
  templateUrl: './pj-bautagebuch-eintrageditor.component.html',
  styleUrls: ['./pj-bautagebuch-eintrageditor.component.scss'],
})

export class PjBautagebuchEintrageditorComponent implements OnInit, OnDestroy, AfterViewInit {

  public Valid: boolean;
  public CanDelete: boolean;
  private JoiShema: ObjectSchema;
  public DeleteEnabled: boolean;
  public Gesamthoehe: number;
  public Headerhoehe: number;
  public   Listehoehe: number;

  @Output() ValidChange = new EventEmitter<boolean>();
  @Output() CancelClickedEvent        = new EventEmitter<any>();
  @Output() OkClickedEvent            = new EventEmitter<any>();
  @Output() DeleteClickedEvent        = new EventEmitter<any>();

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
              private Pool: DatabasePoolService,
              public DB: DatabaseBautagebuchService) {

    try {

      this.Valid = true;
      this.Valid             = true;
      this.Titel             = this.Const.NONE;
      this.Iconname          = 'book-outline';
      this.Dialogbreite      = 400;
      this.Dialoghoehe       = 300;
      this.PositionY         = 100;
      this.ZIndex            = 3000;
      this.CanDelete         = false;
      this.DeleteEnabled     = false;
      this.Gesamthoehe       = 350;
      this.Headerhoehe       = 34;
      this.Listehoehe        = this.Gesamthoehe - this.Headerhoehe;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bautagebuch Eintrageditor', 'constructor', this.Debug.Typen.Component);
    }
  }

  ngOnDestroy(): void {

      try {

        this.Displayservice.RemoveDialog(this.Displayservice.Dialognamen.Bautagebucheintrageditor);

      } catch (error) {

        this.Debug.ShowErrorMessage(error.message, 'Bautagebuch Eintrageditor', 'OnDestroy', this.Debug.Typen.Component);
      }
  }

  private SetupValidation() {

    try {


      this.JoiShema = Joi.object({

        Arbeitszeit:   Joi.number().required().min(0).max(12),
        Taetigkeit:    Joi.string().required().min(1).max(256),


      }).options({ stripUnknown: true });


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bautagebuch Eintrageditor', 'SetupValidation', this.Debug.Typen.Component);
    }
  }

  ngOnInit() {

    try {

      this.SetupValidation();

      this.Displayservice.AddDialog(this.Displayservice.Dialognamen.Bautagebucheintrageditor, this.ZIndex);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bautagebuch Eintrageditor', 'OnInit', this.Debug.Typen.Component);
    }
  }

  ValidateInput() {

    try {

      let Result = this.JoiShema.validate(this.DB.CurrentTagebucheintrag);

      if(Result.error) this.Valid = false;
      else             this.Valid = true;

      this.ValidChange.emit(this.Valid);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bautagebuch Eintrageditor', 'ValidateInput', this.Debug.Typen.Component);
    }
  }

  ngAfterViewInit(): void {

    try {

      window.setTimeout( () => {

        this.ValidateInput();

        this.Titel = this.DB.CurrentTagebucheintrag.BautagebucheintragID !== null ? 'Tätigkeit bearbeiten' : 'Neue Tätigkeit';

      }, 30);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bautagebuch Eintrageditor', 'AfterViewInit', this.Debug.Typen.Component);
    }
  }


  CancelButtonClicked() {

    // this.ResetEditor();

    this.CancelClickedEvent.emit();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bautagebuch Eintrageditor', 'CancelButtonClicked', this.Debug.Typen.Component);
    }
  }

  OkButtonClicked() {

    try {

      let Index: number;

      if(this.DB.CurrentTagebucheintrag.BautagebucheintragID === null) {

        this.DB.CurrentTagebucheintrag.BautagebucheintragID = this.Pool.GetNewUniqueID();
        this.DB.CurrentTagebuch.Eintraegeliste.push(this.DB.CurrentTagebucheintrag);

        this.DB.CurrentTagebucheintrag = null;
      }
      else {

        Index = lodash.findIndex(this.DB.CurrentTagebuch.Eintraegeliste, {BautagebucheintragID: this.DB.CurrentTagebucheintrag.BautagebucheintragID});

        if(Index !== -1) {

          this.DB.CurrentTagebuch.Eintraegeliste[Index] = this.DB.CurrentTagebucheintrag;

          this.DB.CurrentTagebucheintrag = null;
        }
      }

      this.OkClickedEvent.emit();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bautagebuch Eintrageditor', 'OkButtonClicked', this.Debug.Typen.Component);
    }
  }

  ContentClicked(event: MouseEvent) {

    event.preventDefault();
    event.stopPropagation();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bautagebuch Eintrageditor', 'ContentClicked', this.Debug.Typen.Component);
    }
  }

  public LoeschenButtonClicked() {

    try {

      this.DB.DeleteTagebucheintrag();
      this.OkClickedEvent.emit();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Bautagebuch Eintrageditor', 'LoeschenButtonClicked', this.Debug.Typen.Component);
    }
  }

  LoeschenCheckboxChanged(event: { status: boolean; index: number; event: any }) {

    try {

      this.DeleteEnabled = event.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Bautagebuch Eintrageditor', 'LoeschenCheckboxChanged', this.Debug.Typen.Component);
    }
  }

  TextChanged(event: { Titel: string; Text: string; Valid: boolean }) {

    try {

      this.ValidateInput();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Bautagebuch Eintrageditor', 'TextChanged', this.Debug.Typen.Component);
    }
  }

  ArbeitszeitChanged(event: { Titel: string; Text: string; Valid: boolean }) {

    try {

      if(event.Valid) {

        this.DB.CurrentTagebucheintrag.Arbeitszeit = parseFloat(event.Text);
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Bautagebuch Eintrageditor', 'ArbeitszeitChanged', this.Debug.Typen.Component);
    }
  }
}
