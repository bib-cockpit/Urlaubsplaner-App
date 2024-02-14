import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {BasicsProvider} from "../../services/basics/basics";
import {DebugProvider} from "../../services/debug/debug";
import {ToolsProvider} from "../../services/tools/tools";
import {DisplayService} from "../../services/diplay/display.service";
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
import {ConstProvider} from "../../services/const/const";
import {Projektestruktur} from "../../dataclasses/projektestruktur";
import {DatabaseSimontabelleService} from "../../services/database-simontabelle/database-simontabelle.service";
import {Simontabellestruktur} from "../../dataclasses/simontabellestruktur";
import {Subscription} from "rxjs";
import {Simontabelleeintragstruktur} from "../../dataclasses/simontabelleeintragstruktur";
import {Simontabellebesondereleistungstruktur} from "../../dataclasses/simontabellebesondereleistungstruktur";
import { Rechnungstruktur } from 'src/app/dataclasses/rechnungstruktur';
import moment from "moment";
import {Rechnungseintragstruktur} from "../../dataclasses/rechnungseintragstruktur";
import {DatabaseMitarbeiterService} from "../../services/database-mitarbeiter/database-mitarbeiter.service";

@Component({
  selector: 'pj-simontabelle-editor',
  templateUrl: './pj-simontabelle-editor.component.html',
  styleUrls: ['./pj-simontabelle-editor.component.scss'],
})
export class PjSimontabelleEditorComponent implements OnInit, OnDestroy, AfterViewInit {

  @Output() CancelClickedEvent         = new EventEmitter<any>();
  @Output() OkClickedEvent             = new EventEmitter<any>();
  @Output() DeleteClickedEvent         = new EventEmitter<any>();
  @Output() AnlagengruppeClickedEvent  = new EventEmitter<any>();
  @Output() LeistungsphaseClickedEvent = new EventEmitter<any>();
  @Output() AddLeistungClickedEvent    = new EventEmitter<any>();
  @Output() DeleteTabelleClickedEvent  = new EventEmitter<any>();
  @Output() MitarbeiterClickedEvent    = new EventEmitter<any>();
  @Output() EditLeistungClickedEvent   = new EventEmitter<Simontabellebesondereleistungstruktur>();


  @Input() Titel: string;
  @Input() Iconname: string;
  @Input() Dialogbreite: number;
  @Input() PositionY: number;
  @Input() ZIndex: number;
  @Input() Projekt: Projektestruktur;

  public Bereiche = {

    Tabelle:    'Tabelle',
    Leistungen: 'Leistungen',
    Rechnungen: 'Rechnungen',
    Rechnungsempfaenger: 'Rechnungsempfaenger'
  };

  public Valid: boolean;
  public DeleteEnabled: boolean;
  public CanDelete: boolean;
  private TabelleSubcsription: Subscription;
  public VertragValid: boolean[];
  public Bruttonkosten: number;
  public Bruttohonorar: number;
  public Vertragsprozente: number;
  public Bereich: string;
  public HonorarValid: boolean;
  public Rechnungslistebreite: number;
  public DisplayRechnungsliste: boolean[];
  public Rechnungsbreite: number;
  public DeleteTabelleEnabled: boolean;

  constructor(public Basics: BasicsProvider,
              public Debug: DebugProvider,
              public Tools: ToolsProvider,
              public DB: DatabaseSimontabelleService,
              public Displayservice: DisplayService,
              public DBMitarbeiter: DatabaseMitarbeiterService,
              public Pool: DatabasePoolService,
              public Const: ConstProvider) {
    try {

      this.Valid             = true;
      this.DeleteEnabled     = false;
      this.Titel             = this.Const.NONE;
      this.Iconname          = 'newspaper-outline';
      this.Dialogbreite      = 400;
      this.PositionY         = 100;
      this.ZIndex            = 3000;
      this.CanDelete         = false;
      this.Projekt           = null;
      this.TabelleSubcsription = null;
      this.VertragValid        = [];
      this.Bruttonkosten       = 0;
      this.Bruttohonorar       = 0;
      this.Vertragsprozente    = 0;
      this.HonorarValid        = false;
      this.Bereich               = this.Bereiche.Tabelle;
      this.Rechnungslistebreite  = 0;
      this.Rechnungsbreite       = 270;
      this.DisplayRechnungsliste = [];
      this.DeleteTabelleEnabled  = false;


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Simontabelle Editor', 'constructor', this.Debug.Typen.Component);
    }
  }

  private SetupValidation() {

    try {

      /*

      this.JoiShema = Joi.object({

        Firma: Joi.string().required().max(100),

      }).options({ stripUnknown: true });

       */

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Simontabelle Editor', 'SetupValidation', this.Debug.Typen.Component);
    }
  }

  ngOnInit() {

    try {

      this.Displayservice.AddDialog(this.Displayservice.Dialognamen.Simontabelleeditor, this.ZIndex);

      this.TabelleSubcsription = this.Pool.SimontabelleChanged.subscribe(() => {

        this.ValidateInput();
      });

      this.SetupValidation();
      this.ValidateInput();
      this.PrepareData();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Simontabelle Editor', 'OnInit', this.Debug.Typen.Component);
    }
  }

  ngOnDestroy(): void {

    try {

      this.Displayservice.RemoveDialog(this.Displayservice.Dialognamen.Simontabelleeditor);

      this.TabelleSubcsription.unsubscribe();
      this.TabelleSubcsription = null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Simontabelle Editor', 'OnDestroy', this.Debug.Typen.Component);
    }
  }


  private async PrepareData() {

    try {

      let Steuerfaktor   = 1 + this.DB.Steuersatz / 100;
      let Rechnung: Rechnungstruktur;

      this.Titel         = this.DB.CurrentSimontabelle._id === null ? 'Simontabelle erstellen' : 'Simontabelle bearbeiten';
      this.CanDelete     = false;
      this.VertragValid  = [];
      this.Bruttonkosten = this.DB.CurrentSimontabelle.Kosten * Steuerfaktor;
      this.Bruttohonorar = this.DB.CurrentSimontabelle.Honorar * Steuerfaktor;

      this.DB.CurrentRechnungsindex = this.DB.CurrentSimontabelle.Rechnungen.length - 1;

      if(this.DB.CurrentRechnungsindex >= 0) this.DB.CurrentRechnung = this.DB.CurrentSimontabelle.Rechnungen[this.DB.CurrentRechnungsindex];

      this.Rechnungslistebreite  = 1044;
      this.DisplayRechnungsliste = [];

      for(let i = 0; i < this.DB.CurrentSimontabelle.Rechnungen.length; i++) {

        Rechnung = this.DB.CurrentSimontabelle.Rechnungen[i];

        Rechnung.CanDelete = false;

        if(i >= this.DB.CurrentSimontabelle.Rechnungen.length - 2) {

          this.Rechnungslistebreite    += this.Rechnungsbreite;
          this.DisplayRechnungsliste[i] = true;
        }
        else this.DisplayRechnungsliste[i] = false;
      }

      for(let Tabelleneintrag of this.DB.CurrentSimontabelle.Eintraegeliste) {

        Tabelleneintrag.Honorarsummeprozent = 0;
        Tabelleneintrag.Honorarsumme        = 0;
        Tabelleneintrag.Nettohonorar        = 0;
        Tabelleneintrag.Nettonebenkosten    = 0;
        Tabelleneintrag.Nettogesamthonorar  = 0;
        Tabelleneintrag.Mehrwertsteuer      = 0;
        Tabelleneintrag.Bruttogesamthonorar = 0;

        this.VertragValid.push(this.CheckVertragswert(Tabelleneintrag.Vertrag, Tabelleneintrag));

        for(let Rechnungseintrag of Tabelleneintrag.Rechnungseintraege) {

          this.DB.CheckRechnungswert(Rechnungseintrag);

          this.DB.CalculateRechnungseintrag(Tabelleneintrag, Rechnungseintrag);
        }
      }

      this.DB.CalculateRechnungssummen();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Simontabelle Editor', 'PrepareData', this.Debug.Typen.Component);
    }
  }


  ngAfterViewInit(): void {

    try {

      window.setTimeout( () => {

        this.ValidateInput();

      }, 30);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Simontabelle Editor', 'AfterViewInit', this.Debug.Typen.Component);
    }
  }

  ValidateInput() {

    try {

      /*
      let Result = this.JoiShema.validate(this.DB.CurrentSimontabelle);

      if(Result.error) this.Valid = false;
      else             this.Valid = true;

       */

      this.Valid = true;

      if(this.DB.CurrentSimontabelle.Anlagengruppe === null) this.Valid = false;
      if(this.DB.CurrentSimontabelle.Leistungsphase === null) this.Valid = false;


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Simontabelle Editor', 'ValidateInput', this.Debug.Typen.Component);
    }
  }

  private ResetEditor() {

    try {

      this.DeleteEnabled = false;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Simontabelle Editor', 'ResetEditor', this.Debug.Typen.Component);
    }
  }

  CancelButtonClicked() {


    try {

      this.ResetEditor();

      this.CancelClickedEvent.emit();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Simontabelle Editor', 'CancelButtonClicked', this.Debug.Typen.Component);
    }
  }

  async OkButtonClicked() {

    try {

      let Simontabelle: Simontabellestruktur;

      if(this.DB.CurrentSimontabelle._id === null) {

        Simontabelle = await this.DB.AddSimontabelle(this.DB.CurrentSimontabelle);
      }
      else {

        Simontabelle = await this.DB.UpdateSimontabelle(this.DB.CurrentSimontabelle);
      }

      this.DB.CurrentSimontabelle = this.DB.InitSimontabelledata(Simontabelle);

      this.DB.UpdateSimontabellenliste(this.DB.CurrentSimontabelle);

      this.Pool.SimontabellenlisteChanged.emit();
      this.OkClickedEvent.emit();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Simontabelle Editor', 'OkButtonClicked', this.Debug.Typen.Component);
    }
  }

  ContentClicked(event: MouseEvent) {

    try {

      event.preventDefault();
      event.stopPropagation();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Simontabelle Editor', 'ContentClicked', this.Debug.Typen.Component);
    }
  }


  TextChanged(event: { Titel: string; Text: string; Valid: boolean }) {

    try {

      this.ValidateInput();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Simontabelle Editor', 'TextChanged', this.Debug.Typen.Component);
    }
  }

  CanDeleteCheckedChanged(event: {status: boolean; index: number; event: any}) {

    try {

      this.CanDelete = event.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Simontabelle Editor', 'CanDeleteCheckedChanged', this.Debug.Typen.Component);
    }
  }

  DeleteButtonClicked() {

    try {

      /*
      if(this.CanDelete && this.Projekt !== null) {

        this.Projekt.Firmenliste = lodash.filter(this.Projekt.Firmenliste, (eintrag: Projektfirmenstruktur) => {

          return eintrag.FirmenID !== this.DBFirma.CurrentFirma.FirmenID;
        });

        this.DBFirma.FirmenlisteChanged.emit();

      }

       */


      this.DeleteClickedEvent.emit();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Simontabelle Editor', 'DeleteButtonClicked', this.Debug.Typen.Component);
    }
  }

  GetAnlagengruppennamen(CurrentSimontabelle: Simontabellestruktur): string {

    try {

      let Anlagengruppe: any;

      if(this.DB.CurrentSimontabelle !== null && this.DB.CurrentSimontabelle.Anlagengruppe !== null) {

        Anlagengruppe = this.Const.Anlagengruppen['Anlagengruppe_' + CurrentSimontabelle.Anlagengruppe.toString()];

        return Anlagengruppe.Name;

      }
      else return 'unbekannt';

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Simontabelle Editor', 'GetAnlagengruppennamen', this.Debug.Typen.Component);
    }
  }

  CheckZahlenwert(Wert: any): number {

    try {

      let Valid: boolean = !isNaN(parseFloat(Wert)) && isFinite(Wert);

      if(Valid === true) {

        Wert = parseFloat(Wert);

        return Wert;
      }
      else return null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Simontabelle Editor', 'CheckZahlenwert', this.Debug.Typen.Component);
    }
  }

  CheckVertragswert(Wert: any, Eintrag: Simontabelleeintragstruktur): boolean {


    try {

      let Valid: boolean;

      if(Eintrag.Von !== 0 && Eintrag.Bis !== 0) {

        Valid = !isNaN(parseFloat(Wert)) && isFinite(Wert);

        if(Valid === true) {

          Wert = parseFloat(Wert);

          if (Wert < Eintrag.Von || Wert > Eintrag.Bis) Valid = false;
        }
      }
      else {

        Valid = true;
      }

      return Valid;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Simontabelle Editor', 'CheckVertragswert', this.Debug.Typen.Component);
    }
  }

  GetVertragswert(Eintrag: Simontabelleeintragstruktur): number {

    try {

      let Valid: boolean;
      let Wert: number;

      Valid = !isNaN(parseFloat(Eintrag.Vertrag.toString())) && isFinite(Eintrag.Vertrag);

      if(Valid === true) {

        Wert = parseFloat(Eintrag.Vertrag.toString());

        Eintrag.Vertrag = Wert;
      }
      else Wert = 0;

      return Wert;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Simontabelle Editor', 'GetVertragswert', this.Debug.Typen.Component);
    }
  }

  VertragswertChanged(event: any, index: number) {

    try {

      let Wert: any = event.target.value;

      this.VertragValid[index] = this.CheckVertragswert(Wert, this.DB.CurrentSimontabelle.Eintraegeliste[index]);

      if(this.CheckVertragswert(Wert, this.DB.CurrentSimontabelle.Eintraegeliste[index])) this.DB.CurrentSimontabelle.Eintraegeliste[index].Vertrag = parseFloat(Wert);

      this.CalculateVertrag();

      console.log('Prüfung: ' + this.VertragValid[index]);

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Simontabelle Editor', 'VertragswertChanged', this.Debug.Typen.Component);
    }
  }

  CalculateVertrag(): number {

    try {

      let Valid: boolean = true;
      let Wert: number = 0;

      for(let Eintrag of this.DB.CurrentSimontabelle.Eintraegeliste) {

        if(!this.CheckVertragswert(Eintrag.Vertrag, Eintrag)) Valid = false;
      }

      if(Valid === true) {

        for(let Eintrag of this.DB.CurrentSimontabelle.Eintraegeliste) {

          Wert += parseFloat(Eintrag.Vertrag.toString());
        }

        this.Vertragsprozente = Wert;

        return Wert;
      }
      else {

        this.Vertragsprozente = 0;

        return 0;
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Simontabelle Editor', 'CalculateVertrag', this.Debug.Typen.Component);
    }
  }

  KostenTextChanged(event: {Titel: string; Text: string; Valid: boolean}) {

    try {

      let Steuerfaktor   = 1 + this.DB.Steuersatz / 100;
      let Wert = this.CheckZahlenwert(event.Text);

      if(Wert !== null) {

        this.DB.CurrentSimontabelle.Kosten = Wert;

        this.Bruttonkosten = this.DB.CurrentSimontabelle.Kosten * Steuerfaktor;
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Simontabelle Editor', 'KostenTextChanged', this.Debug.Typen.Component);
    }
  }

  HonorarTextChanged(event: {Titel: string; Text: string; Valid: boolean}) {

    try {

      let Steuerfaktor = 1 + this.DB.Steuersatz / 100;
      let Wert = this.CheckZahlenwert(event.Text);

      if(Wert !== null) {

        this.DB.CurrentSimontabelle.Honorar = Wert;

        this.Bruttohonorar = this.DB.CurrentSimontabelle.Honorar * Steuerfaktor;
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Simontabelle Editor', 'HonorarTextChanged', this.Debug.Typen.Component);
    }
  }

  UmbauzuschlagTextChanged(event: { Titel: string; Text: string; Valid: boolean }) {

    try {


      let Wert = this.CheckZahlenwert(event.Text);

      if(Wert !== null) {

        this.DB.CurrentSimontabelle.Umbauzuschlag = Wert;

        // this.Bruttohonorar = this.DB.CurrentSimontabelle.Honorar * Steuerfaktor;
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Simontabelle Editor', 'UmbauzuschlagTextChanged', this.Debug.Typen.Component);
    }
  }

  CalculateHonorarMitUmbauzuschlag(): number {

    try {

      let Umbaufaktor = 1 + this.DB.CurrentSimontabelle.Umbauzuschlag / 100;


      return this.DB.CurrentSimontabelle.Honorar * Umbaufaktor;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Simontabelle Editor', 'CalculateHonorarMitUmbauzuschlag', this.Debug.Typen.Component);
    }

  }



  CalculateGesamthonorar(): number {

    try {

      let Umbaufaktor = 1 + this.DB.CurrentSimontabelle.Umbauzuschlag / 100;
      let HonorarMitUmbau: number = this.DB.CurrentSimontabelle.Honorar * Umbaufaktor;
      let Besondereleistungen: number = 0;

      for(let Leistung of this.DB.CurrentSimontabelle.Besondereleistungenliste) {

        Besondereleistungen += Leistung.Honorar;
      }

      return HonorarMitUmbau + Besondereleistungen;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Simontabelle Editor', 'CalculateGesamthonorar', this.Debug.Typen.Component);
    }
  }

  NebenkostenTextChanged(event: { Titel: string; Text: string; Valid: boolean }) {

    try {


      let Wert = this.CheckZahlenwert(event.Text);

      if(Wert !== null) {

        this.DB.CurrentSimontabelle.Nebenkosten = Wert;
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Simontabelle Editor', 'NebenkostenTextChanged', this.Debug.Typen.Component);
    }
  }

  CalculateNebenkosten() {

    try {

      let Umbaufaktor = 1 + this.DB.CurrentSimontabelle.Umbauzuschlag / 100;
      let Nebenkostenfaktor = this.DB.CurrentSimontabelle.Nebenkosten / 100;
      let HonorarMitUmbau: number = this.DB.CurrentSimontabelle.Honorar * Umbaufaktor;
      let Besondereleistungen: number = 0;

      for(let Leistung of this.DB.CurrentSimontabelle.Besondereleistungenliste) {

        Besondereleistungen += Leistung.Honorar;
      }

      return (HonorarMitUmbau + Besondereleistungen) * Nebenkostenfaktor;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Simontabelle Editor', 'CalculateZwischensumme', this.Debug.Typen.Component);
    }
  }

  CalculateGesamthonorarNetto() {
    try {

      let Umbaufaktor = 1 + this.DB.CurrentSimontabelle.Umbauzuschlag / 100;
      let Nebenkostenfaktor = this.DB.CurrentSimontabelle.Nebenkosten / 100;
      let HonorarMitUmbau: number = this.DB.CurrentSimontabelle.Honorar * Umbaufaktor;
      let Nebenkosten: number;
      let Besondereleistungen: number = 0;

      for(let Leistung of this.DB.CurrentSimontabelle.Besondereleistungenliste) {

        Besondereleistungen += Leistung.Honorar;
      }

      Nebenkosten = (HonorarMitUmbau + Besondereleistungen) * Nebenkostenfaktor;

      return HonorarMitUmbau + Besondereleistungen + Nebenkosten;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Simontabelle Editor', 'CalculateGesamthonorarNetto', this.Debug.Typen.Component);
    }
  }

  CalculateMehrwertsteuer() {

    try {

      let Gesamthonorar: number = this.CalculateGesamthonorarNetto();
      let Steuerfaktor: number  = this.DB.Steuersatz / 100;

      return Gesamthonorar * Steuerfaktor;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Simontabelle Editor', 'CalculateMehrwertsteuer', this.Debug.Typen.Component);
    }
  }

  CalculateGesamthonorarBrutto() {

    try {

      let Nettohonorar: number = this.CalculateGesamthonorarNetto();
      let MwSt: number = this.CalculateMehrwertsteuer();

      return Nettohonorar + MwSt;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Simontabelle Editor', 'CalculateGesamthonorarBrutto', this.Debug.Typen.Component);
    }
  }

  TabelleMenuButtonClicked() {

    try {

      this.Bereich = this.Bereiche.Tabelle;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Simontabelle Editor', 'TabelleMenuButtonClicked', this.Debug.Typen.Component);
    }
  }

  LeistungenMenuButtonClicked() {

    try {

      this.Bereich = this.Bereiche.Leistungen;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Simontabelle Editor', 'LeistungenMenuButtonClicked', this.Debug.Typen.Component);
    }
  }

  AddLeistungClicked() {

    try {

      this.AddLeistungClickedEvent.emit();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Simontabelle Editor', 'AddLeistungClicked', this.Debug.Typen.Component);
    }

  }

  CalculateBesondereleistungen():number {

    try {

      let Wert: number = 0;

      for(let Leistung of this.DB.CurrentSimontabelle.Besondereleistungenliste) {

        Wert += Leistung.Honorar;
      }

      return Wert;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Simontabelle Editor', 'AddLeistungClicked', this.Debug.Typen.Component);
    }
  }


  RechnungMenuButtonClicked() {

    try {

      this.Bereich = this.Bereiche.Rechnungen;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Simontabelle Editor', 'RechnungMenuButtonClicked', this.Debug.Typen.Component);
    }
  }

  async AddRechnungClicked() {

    try {

      await this.DB.AddNewRechnung();

      this.DisplayRechnungsliste.push(true);

      this.Rechnungslistebreite  = 1044;

      for(let i = 0; i < this.DisplayRechnungsliste.length; i++) {

        if(this.DisplayRechnungsliste[i] === true) {

          this.Rechnungslistebreite += this.Rechnungsbreite;
        }
      }

      this.PrepareData();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Simontabelle Editor', 'AddRechnungClicked', this.Debug.Typen.Component);
    }
  }

  GetRechnungsdatum(Rechnung: Rechnungstruktur): string {

    try {

      return moment(Rechnung.Zeitstempel).format('DD.MM.YY');

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Simontabelle Editor', 'GetRechnungsdatum', this.Debug.Typen.Component);
    }
  }

  RechnungswertChanged(event: any, Tabelleneintrag: Simontabelleeintragstruktur, Rechnungseintrag: Rechnungseintragstruktur, i: number) {

    try {

      let Valid: boolean;
      let Wert: number;
      let Value: any = event.target.value;

      Valid = !isNaN(parseFloat(Value.toString())) && isFinite(Value);

      if(Valid === true) {

        Wert = parseFloat(Value.toString());

        Rechnungseintrag.Honoraranteil = Wert;

        this.DB.CheckRechnungswert(Rechnungseintrag);

        this.DB.CalculateRechnungseintrag(Tabelleneintrag, Rechnungseintrag);

        this.DB.CalculateRechnungssummen();
      }
      else {

        Rechnungseintrag.Valid = false;
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Simontabelle Editor', 'RechnungswertChanged', this.Debug.Typen.Component);
    }
  }

  /*
  RechnungsIndexChanged(event: any) {

    try {

      this.DB.CurrentRechnungsindex = event.detail.value;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Simontabelle Editor', 'RechnungsIndexChanged', this.Debug.Typen.Component);
    }
  }

   */



  CheckHonorarValid(Eintrag: Simontabelleeintragstruktur): string {

    try {

      if (Eintrag.Honorarsummeprozent <= this.GetVertragswert(Eintrag)) {

        return 'green';

      } else {


        return 'red';
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Simontabelle Editor', 'CheckHonorarValid', this.Debug.Typen.Component);
    }

  }

  DisplayRechnungCheckChanged(event: { status: boolean; index: number; event: any; value: string }, index: number) {

    try {

      this.DisplayRechnungsliste[index] = event.status;

      this.Rechnungslistebreite = 1044;

      for(let i = 0; i < this.DisplayRechnungsliste.length; i++) {

        if(this.DisplayRechnungsliste[i] === true) {

          this.Rechnungslistebreite += this.Rechnungsbreite;
        }
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Simontabelle Editor', 'DisplayRechnungCheckChanged', this.Debug.Typen.Component);
    }
  }

  RechnungBearbeitenClicked(Rechnung: Rechnungstruktur) {

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Simontabelle Editor', 'RechnungBearbeitenClicked', this.Debug.Typen.Component);
    }
  }

  public async RechnungLoeschenClicked(Rechnung: Rechnungstruktur) {

    try {

      await this.DB.DeleteRechnungen(Rechnung);

      debugger;

      this.PrepareData();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Simontabelle Editor', 'RechnungLoeschenClicked', this.Debug.Typen.Component);
    }
  }

  CanDeleteRechnungChanged(event: { status: boolean; index: number; event: any; value: string }, Rechnung: Rechnungstruktur) {

    try {

      Rechnung.CanDelete = event.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Simontabelle Editor', 'CanDeleteRechnungChanged', this.Debug.Typen.Component);
    }
  }

  SicherheitseinbehaltTextChanged(event: { Titel: string; Text: string; Valid: boolean }) {

    try {

      let Wert = this.CheckZahlenwert(event.Text);

      if(Wert !== null) {

        this.DB.CurrentSimontabelle.Sicherheitseinbehalt = Wert;
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Simontabelle Editor', 'SicherheitseinbehaltTextChanged', this.Debug.Typen.Component);
    }
  }

  CalculateRechnungsdifferenz(Tabelleneintrag: Simontabelleeintragstruktur, CurrentRechnungseintrag: Rechnungseintragstruktur, Rechnungsindex: number): number {

    try {

      let Differenz: number = 0;

      let LastRechnungseintrag = Tabelleneintrag.Rechnungseintraege[Rechnungsindex - 1];

      if(Rechnungsindex === 0) {

        Differenz = CurrentRechnungseintrag.Honoraranteil;
      }
      else {

        if(CurrentRechnungseintrag.Honoraranteil > 0) {

          Differenz = CurrentRechnungseintrag.Honoraranteil - LastRechnungseintrag.Honoraranteil;
        }
        else Differenz = 0;

      }

      return Differenz;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Simontabelle Editor', 'CalculateRechnungsdifferenz', this.Debug.Typen.Component);
    }
  }

  DeleteTabelleClicked() {

    try {

      this.DeleteTabelleClickedEvent.emit();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Simontabelle Editor', 'DeleteTabelleClicked', this.Debug.Typen.Component);
    }
  }

  DeleteTabelleCheckboxChanged(event: { status: boolean; index: number; event: any; value: string }) {

    try {

      this.DeleteTabelleEnabled = event.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Simontabelle Editor', 'DeleteTabelleCheckboxChanged', this.Debug.Typen.Component);
    }
  }

  RechnungsempfaengerMenuButtonClicked() {

    try {

      this.Bereich = this.Bereiche.Rechnungsempfaenger;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Simontabelle Editor', 'RechnungsempfaengerMenuButtonClicked', this.Debug.Typen.Component);
    }
  }

  MitarbeiterButtonClicked() {

    try {

      this.MitarbeiterClickedEvent.emit();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Simontabelle Editor', 'MitarbeiterButtonClicked', this.Debug.Typen.Component);
    }
  }
}
