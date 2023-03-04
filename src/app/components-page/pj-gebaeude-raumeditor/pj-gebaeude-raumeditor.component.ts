import {
  AfterViewInit,
  Component,
  EventEmitter, Input, OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';
import {DebugProvider} from "../../services/debug/debug";
import {InputCloneComponent} from "../../components/input-clone/input-clone.component";
import {DisplayService} from "../../services/diplay/display.service";
import {ConstProvider} from "../../services/const/const";
import {DatabaseGebaeudestrukturService} from "../../services/database-gebaeudestruktur/database-gebaeudestruktur";
import * as Joi from "joi";
import {Geschossstruktur} from "../../dataclasses/geschossstruktur";
import {ObjectSchema} from "joi";
import {Raumstruktur} from "../../dataclasses/raumstruktur";

@Component({
  selector: 'pj-gebaeude-raumeditor',
  templateUrl: './pj-gebaeude-raumeditor.component.html',
  styleUrls: ['./pj-gebaeude-raumeditor.component.scss'],
})

export class PjGebaeudeRaumeditorComponent implements OnInit, OnDestroy, AfterViewInit {

  public Valid: boolean;
  private JoiShema: ObjectSchema<Raumstruktur>;
  public DeleteEnabled: boolean;

  @Output() ValidChange         = new EventEmitter<boolean>();
  @Output() CancelClickedEvent  = new EventEmitter<any>();
  @Output() OkClickedEvent      = new EventEmitter<any>();
  @Output() DeleteClickedEvent  = new EventEmitter<any>();

  @Input() Titel: string;
  @Input() Iconname: string;
  @Input() Dialogbreite: number;
  @Input() Dialoghoehe: number;
  @Input() PositionY: number;
  @Input() ZIndex: number;

  constructor(public Debug: DebugProvider,
              public Displayservice: DisplayService,
              public Const: ConstProvider,
              public DB: DatabaseGebaeudestrukturService) {

    try {

      this.Valid             = true;
      this.Titel             = this.Const.NONE;
      this.Iconname          = 'location-outline';
      this.Dialogbreite      = 400;
      this.Dialoghoehe       = 300;
      this.PositionY         = 100;
      this.ZIndex            = 3000;
      this.DeleteEnabled     = false;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Raum Editor', 'constructor', this.Debug.Typen.Component);
    }
  }

  ngOnDestroy(): void {

      try {

        this.Displayservice.RemoveDialog(this.Displayservice.Dialognamen.Raumeditor);

      } catch (error) {

        this.Debug.ShowErrorMessage(error.message, 'Raum Editor', 'OnDestroy', this.Debug.Typen.Component);
      }

    }

  ngOnInit() {

    try {

      this.Displayservice.AddDialog(this.Displayservice.Dialognamen.Raumeditor, this.ZIndex);

      this.SetupValidation();
      this.ValidateInput();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Raum Editor', 'OnInit', this.Debug.Typen.Component);
    }
  }

  ValidateInput() {

    try {

      let Result = this.JoiShema.validate(this.DB.CurrentRaum);

      if(Result.error) {

        this.Valid = false;

        this.Debug.ShowErrorMessage(Result.error.message, 'Raum Editor', 'ValidateInput', this.Debug.Typen.Component);

      }
      else this.Valid = true;

      this.ValidChange.emit(this.Valid);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Raum Editor', 'ValidateInput', this.Debug.Typen.Component);
    }
  }

  TextChanged(event: { Titel: string; Text: string; Valid: boolean }) {

    try {

      this.ValidateInput();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Raum Editor', 'TextChanged', this.Debug.Typen.Component);
    }
  }

  ngAfterViewInit(): void {

    try {

      this.DeleteEnabled = false;

      this.ValidateInput();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Raum Editor', 'AfterViewInit', this.Debug.Typen.Component);
    }
  }


  CancelButtonClicked() {

    // this.ResetEditor();

    this.CancelClickedEvent.emit();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Raum Editor', 'CancelButtonClicked', this.Debug.Typen.Component);
    }
  }

  OkButtonClicked() {

    try {

      this.DB.SaveRaum().then(() => {

        this.OkClickedEvent.emit();

      }).catch((error) => {

        debugger;
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Raum Editor', 'OkButtonClicked', this.Debug.Typen.Component);
    }
  }

  LoeschenButtonClicked() {

    try {

      this.DB.DeleteRaum().then(() => {

        this.DeleteClickedEvent.emit();
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Raum Editor', 'LoeschenButtonClicked', this.Debug.Typen.Component);
    }
  }

  ContentClicked(event: MouseEvent) {

    event.preventDefault();
    event.stopPropagation();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Raum Editor', 'ContentClicked', this.Debug.Typen.Component);
    }
  }

  ListenpostionTextChanged(event: { Titel: string; Text: string; Valid: boolean }) {

    try {

      this.DB.CurrentRaum.Listenposition = parseInt(event.Text);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Raum Editor', 'ListenpostionTextChanged', this.Debug.Typen.Component);
    }
  }

  LoeschenCheckboxChanged(event: {status: boolean; index: number; event: any}) {

    try {

      this.DeleteEnabled = event.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Raum Editor', 'LoeschenCheckboxChanged', this.Debug.Typen.Component);
    }
  }

  private SetupValidation() {

    try {

      this.JoiShema = Joi.object<Raumstruktur>({

        Raumname:       Joi.string().required().max(100),
        Raumnummer:     Joi.string().required().max(10),
        Listenposition: Joi.number().required(),

      }).options({ stripUnknown: true });


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Raum Editor', 'SetupValidation', this.Debug.Typen.Component);
    }
  }


}
