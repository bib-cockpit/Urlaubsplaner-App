import {
  AfterViewInit,
  Component,
  EventEmitter, Input, OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {DebugProvider} from "../../services/debug/debug";
import {InputCloneComponent} from "../../components/input-clone/input-clone.component";
import {DisplayService} from "../../services/diplay/display.service";
import {ConstProvider} from "../../services/const/const";
import {DatabaseGebaeudestrukturService} from "../../services/database-gebaeudestruktur/database-gebaeudestruktur";
import * as Joi from "joi";
import {ObjectSchema} from "joi";
import {Bauteilstruktur} from "../../dataclasses/bauteilstruktur";

@Component({
  selector: 'pj-gebaeude-bauteileditor',
  templateUrl: './pj-gebaeude-bauteileditor.component.html',
  styleUrls: ['./pj-gebaeude-bauteileditor.component.scss'],
})

export class PjGebaeudeBauteileditorComponent implements OnInit, OnDestroy, AfterViewInit {


  public Valid: boolean;
  private JoiShema: ObjectSchema<Bauteilstruktur>;

  @Output() ValidChange         = new EventEmitter<boolean>();
  @Output() CancelClickedEvent  = new EventEmitter<any>();
  @Output() OkClickedEvent      = new EventEmitter<any>();

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

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bauteil Editor', 'constructor', this.Debug.Typen.Component);
    }
  }

  ngOnDestroy(): void {

      try {

        this.Displayservice.RemoveDialog(this.Displayservice.Dialognamen.Bauteileditor);

      } catch (error) {

        this.Debug.ShowErrorMessage(error.message, 'Bauteil Editor', 'OnDestroy', this.Debug.Typen.Component);
      }

    }

  ngOnInit() {

    try {

      this.SetupValidation();
      this.ValidateInput();

      this.Displayservice.AddDialog(this.Displayservice.Dialognamen.Bauteileditor, this.ZIndex);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bauteil Editor', 'OnInit', this.Debug.Typen.Component);
    }
  }

  private SetupValidation() {

    try {

      this.JoiShema = Joi.object<Bauteilstruktur>({

        Bauteilname:    Joi.string().required().max(100),
        Listenposition: Joi.number().required(),

      }).options({ stripUnknown: true });


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bauteil Editor', 'SetupValidation', this.Debug.Typen.Component);
    }
  }

  ValidateInput() {

    try {

      let Result = this.JoiShema.validate(this.DB.CurrentBauteil);

      if(Result.error) {

        this.Valid = false;

        this.Debug.ShowErrorMessage(Result.error.message, 'Bauteil Editor', 'ValidateInput', this.Debug.Typen.Component);
      }
      else this.Valid = true;

      this.ValidChange.emit(this.Valid);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bauteil Editor', 'ValidateInput', this.Debug.Typen.Component);
    }
  }

  TextChanged(event: { Titel: string; Text: string; Valid: boolean }) {

    try {

      this.ValidateInput();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bauteil Editor', 'TextChanged', this.Debug.Typen.Component);
    }
  }

  ngAfterViewInit(): void {

    try {


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bauteil Editor', 'AfterViewInit', this.Debug.Typen.Component);
    }
  }


  CancelButtonClicked() {

    // this.ResetEditor();

    this.CancelClickedEvent.emit();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bauteil Editor', 'CancelButtonClicked', this.Debug.Typen.Component);
    }
  }

  OkButtonClicked() {

    try {

      this.DB.SaveBauteil().then(() => {

        // this.ResetEditor();

        this.OkClickedEvent.emit();

      }).catch((error) => {

        debugger;

      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bauteil Editor', 'OkButtonClicked', this.Debug.Typen.Component);
    }
  }

  ContentClicked(event: MouseEvent) {

    try {

      event.preventDefault();
      event.stopPropagation();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bauteil Editor', 'ContentClicked', this.Debug.Typen.Component);
    }
  }

  ListenpositionChangedHandler(event: any) {

    try {

      let Text = <number>event.detail.value;

      this.DB.CurrentBauteil.Listenposition = Text;

      event.stopPropagation();
      event.preventDefault();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bauteil Editor', 'ListenpositionChangedHandler', this.Debug.Typen.Component);
    }
  }
}
