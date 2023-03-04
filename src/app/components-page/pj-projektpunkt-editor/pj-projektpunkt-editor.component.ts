import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';
import {BasicsProvider} from "../../services/basics/basics";
import {DebugProvider} from "../../services/debug/debug";
import {ToolsProvider} from "../../services/tools/tools";
import {DatabaseProjekteService} from "../../services/database-projekte/database-projekte.service";
import {ConstProvider} from "../../services/const/const";
import * as lodash from 'lodash-es';
import {DatabaseMitarbeiterService} from "../../services/database-mitarbeiter/database-mitarbeiter.service";
import {DatabaseStandorteService} from "../../services/database-standorte/database-standorte.service";
import {DisplayService} from "../../services/diplay/display.service";
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
import {DatabaseProjektbeteiligteService} from "../../services/database-projektbeteiligte/database-projektbeteiligte.service";
import {DatabaseGebaeudestrukturService} from "../../services/database-gebaeudestruktur/database-gebaeudestruktur";
import {DatabaseProjektpunkteService} from "../../services/database-projektpunkte/database-projektpunkte.service";
import MyMoment, {Moment} from "moment";
import {Mitarbeiterstruktur} from "../../dataclasses/mitarbeiterstruktur";
import {Projektbeteiligtestruktur} from "../../dataclasses/projektbeteiligtestruktur";
import {DatabaseProtokolleService} from "../../services/database-protokolle/database-protokolle.service";
import moment from "moment";
import {Projektpunktanmerkungstruktur} from "../../dataclasses/projektpunktanmerkungstruktur";
import {KostengruppenService} from "../../services/kostengruppen/kostengruppen.service";
import * as Joi from "joi";
import {ObjectSchema} from "joi";
import {Projektpunktestruktur} from "../../dataclasses/projektpunktestruktur";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'pj-projektpunkt-editor',
  templateUrl: './pj-projektpunkt-editor.component.html',
  styleUrls: ['./pj-projektpunkt-editor.component.scss'],
})
export class PjProjektpunktEditorComponent implements OnInit, OnDestroy, AfterViewInit {

  @Output() CancelClickedEvent      = new EventEmitter<any>();
  @Output() OkClickedEvent          = new EventEmitter<any>();
  @Output() StatusClicked           = new EventEmitter<any>();
  @Output() FachbereichClicked      = new EventEmitter<any>();
  @Output() TerminButtonClicked     = new EventEmitter<any>();
  @Output() ZustaendigInternClicked = new EventEmitter<any>();
  @Output() ZustaendigExternClicked = new EventEmitter<any>();
  @Output() KostengruppeClicked     = new EventEmitter<any>();
  @Output() GebaeudeteilClicked     = new EventEmitter<any>();

  @Input() Titel: string;
  @Input() Iconname: string;
  @Input() Dialogbreite: number;
  @Input() Dialoghoehe: number;
  @Input() PositionY: number;
  @Input() ZIndex: number;

  public Valid: boolean;
  public DeleteEnabled: boolean;
  public Editorconfig: any;
  // public Smalleditorconfig: any;
  public StatusbuttonEnabled: boolean;
  private JoiShema: ObjectSchema<Projektpunktestruktur>;
  public Auswahlliste: string[];
  public Auswahlindex: number;
  public Auswahltitel: string;

  constructor(public Basics: BasicsProvider,
              public Debug: DebugProvider,
              public Tools: ToolsProvider,
              public DB: DatabaseProjektpunkteService,
              public DBMitarbeiter: DatabaseMitarbeiterService,
              public DBStandort: DatabaseStandorteService,
              public DBBeteiligte: DatabaseProjektbeteiligteService,
              public DBProjekt: DatabaseProjekteService,
              public DBProtokoll: DatabaseProtokolleService,
              public Displayservice: DisplayService,
              public Pool: DatabasePoolService,
              public KostenService: KostengruppenService,
              public DBGebaeude: DatabaseGebaeudestrukturService,
              public Const: ConstProvider) {
    try {



      this.Valid = true;
      this.DeleteEnabled = false;
      this.Titel = this.Const.NONE;
      this.Iconname = 'help-circle-outline';
      this.Dialogbreite = 400;
      this.Dialoghoehe = 300;
      this.PositionY = 100;
      this.ZIndex = 2000;
      this.StatusbuttonEnabled = true;

      this.StatusbuttonEnabled = this.DB.CurrentProjektpunkt.Status !== this.Const.Projektpunktstatustypen.Festlegung.Name;

      this.Editorconfig = {

        menubar:   false,
        statusbar: false,
        language: 'de',
        browser_spellcheck: true,
        height: 300,
        auto_focus : true,
        content_style: 'body { color: black; margin: 0; line-height: 0.9; }, ',
        base_url: 'assets/tinymce', // Root for resources
        suffix: '.min',        // Suffix to use when loading resources
        toolbar: [
          { name: 'styles',      items: [ 'forecolor', 'backcolor' ] }, // , 'fontfamily', 'fontsize'
          { name: 'formatting',  items: [ 'bold', 'italic', 'underline', 'strikethrough' ] },
          { name: 'alignment',   items: [ 'alignleft', 'aligncenter', 'alignright', 'alignjustify' ] },
          { name: 'indentation', items: [ 'outdent', 'indent' ] }
        ],
      };

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkt Editor', 'constructor', this.Debug.Typen.Component);
    }
  }

  ngOnDestroy(): void {

    try {

      this.Displayservice.RemoveDialog(this.Displayservice.Dialognamen.Projektpunteditor);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkt Editor', 'OnDestroy', this.Debug.Typen.Component);
    }
  }

  ngOnInit() {

    try {

      this.Displayservice.AddDialog(this.Displayservice.Dialognamen.Projektpunteditor, this.ZIndex);

      this.DBGebaeude.Init();
      this.SetupValidation();
      this.PrepareData();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkt Editor', 'OnInit', this.Debug.Typen.Component);
    }
  }

  private PrepareData() {

    try {


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkt Editor', 'PrepareData', this.Debug.Typen.Component);
    }
  }

  ngAfterViewInit(): void {

    try {

      window.setTimeout(() => {

        this.ValidateInput();

      }, 30);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkt Editor', 'AfterViewInit', this.Debug.Typen.Component);
    }
  }


  CanDeleteCheckedChanged(event: {status: boolean; index: number; event: any}) {

    try {

      this.DeleteEnabled = event.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkt Editor', 'CanDeleteCheckedChanged', this.Debug.Typen.Component);
    }
  }

  private SetupValidation() {

    try {

      this.JoiShema = Joi.object<Projektpunktestruktur>({

        Aufgabe: Joi.string().required(),

      }).options({ stripUnknown: true });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Beteiligten Editor', 'SetupValidation', this.Debug.Typen.Component);
    }
  }

  ValidateInput() {

    try {

      let Result = this.JoiShema.validate(this.DB.CurrentProjektpunkt);

      if(Result.error) this.Valid = false;
      else             this.Valid = true;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkt Editor', 'ValidateInput', this.Debug.Typen.Component);
    }
  }

  /*

  TextChanged(event: { Titel: string; Text: string; Valid: boolean }) {

    try {

      debugger;

      this.ValidateInput();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkt Editor', 'TextChanged', this.Debug.Typen.Component);
    }
  }

   */

  LoeschenCheckboxChanged(event: { status: boolean; index: number; event: any }) {

    try {

      this.DeleteEnabled = event.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkt Editor', 'LoeschenCheckboxChanged', this.Debug.Typen.Component);
    }
  }

  private ResetEditor() {

    try {

      this.DeleteEnabled = false;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkt Editor', 'ResetEditor', this.Debug.Typen.Component);
    }
  }


  LoeschenButtonClicked() {

    try {

      this.DB.DeleteProjektpunkt(this.DB.CurrentProjektpunkt).then(() => {

        this.ResetEditor();

        // this.ModalKeeper.DialogVisibleChange.emit(false);
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkt Editor', 'LoeschenButtonClicked', this.Debug.Typen.Component);
    }
  }

  CancelButtonClicked() {

    this.ResetEditor();

    this.CancelClickedEvent.emit();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkt Editor', 'CancelButtonClicked', this.Debug.Typen.Component);
    }
  }

  OkButtonClicked() {

    try {

      let Index: number;

      this.DB.SetStatus(this.DB.CurrentProjektpunkt, this.DB.CurrentProjektpunkt.Status);

      if(this.DB.CurrentProjektpunkt._id === null) {

        this.DB.AddProjektpunkt(this.DB.CurrentProjektpunkt).then(() => {

          this.ResetEditor();

          if(this.DB.CurrentProjektpunkt.ProtokollID !== null && this.DBProtokoll.CurrentProtokoll !== null) {

            Index = lodash.indexOf(this.DBProtokoll.CurrentProtokoll.ProjektpunkteIDListe, this.DB.CurrentProjektpunkt._id);

            if(Index === -1) {

              this.DBProtokoll.CurrentProtokoll.ProjektpunkteIDListe.push(this.DB.CurrentProjektpunkt._id);

              this.DBProtokoll.SaveProtokoll().then(() => {

                this.OkClickedEvent.emit();
              });
            }
            else {

              this.Pool.ProtokollprojektpunktChanged.emit();

              this.OkClickedEvent.emit();
            }
          }
          else {

            this.OkClickedEvent.emit();
          }
        }).catch((errora) => {

          this.Debug.ShowErrorMessage(errora, 'Projektpunkt Editor', 'OkButtonClicked / AddProjektpunkt', this.Debug.Typen.Component);
        });
      }
      else {

        this.DB.UpdateProjektpunkt(this.DB.CurrentProjektpunkt).then(() => {

          this.ResetEditor();

          if(this.DB.CurrentProjektpunkt.ProtokollID !== null && this.DBProtokoll.CurrentProtokoll !== null) {

            Index = lodash.indexOf(this.DBProtokoll.CurrentProtokoll.ProjektpunkteIDListe, this.DB.CurrentProjektpunkt._id);

            if(Index === -1) {

              this.DBProtokoll.CurrentProtokoll.ProjektpunkteIDListe.push(this.DB.CurrentProjektpunkt._id);

              this.DBProtokoll.SaveProtokoll().then(() => {

                this.OkClickedEvent.emit();
              });
            }
            else {

              this.Pool.ProtokollprojektpunktChanged.emit();

              this.OkClickedEvent.emit();
            }
          }

          this.OkClickedEvent.emit();

        }).catch((errorb) => {

          this.Debug.ShowErrorMessage(errorb, 'Projektpunkt Editor', 'OkButtonClicked / UpdateProjektpunkt', this.Debug.Typen.Component);
        });
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkt Editor', 'OkButtonClicked', this.Debug.Typen.Component);
    }
  }

  ContentClicked(event: MouseEvent) {

    event.preventDefault();
    event.stopPropagation();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkt Editor', 'ContentClicked', this.Debug.Typen.Component);
    }
  }


  GetStartdatum(): Moment {

    try {

      return MyMoment(this.DB.CurrentProjektpunkt.Startzeitsptempel);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkt Editor', 'GetStartdatum', this.Debug.Typen.Component);
    }
  }

  GetEndedatum() {

    try {

      return MyMoment(this.DB.CurrentProjektpunkt.Endezeitstempel);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkt Editor', 'GetEndedatum', this.Debug.Typen.Component);
    }
  }


  GetProjektname(): string {

    try {

      return this.DBProjekt.CurrentProjekt !== null ? this.DBProjekt.CurrentProjekt.Projektkurzname : 'unbekannt';
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkt Editor', 'ProjektButtonClicked', this.Debug.Typen.Component);
    }
  }

  AufgabeTextChangedHandler(event: any) {

    try {

      this.DB.CurrentProjektpunkt.Aufgabe = event.detail.value;

      this.ValidateInput();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkt Editor', 'AufgabeTextChangedHandler', this.Debug.Typen.Component);
    }
  }

  ProjektstatusButtonClicked() {

    try {

      this.Auswahlliste = [];

      for(let Status of this.DB.Statustypenliste) {

        if(Status.Name) {

          switch (Status.Name) {

            case this.Const.Projektpunktstatustypen.Protokollpunkt.Name:


              break;

            case this.Const.Projektpunktstatustypen.Offen.Name:

              this.Auswahlliste.push(this.Const.Projektpunktstatustypen.Offen.Displayname);

              break;

            case this.Const.Projektpunktstatustypen.Geschlossen.Name:

              this.Auswahlliste.push(this.Const.Projektpunktstatustypen.Geschlossen.Displayname);

              break;

            case this.Const.Projektpunktstatustypen.Bearbeitung.Name:

              if(!this.DB.CurrentProjektpunkt.Meilenstein)  this.Auswahlliste.push(this.Const.Projektpunktstatustypen.Bearbeitung.Displayname);

              break;

            case this.Const.Projektpunktstatustypen.Ruecklauf.Name:

              if(!this.DB.CurrentProjektpunkt.Meilenstein)  this.Auswahlliste.push(this.Const.Projektpunktstatustypen.Ruecklauf.Displayname);

              break;
          }
        }
      }

      if(this.DBProjekt.CurrentProjekt !== null) {

        this.Auswahlindex = lodash.findIndex(this.DB.Statustypenliste, {Name: this.DBProjekt.CurrentProjekt.Status});

      }
      else this.Auswahlindex = -1;

      /*
      this.Auswahltitel = 'Statusauswahl';

      this.MyAuswahlDialog.Open(false, this.Auswahlindex);

       */
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkt Editor', 'ProjektstatusButtonClicked', this.Debug.Typen.Component);
    }
  }

  StartdatumChanged(value: Moment) {

    try {

      let Zeitpunkt: Moment = value;

      this.DB.CurrentProjektpunkt.Startzeitsptempel = Zeitpunkt.valueOf();
      this.DB.CurrentProjektpunkt.Startzeitstring   = Zeitpunkt.format('DD.MM.YYYY');

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkt Editor', 'StartdatumChanged', this.Debug.Typen.Component);
    }
  }

  EndedatumChanged(value: Moment) {

    try {

      let Zeitpunkt: Moment = value;

      this.DB.CurrentProjektpunkt.Endezeitstempel = Zeitpunkt.valueOf();
      this.DB.CurrentProjektpunkt.Endezeitstring   = Zeitpunkt.format('DD.MM.YYYY');

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkt Editor', 'EndedatumChanged', this.Debug.Typen.Component);
    }
  }

  ZeitansatzeinheitChanged(event: any) {

    try {

      this.DB.CurrentProjektpunkt.Zeitansatzeinheit = event.detail.value;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkt Editor', 'ZeitansatzeinheitChanged', this.Debug.Typen.Component);
    }
  }


  OpenFestlegungCheckChanged(event: { status: boolean; index: number; event: any }) {

    try {

      this.DB.CurrentProjektpunkt.OpenFestlegung = event.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkt Editor', 'OpenFestlegungCheckChanged', this.Debug.Typen.Component);
    }
  }

  GetZustaendigInternListe(): string {

    try {

      let Value: string = '';
      let Mitarbeiter: Mitarbeiterstruktur;

      for(let id of this.DB.CurrentProjektpunkt.ZustaendigeInternIDListe) {

        Mitarbeiter = lodash.find(this.Pool.Mitarbeiterliste, {_id: id});

        if(!lodash.isUndefined(Mitarbeiter)) {

          Value += Mitarbeiter.Vorname + ' ' + Mitarbeiter.Name + '\n';
        }
      }

      return Value;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkt Editor', 'GetZustaendigInternListe', this.Debug.Typen.Component);
    }
  }

  GetZustaendigExternListe(): string {

    try {

      let Beteiligte: Projektbeteiligtestruktur;
      let Value: string = '';

      for(let id of this.DB.CurrentProjektpunkt.ZustaendigeExternIDListe) {

        Beteiligte = lodash.find(this.DBProjekt.CurrentProjekt.Beteiligtenliste, { BeteiligtenID: id });


        if(!lodash.isUndefined(Beteiligte)) {

          if(Beteiligte.Beteiligteneintragtyp === this.Const.Beteiligteneintragtypen.Person) {

            Value += this.DBBeteiligte.GetBeteiligtenvorname(Beteiligte) + ' ' + Beteiligte.Name + '\n';
          }
          else {

            Value += Beteiligte.Firma + '\n';
          }
        }
      }

      return Value;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkt Editor', 'GetZustaendigExternListe', this.Debug.Typen.Component);
    }

  }

  GetAnmerkungdatum(stempel: number, index: number): string{

    try {

      let Mitarbeiter: Mitarbeiterstruktur = lodash.find(this.Pool.Mitarbeiterliste, {Email: this.DB.CurrentProjektpunkt.Anmerkungenliste[index].Verfasser.Email});
      let Kuerzel: string = lodash.isUndefined(Mitarbeiter) ? '' : ' &bull; ' + Mitarbeiter.Kuerzel;

      return moment(stempel).format('DD.MM.YYYY') + '<br>' + 'KW' + moment(stempel).isoWeek() + Kuerzel;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkt Editor', 'GetAnmerkungdatum', this.Debug.Typen.Component);
    }


  }

  AnmerkungTextChangedHandler(event: any, i) {

    try {

      this.DB.CurrentProjektpunkt.Anmerkungenliste[i].Anmerkung =  event.detail.value;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, '', 'AnmerkungTextChangedHandler', this.Debug.Typen.Component);
    }
  }

  DeleteAnmerkungClicked(i) {

    try {

      let id = this.DB.CurrentProjektpunkt.Anmerkungenliste[i].AnmerkungID;

      this.DB.CurrentProjektpunkt.Anmerkungenliste = lodash.filter(this.DB.CurrentProjektpunkt.Anmerkungenliste, (eintrag: Projektpunktanmerkungstruktur) => {

        return eintrag.AnmerkungID !== id;
      });

      this.PrepareData();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkt Editor', 'DeleteAnmerkungClicked', this.Debug.Typen.Component);
    }
  }

  AddAnmerkungClicked() {

    try {

      let Anmekung: Projektpunktanmerkungstruktur = this.DB.GetNewAnmerkung();

      this.DB.CurrentProjektpunkt.Anmerkungenliste.push(Anmekung);

      this.PrepareData();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkt Editor', 'AddAnmerkungClicked', this.Debug.Typen.Component);
    }
  }

  public GetLinienanzahl(): number {

    try {

      return Math.max(

        this.DB.CurrentProjektpunkt.ZustaendigeExternIDListe.length,
        this.DB.CurrentProjektpunkt.ZustaendigeInternIDListe.length
      );


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkt Editor', 'GetLinienanzahl', this.Debug.Typen.Component);
    }
  }

  MeilensteinCheckChanged(event: { status: boolean; index: number; event: any }) {

    try {

      this.DB.CurrentProjektpunkt.Meilenstein = event.status;

      if(event.status === true) {

        this.DB.CurrentProjektpunkt.Meilensteinstatus = 'ON';
      }
      else {

        this.DB.CurrentProjektpunkt.Meilensteinstatus = 'OFF';
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkt Editor', 'MeilensteinCheckChanged', this.Debug.Typen.Component);
    }
  }

  ZeitansatzChangedHandler(event: { Titel: string; Text: string; Valid: boolean }) {

    try {

      let Wert: number;

      if(event.Text !== '') {

        Wert = parseInt(event.Text);

        if(isNaN(Wert) === false) {

          this.DB.CurrentProjektpunkt.Zeitansatz = Wert;
        }
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkt Editor', 'ZeitansatzChangedHandler', this.Debug.Typen.Component);
    }
  }

  DeleteButtonClicked() {

    try {

      if(this.DeleteEnabled) {

        this.DB.DeleteProjektpunkt(this.DB.CurrentProjektpunkt).then(() => {

          this.OkClickedEvent.emit();

        }).catch((herror: HttpErrorResponse) => {

          this.Debug.ShowErrorMessage(herror, 'Projektpunkt Editor', 'DeleteButtonClicked', this.Debug.Typen.Component);
        });
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkt Editor', 'DeleteButtonClicked', this.Debug.Typen.Component);
    }
  }

  GetTerminWert(): string {

    try {

      if(this.DB.CurrentProjektpunkt.EndeKalenderwoche === null) {

        return moment(this.DB.CurrentProjektpunkt.Endezeitstempel).format('DD.MM.YYYY');
      }
      else {

        return this.DB.CurrentProjektpunkt.EndeKalenderwoche.toString();
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projektpunkt Editor', 'GetTerminWert', this.Debug.Typen.Component);
    }

  }
}

