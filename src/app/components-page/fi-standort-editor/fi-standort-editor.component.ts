import {
  AfterViewInit,
  Component,
  EventEmitter, Input, OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {DebugProvider} from "../../services/debug/debug";
import {InputCloneComponent} from "../../components/input-clone/input-clone.component";
import {DatabaseStandorteService} from "../../services/database-standorte/database-standorte.service";
import {DisplayService} from "../../services/diplay/display.service";
import {ConstProvider} from "../../services/const/const";
import {HttpErrorResponse} from "@angular/common/http";
import {ToolsProvider} from "../../services/tools/tools";
import * as Joi from "joi";
import * as lodash from "lodash-es";
import {ObjectSchema} from "joi";
import {DatabaseUrlaubService} from "../../services/database-urlaub/database-urlaub.service";
import {Regionenstruktur} from "../../dataclasses/regionenstruktur";
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";

@Component({
  selector: 'fi-standort-editor',
  templateUrl: './fi-standort-editor.component.html',
  styleUrls: ['./fi-standort-editor.component.scss'],
})

export class FiStandortEditorComponent implements OnInit, OnDestroy, AfterViewInit {

  public Valid: boolean;
  public CanDelete: boolean;
  private JoiShema: ObjectSchema;

  @Output() ValidChange = new EventEmitter<boolean>();
  @Output() CancelClickedEvent         = new EventEmitter<any>();
  @Output() OkClickedEvent             = new EventEmitter<any>();
  @Output() DeleteClickedEvent         = new EventEmitter<any>();
  @Output() LandClickedEvent           = new EventEmitter<any>();
  @Output() BundeslandClickedEvent     = new EventEmitter<any>();
  @Output() KonfessionClickedEvent     = new EventEmitter<any>();

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
              private Pool: DatabasePoolService,
              private DBUrlaub: DatabaseUrlaubService,
              public DB: DatabaseStandorteService) {

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

      this.Debug.ShowErrorMessage(error.message, 'Standort Editor', 'constructor', this.Debug.Typen.Component);
    }
  }

  ngOnDestroy(): void {

      try {

        this.Displayservice.RemoveDialog(this.Displayservice.Dialognamen.Standorteditor);

      } catch (error) {

        this.Debug.ShowErrorMessage(error.message, 'Standort Editor', 'OnDestroy', this.Debug.Typen.Component);
      }
  }

  private SetupValidation() {

    try {


      this.JoiShema = Joi.object({

        Standort:  Joi.string().required().max(100),
        Kuerzel:   Joi.string().required().min(3).max(10),
        Strasse:   Joi.string().required().max(100),
        Ort:       Joi.string().required().max(100),
        PLZ:       Joi.string().required().min(4).max(5),
        Email:     Joi.string().required().max(255).email({ tlds: { allow: false } }).required(),

      }).options({ stripUnknown: true });


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Standort Editor', 'SetupValidation', this.Debug.Typen.Component);
    }
  }

  ngOnInit() {

    try {

      this.SetupValidation();

      this.Displayservice.AddDialog(this.Displayservice.Dialognamen.Standorteditor, this.ZIndex);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Standort Editor', 'OnInit', this.Debug.Typen.Component);
    }
  }

  ValidateInput() {

    try {

      let Result = this.JoiShema.validate(this.DB.CurrentStandort);

      if(Result.error) this.Valid = false;
      else             this.Valid = true;

      if(this.Pool.Mitarbeiterdaten === null || this.Pool.Mitarbeiterdaten.Planeradministrator === false) this.Valid = false;

      this.ValidChange.emit(this.Valid);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Standort Editor', 'ValidateInput', this.Debug.Typen.Component);
    }
  }

  TextChanged(event: { Titel: string; Text: string; Valid: boolean }) {

    try {

      this.ValidateInput();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Standort Editor', 'TextChanged', this.Debug.Typen.Component);
    }
  }

  ngAfterViewInit(): void {

    try {

      this.ValidateInput();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Standort Editor', 'AfterViewInit', this.Debug.Typen.Component);
    }
  }


  CancelButtonClicked() {

    // this.ResetEditor();

    this.CancelClickedEvent.emit();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Standort Editor', 'CancelButtonClicked', this.Debug.Typen.Component);
    }
  }

  DeleteButtonClicked() {

    try {

      if(this.CanDelete) {

        this.DB.DeleteStandort().then(() => {

          this.DeleteClickedEvent.emit();

        }).catch((exception: HttpErrorResponse) => {

          this.Tools.ShowHinweisDialog(exception.error.message);
        });

      }


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Standort Editor', 'DeleteButtonClicked', this.Debug.Typen.Component);
    }
  }

  OkButtonClicked() {

    try {

      debugger;

      if(this.DB.CurrentStandort._id === null) {

        this.DB.AddStandort().then((result: any) => {

          this.OkClickedEvent.emit();

        }).catch((error: HttpErrorResponse) => {

          this.Tools.ShowHinweisDialog(error.error);

        });
      }
      else {

        this.DB.UpdateStandort().then(() => {


          this.OkClickedEvent.emit();

        }).catch((exception: HttpErrorResponse) => {

          this.Tools.ShowHinweisDialog(exception.error.message);
        });
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Standort Editor', 'OkButtonClicked', this.Debug.Typen.Component);
    }
  }

  ContentClicked(event: MouseEvent) {

    event.preventDefault();
    event.stopPropagation();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Standort Editor', 'ContentClicked', this.Debug.Typen.Component);
    }
  }

  CanDeleteCheckedChanged(event: {status: boolean; index: number; event: any}) {

    try {

      this.CanDelete = event.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Standort Editor', 'CanDeleteCheckedChanged', this.Debug.Typen.Component);
    }

  }

  GetLand() {

    try {

      if(this.DB.CurrentStandort !== null) {

        switch (this.DB.CurrentStandort.Land) {

          case 'DE': return 'Deutschland'; break;
          case 'BG': return 'Bulgarien';   break;
        }
      }
      else return 'Unbekannt';


    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Standort Editor', 'GetLand', this.Debug.Typen.Component);
    }
  }

  GetBundesland(): string {

    try {

      let Region: Regionenstruktur;

      if(this.DB.CurrentStandort !== null) {

        Region = lodash.find(this.DBUrlaub.Regionenliste, {isoCode: this.DB.CurrentStandort.Bundesland});

        if(!lodash.isUndefined(Region)) return Region.Name;
        else return 'Unbekannt';

      } else {

        return 'Unbekannt';
      }


    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Standort Editor', 'funGetBundeslandction', this.Debug.Typen.Component);
    }
  }

  GetKonfession() {

    try {

      if(this.DB.CurrentStandort !== null) {

        switch (this.DB.CurrentStandort.Konfession) {

          case 'RK': return 'Katholisch';  break;
          case 'EV': return 'Evangelisch'; break;
        }
      }
      else return 'Unbekannt';


    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Standort Editor', 'GetKonfession', this.Debug.Typen.Component);
    }
  }
}
