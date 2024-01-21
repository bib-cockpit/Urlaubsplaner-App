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
import {DatabaseSimontabelleService} from "../../services/database-simontabelle/database-simontabelle.service";

@Component({
  selector: 'pj-simontabelle-leistungeneditor',
  templateUrl: './pj-simontabelle-leistungeneditor.component.html',
  styleUrls: ['./pj-simontabelle-leistungeneditor.component.scss'],
})

export class PjSimontabelleLeistungeneditorComponent implements OnInit, OnDestroy, AfterViewInit {

  public Valid: boolean;
  public CanDelete: boolean;
  private JoiShema: ObjectSchema;

  @Output() ValidChange = new EventEmitter<boolean>();
  @Output() CancelClickedEvent         = new EventEmitter<any>();
  @Output() OkClickedEvent             = new EventEmitter<any>();
  @Output() DeleteClickedEvent         = new EventEmitter<any>();

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
              public DB: DatabaseSimontabelleService) {
    try {

      this.Valid = true;
      this.Valid             = true;
      this.Titel             = 'Besondere Leistung';
      this.Iconname          = 'airplane-outline';
      this.Dialogbreite      = 400;
      this.Dialoghoehe       = 500;
      this.PositionY         = 100;
      this.ZIndex            = 2000;
      this.CanDelete         = false;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'SImontabelle Leistungeditor', 'constructor', this.Debug.Typen.Component);
    }
  }

  ngOnDestroy(): void {

      try {

        this.Displayservice.RemoveDialog(this.Displayservice.Dialognamen.Simontabellelesitungeditor);

      } catch (error) {

        this.Debug.ShowErrorMessage(error.message, 'SImontabelle Leistungeditor', 'OnDestroy', this.Debug.Typen.Component);
      }
  }

  private SetupValidation() {

    try {

      this.JoiShema = Joi.object({

        Nummer:       Joi.string().required().min(1).max(5),
        Titel:        Joi.string().required().min(10).max(200),
        Beschreibung: Joi.string().required().min(10).max(600),

      }).options({ stripUnknown: true });


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'SImontabelle Leistungeditor', 'SetupValidation', this.Debug.Typen.Component);
    }
  }

  ngOnInit() {

    try {

      this.SetupValidation();

      this.Displayservice.AddDialog(this.Displayservice.Dialognamen.Simontabellelesitungeditor, this.ZIndex);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'SImontabelle Leistungeditor', 'OnInit', this.Debug.Typen.Component);
    }
  }

  ValidateInput() {

    try {

      let Result = this.JoiShema.validate(this.DB.CurrentBesondereleistung);

      if(Result.error) this.Valid = false;
      else             this.Valid = true;

      if(this.DB.CurrentSimontabelle.Honorar === 0) this.Valid = false;

      this.ValidChange.emit(this.Valid);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'SImontabelle Leistungeditor', 'ValidateInput', this.Debug.Typen.Component);
    }
  }

  TextChanged(event: { Titel: string; Text: string; Valid: boolean }) {

    try {

      this.ValidateInput();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'SImontabelle Leistungeditor', 'TextChanged', this.Debug.Typen.Component);
    }
  }

  ngAfterViewInit(): void {

    try {

      this.ValidateInput();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'SImontabelle Leistungeditor', 'AfterViewInit', this.Debug.Typen.Component);
    }
  }

  CancelButtonClicked() {

    this.CancelClickedEvent.emit();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'SImontabelle Leistungeditor', 'CancelButtonClicked', this.Debug.Typen.Component);
    }
  }

  DeleteButtonClicked() {

    try {

      this.DeleteClickedEvent.emit();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'SImontabelle Leistungeditor', 'DeleteButtonClicked', this.Debug.Typen.Component);
    }
  }

  OkButtonClicked() {

    try {

      debugger;

      if(this.DB.CurrentBesondereleistung.LeistungID === null) {

        this.DB.AddBesondereleistung(this.DB.CurrentBesondereleistung).then((result: any) => {

          this.OkClickedEvent.emit();

        }).catch((error: HttpErrorResponse) => {

          this.Tools.ShowHinweisDialog(error.error);

        });
      }
      else {

        this.DB.UpdateBesondereleistung(this.DB.CurrentBesondereleistung).then(() => {

          this.OkClickedEvent.emit();

        }).catch((exception: HttpErrorResponse) => {

          this.Tools.ShowHinweisDialog(exception.error.message);
        });
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'SImontabelle Leistungeditor', 'OkButtonClicked', this.Debug.Typen.Component);
    }
  }

  ContentClicked(event: MouseEvent) {

    event.preventDefault();
    event.stopPropagation();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'SImontabelle Leistungeditor', 'ContentClicked', this.Debug.Typen.Component);
    }
  }


  CanDeleteCheckedChanged(event: { status: boolean; index: number; event: any }) {

    try {

      this.CanDelete = event.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'SImontabelle Leistungeditor', 'CanDeleteCheckedChanged', this.Debug.Typen.Component);
    }
  }

  CanDeleteCheckChanged(event: {status: boolean; index: number; event: any; value: string}) {

    try {

      this.CanDelete = event.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'SImontabelle Leistungeditor', 'CanDeleteCheckChanged', this.Debug.Typen.Component);
    }

  }

  HonorarChanged(event: {Titel: string; Text: any; Valid: boolean}) {

    try {

      let Valid: boolean;

      Valid = !isNaN(parseFloat(event.Text)) && isFinite(event.Text);

      if(Valid === true) {

        this.DB.CurrentBesondereleistung.Honorar = parseFloat(event.Text);
      }

      this.ValidateInput();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'SImontabelle Leistungeditor', 'HonorarChanged', this.Debug.Typen.Component);
    }
  }
}
