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
import {Bauteilstruktur} from "../../dataclasses/bauteilstruktur";
import {ObjectSchema} from "joi";
import {Geschossstruktur} from "../../dataclasses/geschossstruktur";

@Component({
  selector: 'pj-gebaeude-geschosseditor',
  templateUrl: './pj-gebaeude-geschosseditor.component.html',
  styleUrls: ['./pj-gebaeude-geschosseditor.component.scss'],
})

export class PjGebaeudeGeschosseditorComponent implements OnInit, OnDestroy, AfterViewInit {


  public Valid: boolean;
  private JoiShema: ObjectSchema<Geschossstruktur>;
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

      this.Debug.ShowErrorMessage(error, 'Geschoss Editor', 'constructor', this.Debug.Typen.Component);
    }
  }

  ngOnDestroy(): void {

      try {

        this.Displayservice.RemoveDialog(this.Displayservice.Dialognamen.Geschosseditor);

      } catch (error) {

        this.Debug.ShowErrorMessage(error, 'Geschoss Editor', 'OnDestroy', this.Debug.Typen.Component);
      }

    }

  ngOnInit() {

    try {

      this.SetupValidation();
      this.ValidateInput();

      this.Displayservice.AddDialog(this.Displayservice.Dialognamen.Geschosseditor, this.ZIndex);

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Geschoss Editor', 'OnInit', this.Debug.Typen.Component);
    }
  }

  private SetupValidation() {

    try {

      this.JoiShema = Joi.object<Geschossstruktur>({

        Geschossname:    Joi.string().required().max(100),
        Kurzbezeichnung: Joi.string().required().max(10),
        Listenposition:  Joi.number().required(),

      }).options({ stripUnknown: true });


    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Bauteil Editor', 'SetupValidation', this.Debug.Typen.Component);
    }
  }

  ValidateInput() {

    try {

      let Result = this.JoiShema.validate(this.DB.CurrentGeschoss);

      if(Result.error) {

        this.Valid = false;

        console.log(Result.error.message);
      }
      else this.Valid = true;

      this.ValidChange.emit(this.Valid);

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Geschoss Editor', 'ValidateInput', this.Debug.Typen.Component);
    }
  }

  TextChanged(event: { Titel: string; Text: string; Valid: boolean }) {

    try {

      this.ValidateInput();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Geschoss Editor', 'TextChanged', this.Debug.Typen.Component);
    }
  }

  ngAfterViewInit(): void {

    try {

      this.DeleteEnabled = false;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Geschoss Editor', 'AfterViewInit', this.Debug.Typen.Component);
    }
  }

  CancelButtonClicked() {

    // this.ResetEditor();

    this.CancelClickedEvent.emit();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Geschoss Editor', 'CancelButtonClicked', this.Debug.Typen.Component);
    }
  }


  LoeschenButtonClicked() {

    try {

      this.DB.DeleteGeschoss().then(() => {

        this.DeleteClickedEvent.emit();
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Geschoss Editor', 'LoeschenButtonClicked', this.Debug.Typen.Component);
    }
  }


  OkButtonClicked() {

    this.DB.SaveGeschoss().then(() => {


      if(this.DB.CurrentGeschossindex === null && this.DB.CurrentBauteil.Geschossliste.length > 0) {

        this.DB.CurrentGeschossindex = 0;
      }

      this.OkClickedEvent.emit();

    }).catch((error) => {

      debugger;

    });


    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Geschoss Editor', 'OkButtonClicked', this.Debug.Typen.Component);
    }
  }

  ContentClicked(event: MouseEvent) {

    event.preventDefault();
    event.stopPropagation();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Geschoss Editor', 'ContentClicked', this.Debug.Typen.Component);
    }
  }

  ListenpostionTextChanged(event: { Titel: string; Text: string; Valid: boolean }) {

    try {

      this.DB.CurrentGeschoss.Listenposition = parseInt(event.Text);

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Geschoss Editor', 'ListenpostionTextChanged', this.Debug.Typen.Component);
    }
  }

  LoeschenCheckboxChanged(event: {status: boolean; index: number; event: any}) {

    try {

      this.DeleteEnabled = event.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Geschoss Editor', 'LoeschenCheckboxChanged', this.Debug.Typen.Component);
    }
  }
}
