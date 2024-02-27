import {EventEmitter, Injectable} from '@angular/core';
import {DebugProvider} from "../debug/debug";
import * as lodash from "lodash-es";
import {DatabasePoolService} from "../database-pool/database-pool.service";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import moment, {Moment} from "moment";
import {ConstProvider} from "../const/const";
import {Urlaubsstruktur} from "../../dataclasses/urlaubsstruktur";
import {Feiertagestruktur, FeiertagsubdevisionsStruktur} from "../../dataclasses/feiertagestruktur";
import {Ferienstruktur} from "../../dataclasses/ferienstruktur";
import {Regionenstruktur} from "../../dataclasses/regionenstruktur";
import {Standortestruktur} from "../../dataclasses/standortestruktur";
import {Urlauzeitspannenstruktur} from "../../dataclasses/urlauzeitspannenstruktur";
import {Kalendertagestruktur} from "../../dataclasses/kalendertagestruktur";
import {Mitarbeiterstruktur} from "../../dataclasses/mitarbeiterstruktur";
import {Urlaubprojektbeteiligtestruktur} from "../../dataclasses/urlaubprojektbeteiligtestruktur";
import {Graphservice} from "../graph/graph";
import {Outlookemailadressstruktur} from "../../dataclasses/outlookemailadressstruktur";
import {BasicsProvider} from "../basics/basics";
import {DatabaseMitarbeiterService} from "../database-mitarbeiter/database-mitarbeiter.service";

@Injectable({
  providedIn: 'root'
})
export class DatabaseUrlaubService {

  public PlanungsmonateChanged: EventEmitter<any> = new EventEmitter<any>();
  public ExterneUrlaubeChanged: EventEmitter<any> = new EventEmitter<any>();
  public UrlaubStatusChanged:   EventEmitter<any> = new EventEmitter<any>();

  public Bundeslandkuerzel: string;
  public Bundesland: string;
  public Regionenliste: Regionenstruktur[];
  public Jahr: number;
  public Feiertageliste: Feiertagestruktur[];
  public Ferienliste: Ferienstruktur[];
  public CurrentUrlaub: Urlaubsstruktur;
  public UrlaublisteExtern: Urlaubsstruktur[];
  public CurrentMonatindex: number;
  public LastMonatIndex: number;
  public FirstMonatIndex: number;
  public Laendercode: string;
  public ShowFeiertage_DE: boolean;
  public ShowFeiertage_BG: boolean;
  public ShowFerientage_DE: boolean;
  public ShowFerientage_BG: boolean;
  public Ferienfarbe_DE: string;
  public Ferienfarbe_BG: string;
  public Feiertagefarbe_DE: string;
  public Feiertagefarbe_BG: string;
  public CurrentZeitspanne: Urlauzeitspannenstruktur;
  public Monateliste: string[];
  private ServerReadfeiertageUrl: string;
  private ServerReadRegionenUrl: string;
  private ServerReadFerienUrl: string;
  public Vertretrungliste: Mitarbeiterstruktur[];
  public Freigabenliste: Mitarbeiterstruktur[];
  public Vertretungsanfragenanzahl: number;
  public Vertretungsantwortenanzahl: number;
  public Freigabenanfragenanzahl: number;
  public Freigabenantwortenanzahl: number;
  public Anfragenanzahl: number;
  public Antwortenanzahl: number;
  public CorrectSetup: boolean;
  public Officeemailadress: string;
  public CurrentMitarbeiter: Mitarbeiterstruktur;

  public Urlaubstatusvarianten = {

    Geplant:            'Geplant',
    Vertreterablehnung: 'Vertreterablehnung',
    Vertreteranfrage:   'Vertreteranfrage',
    Vertreterfreigabe:  'Vertreterfreigabe',
    Abgelehnt:          'Abgelehnt',
    Genehmigt:          'Genehmigt',
    Feiertag:           'Feiertag',
    Ferientag:          'Ferientag'
  };
  public Urlaubsfaben = {

    Geplant:            '#307ac1',
    Vertreterfreigabe:  'orange',
    Vertreteranfrage:   '#04B4AE',
    Vertreterablehnung: '#8A0886',
    Abgelehnt:          'red',
    Genehmigt:          'green',
    Ferien_DE:            '#999999',
    Ferien_BG:            '#999999',
    Feiertage_DE:         '#454545',
    Feiertage_BG:         '#454545',
    Wochenende:           '#34495E'
  };

  constructor(private Debug: DebugProvider,
              private Pool: DatabasePoolService,
              private Const: ConstProvider,
              private Graph: Graphservice,
              private DBMitarbeiter: DatabaseMitarbeiterService,
              private Basics: BasicsProvider,
              private http: HttpClient) {
    try {

      this.ServerReadfeiertageUrl  = this.Pool.CockpitdockerURL + '/readfeiertage';
      this.ServerReadFerienUrl     = this.Pool.CockpitdockerURL + '/readferien';
      this.ServerReadRegionenUrl   = this.Pool.CockpitdockerURL + '/readregionen';
      this.CurrentUrlaub           = null;
      this.Jahr                    = moment().year();
      this.Bundeslandkuerzel       = 'DE-BY';
      this.Bundesland              = '';
      this.Feiertageliste          = [];
      this.Ferienliste             = [];
      this.Freigabenliste          = [];
      this.CurrentMonatindex       = moment().month();
      this.FirstMonatIndex         = this.CurrentMonatindex - 1;
      this.LastMonatIndex          = this.CurrentMonatindex + 1;
      this.CurrentZeitspanne       = null;
      this.Laendercode             = 'DE';
      this.ShowFeiertage_DE        = false;
      this.ShowFeiertage_BG        = false;
      this.ShowFerientage_DE       = false;
      this.ShowFerientage_BG       = false;
      this.Ferienfarbe_DE          = this.Const.NONE;
      this.Feiertagefarbe_DE       = this.Const.NONE;
      this.UrlaublisteExtern       = [];
      this.Vertretrungliste        = [];
      this.Anfragenanzahl             = 0;
      this.Antwortenanzahl            = 0;
      this.Vertretungsanfragenanzahl  = 0;
      this.Vertretungsantwortenanzahl = 0;
      this.Freigabenanfragenanzahl    = 0;
      this.Freigabenantwortenanzahl   = 0;
      this.CurrentMitarbeiter      = null;
      this.CorrectSetup            = false;
      this.Officeemailadress       = 'office@b-a-e.eu';
      this.Monateliste             = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Urlaub', 'constructor', this.Debug.Typen.Service);
    }
  }

  public SetMitarbeiter(mitarbeiter: Mitarbeiterstruktur) {

    try {

      this.CurrentMitarbeiter = lodash.cloneDeep(mitarbeiter);

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'SetMitarbeiter', this.Debug.Typen.Service);
    }
  }

  public CheckSetup() {

    try {

      if(this.CurrentUrlaub !== null && this.CurrentMitarbeiter !== null) {

        this.CorrectSetup = this.CurrentUrlaub.FreigeberID !== null && this.CurrentUrlaub.Projektbeteiligteliste.length > 0;
      }
      else this.CorrectSetup = false;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'CheckSetup', this.Debug.Typen.Service);
    }
  }

  private GetFreigabenliste() {

    try {

      let Urlaub: Urlaubsstruktur;
      let CountAnfrage: boolean;
      let CountAntwort: boolean;


        this.Freigabenanfragenanzahl  = 0;
        this.Freigabenantwortenanzahl = 0;
        this.Freigabenliste           = [];

        if(this.CurrentMitarbeiter !== null) {

          for(let Mitarbeiter of this.Pool.Mitarbeiterliste) {

            if(Mitarbeiter._id !== this.CurrentMitarbeiter._id) {

              Urlaub = lodash.find(Mitarbeiter.Urlaubsliste, (urlaub: Urlaubsstruktur) => {

                return urlaub.Jahr === this.Jahr && urlaub.FreigeberID === this.CurrentMitarbeiter._id;
              });

              if(!lodash.isUndefined(Urlaub)) {

                CountAnfrage = false;
                CountAntwort = false;

                for (let Zeitspanne of Urlaub.Zeitspannen) {

                  Zeitspanne = this.InitZeitspanne(Zeitspanne);

                  if (this.CheckFreigabeanwortAge(Zeitspanne) === true &&
                     (Zeitspanne.Status === this.Urlaubstatusvarianten.Vertreterfreigabe ||
                      Zeitspanne.Status === this.Urlaubstatusvarianten.Abgelehnt ||
                      Zeitspanne.Status === this.Urlaubstatusvarianten.Genehmigt)) {

                    if(lodash.isUndefined(lodash.find(this.Freigabenliste, {_id: Mitarbeiter._id}))) {

                      this.Freigabenliste.push(Mitarbeiter);

                      if(Zeitspanne.Status === this.Urlaubstatusvarianten.Vertreterfreigabe) CountAnfrage = true; // nur offene Anfragen zaehlen
                      else {

                        CountAntwort = true;
                      }
                    }
                  }
                }

                if(CountAnfrage === true) {

                  this.Anfragenanzahl++;
                  this.Freigabenanfragenanzahl++;
                }

                if(CountAntwort === true) {

                  this.Antwortenanzahl++;
                  this.Freigabenantwortenanzahl++;
                }
              }
            }
          }
        }
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'GetFreigabenliste', this.Debug.Typen.Service);
    }
  }

  async ResetRequest(Mitarbeiter: Mitarbeiterstruktur, Urlaub: Urlaubsstruktur) {

    try {

      if(Urlaub !== null) {

        for(let Zeitspanne of Urlaub.Zeitspannen) {

          Zeitspanne.Status                       = this.Urlaubstatusvarianten.Geplant;
          Zeitspanne.VertreterantwortSended       = false;
          Zeitspanne.Vertretungmeldung            = '';
          Zeitspanne.Planungmeldung               = '';
          Zeitspanne.Vertretungantwortzeitstempel = null;
        }

        let Urlaubindex = lodash.findIndex(Mitarbeiter.Urlaubsliste, { Jahr: this.Jahr });

        Mitarbeiter.Urlaubsliste[Urlaubindex] = Urlaub;

        await this.DBMitarbeiter.UpdateMitarbeiterUrlaub(Mitarbeiter);
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'ResetRequest', this.Debug.Typen.Service);
    }
  }

  public CheckVertretungsanwortAge(Zeitspanne: Urlauzeitspannenstruktur): boolean {

    try {

      let Heute: Moment = moment().locale('de');
      let Datum: Moment;
      let Dauer: number;

      if(Zeitspanne.VertreterID === this.CurrentMitarbeiter._id && Zeitspanne.VertreterantwortSended === true &&
        (Zeitspanne.Status === this.Urlaubstatusvarianten.Vertreterfreigabe ||
         Zeitspanne.Status === this.Urlaubstatusvarianten.Vertreterablehnung)) {

        // Wenn Freigabe oder Ablehnung Alter der Antwort prüfen

        if(Zeitspanne.Vertretungantwortzeitstempel === null) {

          return false;
        }
        else {

          // Alter prüfen

          Datum = moment(Zeitspanne.Vertretungantwortzeitstempel).locale('de');
          Dauer = moment.duration(Heute.diff(Datum)).asMinutes();

          return Dauer <= 180;

        }
      }
      else return true;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'CheckVertretungsanwortAge', this.Debug.Typen.Service);
    }
  }

  public CheckFreigabeanwortAge(Zeitspanne: Urlauzeitspannenstruktur): boolean {

    try {

      let Heute: Moment = moment().locale('de');
      let Datum: Moment;
      let Dauer: number;

      if(Zeitspanne.FreigabeantwortSended === true &&
        (Zeitspanne.Status  === this.Urlaubstatusvarianten.Genehmigt ||
         Zeitspanne.Status  === this.Urlaubstatusvarianten.Abgelehnt)) {

        // Wenn Freigabe oder Ablehnung Alter der Antwort prüfen

        if(Zeitspanne.Freigabeantwortzeitstempel === null) {

          return false;
        }
        else {

          // Alter prüfen

          Datum = moment(Zeitspanne.Freigabeantwortzeitstempel).locale('de');
          Dauer = moment.duration(Heute.diff(Datum)).asMinutes();

          return Dauer <= 180;

        }
      }
      else return true;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'CheckFreigabeanwortAge', this.Debug.Typen.Service);
    }
  }

  public GetVertretungsanwortAge(Zeitspanne: Urlauzeitspannenstruktur): number {

    try {

      let Heute: Moment = moment().locale('de');
      let Datum: Moment;
      let Dauer: number;

      if((Zeitspanne.Status === this.Urlaubstatusvarianten.Vertreterfreigabe ||
        Zeitspanne.Status === this.Urlaubstatusvarianten.Vertreterablehnung) && Zeitspanne.VertreterantwortSended === true) {

        // Wenn Freigabe oder Ablehnung Alter der Antwort prüfen

        if(Zeitspanne.Vertretungantwortzeitstempel === null) {

          return 0;
        }
        else {

          // Alter prüfen

          Datum = moment(Zeitspanne.Vertretungantwortzeitstempel).locale('de');
          Dauer = moment.duration(Heute.diff(Datum)).asMinutes();

          return Dauer;

        }
      }
      else return 0;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'GetVertretungsanwortAge', this.Debug.Typen.Service);
    }
  }

  private GetVertretungenliste() {

    try {

      let Urlaub: Urlaubsstruktur;
      let Vertretung: Mitarbeiterstruktur;
      let CountAnfrage: boolean;
      let CountAntwort: boolean;

        this.Vertretrungliste           = [];
        this.Vertretungsantwortenanzahl = 0;
        this.Vertretungsanfragenanzahl  = 0;

        if(this.CurrentMitarbeiter !== null) {

          for(let Mitarbeiter of this.Pool.Mitarbeiterliste) {

            if(Mitarbeiter._id !== this.CurrentMitarbeiter._id) {

               Urlaub = lodash.find(Mitarbeiter.Urlaubsliste, {Jahr: this.Jahr});

               if(!lodash.isUndefined(Urlaub)) {

                 CountAnfrage = false;
                 CountAntwort = false;

                 for(let Zeitspanne of Urlaub.Zeitspannen) {

                   Zeitspanne = this.InitZeitspanne(Zeitspanne);

                   if(Zeitspanne.VertreterID === this.CurrentMitarbeiter._id  && this.CheckVertretungsanwortAge(Zeitspanne) === true &&
                      (Zeitspanne.Status === this.Urlaubstatusvarianten.Vertreteranfrage  ||
                       Zeitspanne.Status === this.Urlaubstatusvarianten.Vertreterfreigabe ||
                       Zeitspanne.Status === this.Urlaubstatusvarianten.Vertreterablehnung)) {

                     if(Zeitspanne.Status === this.Urlaubstatusvarianten.Vertreteranfrage) {

                       CountAnfrage = true;
                     }
                     else {

                       CountAntwort  = true;
                     }

                     Vertretung = lodash.find(this.Vertretrungliste, {_id: Mitarbeiter._id});

                     if(lodash.isUndefined(Vertretung)) {

                       this.Vertretrungliste.push(Mitarbeiter);
                     }
                   }
                 }

                 if(CountAnfrage === true) {

                   this.Vertretungsanfragenanzahl++;
                   this.Anfragenanzahl++;
                 }

                 if(CountAntwort === true) {

                   this.Vertretungsantwortenanzahl++;
                   this.Antwortenanzahl++;
                 }
               }
            }
          }
        }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'GetVertretungenliste', this.Debug.Typen.Service);
    }
  }

  public GetStatuscolor(status: string): string {

    try {

      let Color: string = 'none';

      switch (status) {

        case this.Urlaubstatusvarianten.Geplant:

          Color = this.Urlaubsfaben.Geplant;

          break;

        case this.Urlaubstatusvarianten.Vertreterfreigabe:

          Color = this.Urlaubsfaben.Vertreterfreigabe;

          break;

        case this.Urlaubstatusvarianten.Vertreterablehnung:

          Color = this.Urlaubsfaben.Vertreterablehnung;

          break;

        case this.Urlaubstatusvarianten.Vertreteranfrage:

          Color = this.Urlaubsfaben.Vertreteranfrage;

          break;

        case this.Urlaubstatusvarianten.Genehmigt:

          Color = this.Urlaubsfaben.Genehmigt;

          break;

        case this.Urlaubstatusvarianten.Abgelehnt:

          Color = this.Urlaubsfaben.Abgelehnt;

          break;

        default:

          Color = '#00FFFF';

          break;
      }


      return Color;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'GetStatuscolor', this.Debug.Typen.Page);
    }
  }

  public async UpdateVertreteranfragen() {

    try {

      let Gesamtanzahl: number = 1;
      let Vertretung: Mitarbeiterstruktur;
      let Heute: Moment = moment();
      let VertreterIDListe: string[] = [];
      let CurrentZeitspannen: Urlauzeitspannenstruktur[] = [];
      let UpdatedZeitspannen: Urlauzeitspannenstruktur[] = [];
      let Index;

      for(let Zeitspanne of this.CurrentUrlaub.Zeitspannen) {

        if(Zeitspanne.Status === this.Urlaubstatusvarianten.Geplant &&
          Zeitspanne.VertreterID !== null &&
          lodash.indexOf(VertreterIDListe, Zeitspanne.VertreterID) === -1) {

          Gesamtanzahl++;
          VertreterIDListe.push(Zeitspanne.VertreterID);
        }
      }

      // debugger;

      for(let VertreterID of VertreterIDListe) {

        CurrentZeitspannen = [];
        Vertretung         = lodash.find(this.Pool.Mitarbeiterliste, {_id: VertreterID});

        if(!lodash.isUndefined(Vertretung)) {

          for(let Zeitspanne of this.CurrentUrlaub.Zeitspannen) {

            if(Zeitspanne.Status === this.Urlaubstatusvarianten.Geplant && Zeitspanne.VertreterID === VertreterID) {

              CurrentZeitspannen.push(Zeitspanne);

              Zeitspanne.Status         = this.Urlaubstatusvarianten.Vertreteranfrage;
              Zeitspanne.Planungmeldung = Heute.format('DD.MM.YYYY') + ' Vertretungsanfrage wurde an ' + Vertretung.Vorname + ' ' + Vertretung.Name + ' gesendet.';
            }
          }

          CurrentZeitspannen = await this.SendVertreteranfragen(this.CurrentMitarbeiter, Vertretung, CurrentZeitspannen);
          UpdatedZeitspannen = UpdatedZeitspannen.concat(CurrentZeitspannen);
        }
      }

      for(let Zeitspanne of UpdatedZeitspannen) {

        Index = lodash.findIndex(this.CurrentUrlaub.Zeitspannen, {ZeitspannenID: Zeitspanne.ZeitspannenID});

        this.CurrentUrlaub.Zeitspannen[Index] = Zeitspanne;
      }

      let Urlaubindex = lodash.findIndex(this.CurrentMitarbeiter.Urlaubsliste, { Jahr: this.Jahr });

      this.CurrentMitarbeiter.Urlaubsliste[Urlaubindex] = this.CurrentUrlaub;

      await this.DBMitarbeiter.UpdateMitarbeiterUrlaub(this.CurrentMitarbeiter);

      this.UrlaubStatusChanged.emit();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'UpdateVertreteranfragen', this.Debug.Typen.Service);
    }
  }

  async UpdateVertreterantworten(Mitarbeiter: Mitarbeiterstruktur, Urlaub: Urlaubsstruktur) {

    try {

      let Gesamtanzahl: number = 1;
      let Heute: Moment = moment().locale('de');
      let Freigebender: Mitarbeiterstruktur;
      let Stellvertreter: Mitarbeiterstruktur;

      for(let Zeitspanne of Urlaub.Zeitspannen) {

        if(Zeitspanne.Status === this.Urlaubstatusvarianten.Vertreterablehnung && Zeitspanne.VertreterantwortSended === false)  Gesamtanzahl += 1;
        if(Zeitspanne.Status === this.Urlaubstatusvarianten.Vertreterfreigabe  && Zeitspanne.VertreterantwortSended === false)  Gesamtanzahl += 2;
      }

      Freigebender   = lodash.find(this.Pool.Mitarbeiterliste, {_id: Urlaub.FreigeberID});
      Stellvertreter = this.CurrentMitarbeiter;

      for(let Zeitspanne of Urlaub.Zeitspannen) {

        if(Zeitspanne.Status !== this.Urlaubstatusvarianten.Vertreteranfrage && Zeitspanne.VertreterantwortSended === false) {

          if(Zeitspanne.Status === this.Urlaubstatusvarianten.Vertreterfreigabe) {

            Zeitspanne.Vertretungmeldung  = Heute.format('DD.MM.YYYY') + ' Vertretungszusage wurde an ' + Mitarbeiter.Vorname + ' ' + Mitarbeiter.Name + ' gesendet.';
            Zeitspanne.Vertretungmeldung += '<br>' + Heute.format('DD.MM.YYYY') + ' Urlaubsfreigabe Anfrage wurde an ' + Freigebender.Vorname + ' ' + Freigebender.Name + ' gesendet.';
            Zeitspanne.Planungmeldung     = Heute.format('DD.MM.YYYY') + ' ' + Stellvertreter.Vorname + ' ' + Stellvertreter.Name + ' hat der Urlausvertretung zugestimmt.';
            Zeitspanne.Planungmeldung    += '<br>' + Heute.format('DD.MM.YYYY') + ' Genehmigungsanfrage wurde an ' + Freigebender.Vorname + ' ' + Freigebender.Name + ' gesendet.';
          }

          if(Zeitspanne.Status === this.Urlaubstatusvarianten.Vertreterablehnung) {

            Zeitspanne.Planungmeldung     = Heute.format('DD.MM.YYYY') + ' ' + Stellvertreter.Vorname + ' ' + Stellvertreter.Name + ' hat die Vertretung abgelehnt';
            Zeitspanne.Vertretungmeldung  = Heute.format('DD.MM.YYYY') + ' Vertretungsabsage wurde an ' + Mitarbeiter.Vorname + ' ' + Mitarbeiter.Name + ' gesendet.';
          }
        }
      }

      Urlaub = await this.SendVertreterzusage(Mitarbeiter, Stellvertreter, Freigebender, Urlaub);
      Urlaub = await this.SendVertreterabsage(Mitarbeiter, Stellvertreter, Freigebender, Urlaub);
      Urlaub = await this.SendFreigabeanfrage(Mitarbeiter, Freigebender, Urlaub);

      let Urlaubindex = lodash.findIndex(Mitarbeiter.Urlaubsliste, { Jahr: this.Jahr });

      Mitarbeiter.Urlaubsliste[Urlaubindex] = Urlaub;

      await this.DBMitarbeiter.UpdateMitarbeiterUrlaub(Mitarbeiter);

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'UpdateVertreterantworten', this.Debug.Typen.Service);
    }
  }

  private SendVertreteranfragen(Mitarbeiter: Mitarbeiterstruktur, Vertretung: Mitarbeiterstruktur, Zeitspannen: Urlauzeitspannenstruktur[]): Promise<Urlauzeitspannenstruktur[]> {

    try {

      let Betreff: string = 'Urlaubsvertretungsanfrage von ' + Mitarbeiter.Vorname + ' ' + Mitarbeiter.Name;
      let Nachricht: string;
      let Empfaenger: Outlookemailadressstruktur[] = [];
      let SendMail: boolean = false;
      let Heute: Moment = moment().locale('de');

      return new Promise((resolve, reject) => {

        Nachricht  = "Hallo " + Vertretung.Vorname + ",<br><br>bitte prüfen, ob du für folgende Zeiträume:<br><br>";
        Nachricht += '<table border="1">';
        Nachricht += '<tr>';
        Nachricht += '<td style="width: 100px; text-align: center"><b>Von</b></td><td style="width: 100px; text-align: center"><b>Bis</b></td>';

        for(let Zeitspanne of Zeitspannen) {

          if(Zeitspanne.Status === this.Urlaubstatusvarianten.Vertreteranfrage &&
             Zeitspanne.VertreterID === Vertretung._id &&
             Zeitspanne.VertreteranfrageSended === false) {

            SendMail = true;
            Zeitspanne.Vertretunganfragezeitstempel = Heute.valueOf();
            Zeitspanne.VertreteranfrageSended       = true;

            Nachricht += '<tr>';
            Nachricht += '<td style="text-align: center">' + Zeitspanne.Startstring + '</td>';
            Nachricht += '<td style="text-align: center">' + Zeitspanne.Endestring  + '</td>';
            Nachricht += '</tr>';
          }
        }

        Nachricht += '</table>';

        Nachricht += '<br>Die Urlaubsvertretung für mich übernehmen kannst.<br><br>';
        Nachricht += '<br><br>';
        Nachricht += '<a href="' + this.Basics.WebAppUrl + '">Urlaubsplanung jetzt öffnen</a>';
        Nachricht += '<br><br>' + this.Pool.GetFilledSignatur(Mitarbeiter, true);

        Empfaenger.push({

          emailAddress: {

            address: Vertretung.Email,
            name: Vertretung.Vorname + ' ' + Vertretung.Name
          }
        });

        if(SendMail) {

          this.Graph.SendMail(Empfaenger, Betreff, Nachricht).then(() => {

            console.log('Vertretungsanfrage wurde an ' + Vertretung.Vorname + ' ' + Vertretung.Name + ' gesendet.');

            resolve(Zeitspannen);

          }).catch((error: any) => {

            // debugger;

            reject(error);
          });
        } else {

          console.log('Es wurde keine Vertretungsanfrage gesendet.');

          resolve(Zeitspannen);
        }
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'SendVertreteranfragen', this.Debug.Typen.Service);
    }
  }

  public SendVertreterzusage(Mitarbeiter: Mitarbeiterstruktur, Vertretung: Mitarbeiterstruktur, Freigeber: Mitarbeiterstruktur, Urlaub: Urlaubsstruktur): Promise<Urlaubsstruktur> {

    try {

      let Betreff: string = 'Vertretungszusage von ' + Vertretung.Vorname + ' ' + Vertretung.Name;
      let Nachricht: string;
      let Empfaenger: Outlookemailadressstruktur[] = [];
      let SendAntwort: boolean = false;
      let Heute: Moment = moment().locale('de');

      return new Promise((resolve, reject) => {

        Nachricht  = "Hallo " + Mitarbeiter.Vorname + ",<br><br>nachfolgende Urlaubsvertretungen kann ich gerne wahrnehmen:<br><br>";
        Nachricht += '<table border="1">';
        Nachricht += '<tr>';
        Nachricht += '<td style="width: 100px; text-align: center"><b>Von</b></td><td style="width: 100px; text-align: center"><b>Bis</b></td><td><b>Vertretung</b></td>';
        Nachricht += '</tr>';

        for(let Zeitspanne of Urlaub.Zeitspannen) {

          if(Zeitspanne.Status === this.Urlaubstatusvarianten.Vertreterfreigabe &&
             Zeitspanne.VertreterID === Vertretung._id &&
            Zeitspanne.VertreterantwortSended === false) {

            SendAntwort = true;

            Zeitspanne.VertreterantwortSended       = true;
            Zeitspanne.Vertretungantwortzeitstempel = Heute.valueOf();

            Nachricht += '<tr>';
            Nachricht += '<td style="text-align: center">' + Zeitspanne.Startstring + '</td>';
            Nachricht += '<td style="text-align: center">' + Zeitspanne.Endestring  + '</td>';
            Nachricht += '<td style="color: green;">Zusage</td>';
            Nachricht += '</tr>';
          }
        }

        Nachricht += '</table>';
        Nachricht += '<br><br>';
        Nachricht += 'Deine Urlaubsanfrage wurde zur Freigabe an ' + Freigeber.Vorname + ' ' + Freigeber.Name + ' weitergeleitet.';
        Nachricht += '<br><br>';
        Nachricht += '<a href="' + this.Basics.WebAppUrl + '">Urlaubsplanung jetzt öffnen</a>';
        Nachricht += '<br><br>' + this.Pool.GetFilledSignatur(Vertretung,true);

        Empfaenger.push({

          emailAddress: {

            address: Mitarbeiter.Email,
            name: Mitarbeiter.Vorname + ' ' + Mitarbeiter.Name
          }
        });

        if(SendAntwort === true) {

          this.Graph.SendMail(Empfaenger, Betreff, Nachricht).then(() => {

            console.log('Vertretungszusage wurde an ' + Mitarbeiter.Vorname + ' ' + Mitarbeiter.Name + ' gesendet.');

            resolve(Urlaub);

          }).catch((error: any) => {

            // debugger;

            reject(error);
          });
        }
        else {

          console.log('Es wurde keine Vertretungszusage gesendet.');

          resolve(Urlaub);
        }
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'SendVertreterzusage', this.Debug.Typen.Service);
    }
  }

  async UpdateFreigabenantworten(Mitarbeiter: Mitarbeiterstruktur, Urlaub: Urlaubsstruktur) {

    try {

      let Gesamtanzahl: number = 1;
      let Heute: Moment = moment().locale('de');
      let Freigebender: Mitarbeiterstruktur;
      let Vertretung: Mitarbeiterstruktur;


      for(let Zeitspanne of Urlaub.Zeitspannen) {

        if(Zeitspanne.Status === this.Urlaubstatusvarianten.Genehmigt && Zeitspanne.FreigabeantwortSended === false)  Gesamtanzahl += 1;
        if(Zeitspanne.Status === this.Urlaubstatusvarianten.Abgelehnt && Zeitspanne.FreigabeantwortSended === false)  Gesamtanzahl += 2;
      }

      for(let Zeitspanne of Urlaub.Zeitspannen) {

        if(Zeitspanne.Status === this.Urlaubstatusvarianten.Genehmigt || Zeitspanne.Status === this.Urlaubstatusvarianten.Abgelehnt) {

          Freigebender = lodash.find(this.Pool.Mitarbeiterliste, { _id: Urlaub.FreigeberID });
          Vertretung   = lodash.find(this.Pool.Mitarbeiterliste, { _id: Zeitspanne.VertreterID });

          if(Zeitspanne.Status === this.Urlaubstatusvarianten.Genehmigt) {

            Zeitspanne.Planungmeldung   = Heute.format('DD.MM.YYYY') + ' Der Urlaub wurde durch ' + Freigebender.Vorname + ' ' + Freigebender.Name + ' genehmigt.';
            Zeitspanne.Freigabemeldung  = Heute.format('DD.MM.YYYY') + ' Urlaubsfreigabe wurde an ' + Mitarbeiter.Vorname + ' ' + Mitarbeiter.Name + ' gesendet.';
            Zeitspanne.Freigabemeldung += '<br>' + Heute.format('DD.MM.YYYY') + ' Urlaubsfreigabe wurde an das Office gesendet.';
          }

          if(Zeitspanne.Status === this.Urlaubstatusvarianten.Abgelehnt) {


            Zeitspanne.Planungmeldung  = Heute.format('DD.MM.YYYY') + ' Der Urlaub wurde durch ' + Freigebender.Vorname + ' ' + Freigebender.Name + ' abgelehnt.';
            Zeitspanne.Freigabemeldung = Heute.format('DD.MM.YYYY') + ' Urlaubsablehnung wurde an ' + Mitarbeiter.Vorname + ' ' + Mitarbeiter.Name + ' gesendet.';
          }
        }
      }

      Urlaub = await this.SendMitarbeiterFreigabeablehnung(Mitarbeiter, Freigebender, Urlaub);
      Urlaub = await this.SendMitarbeiterFreigabezusage(Mitarbeiter, Freigebender, Urlaub);
      Urlaub = await this.SendOfficeFreigabezusage(Mitarbeiter, Freigebender, Urlaub);

      let Urlaubindex = lodash.findIndex(Mitarbeiter.Urlaubsliste, { Jahr: this.Jahr });

      Mitarbeiter.Urlaubsliste[Urlaubindex] = Urlaub;

      this.CurrentUrlaub = Urlaub;

      await this.DBMitarbeiter.UpdateMitarbeiterUrlaub(Mitarbeiter);

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'UpdateFreigabenantworten', this.Debug.Typen.Service);
    }
  }

  public SendVertreterabsage(Mitarbeiter: Mitarbeiterstruktur, Vertretung: Mitarbeiterstruktur, Freigeber: Mitarbeiterstruktur, Urlaub: Urlaubsstruktur): Promise<Urlaubsstruktur> {

    try {

      let Betreff: string = 'Vertretungsabsage von ' + Vertretung.Vorname + ' ' + Vertretung.Name;
      let Nachricht: string;
      let Empfaenger: Outlookemailadressstruktur[] = [];
      let SendAntwort: boolean = false;
      let Heute: Moment = moment().locale('de');

      return new Promise((resolve, reject) => {

        Nachricht  = "Hallo " + Mitarbeiter.Vorname + ",<br><br>nachfolgende Urlaubsvertretungen kann ich nicht wahrnehmen:<br><br>";
        Nachricht += '<table border="1">';
        Nachricht += '<tr>';
        Nachricht += '<td style="width: 100px; text-align: center"><b>Von</b></td><td style="width: 100px; text-align: center"><b>Bis</b></td><td><b>Vertretung</b></td>';
        Nachricht += '</tr>';

        for(let Zeitspanne of Urlaub.Zeitspannen) {

          if(Zeitspanne.Status === this.Urlaubstatusvarianten.Vertreterablehnung &&
             Zeitspanne.VertreterID === Vertretung._id &&
             Zeitspanne.VertreterantwortSended === false) {

            SendAntwort = true;

            Zeitspanne.VertreterantwortSended       = true;
            Zeitspanne.Vertretungantwortzeitstempel = Heute.valueOf();

            Nachricht += '<tr>';
            Nachricht += '<td style="text-align: center">' + Zeitspanne.Startstring + '</td>';
            Nachricht += '<td style="text-align: center">' + Zeitspanne.Endestring  + '</td>';
            Nachricht += '<td style="color: red;">Abgelehnt</td>';
            Nachricht += '</tr>';
          }
        }

        Nachricht += '</table>';
        Nachricht += '<br><br>';
        Nachricht += '<a href="' + this.Basics.WebAppUrl + '">Urlaubsplanung jetzt öffnen</a>';
        Nachricht += '<br><br>' + this.Pool.GetFilledSignatur(Vertretung,true);

        Empfaenger.push({

          emailAddress: {

            address: Mitarbeiter.Email,
            name: Mitarbeiter.Vorname + ' ' + Mitarbeiter.Name
          }
        });

        if(SendAntwort === true) {

          this.Graph.SendMail(Empfaenger, Betreff, Nachricht).then(() => {

            console.log('Vertretungsabsage wurde an ' + Mitarbeiter.Vorname + ' ' + Mitarbeiter.Name + ' gesendet.');

            resolve(Urlaub);

          }).catch((error: any) => {

            // debugger;

            reject(error);
          });
        }
        else {

          console.log('Es wurde keine Vertretungsabsage gesendet.');

          resolve(Urlaub);
        }
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'SendVertreterabsage', this.Debug.Typen.Service);
    }
  }

  public SendFreigabeanfrage(Mitarbeiter: Mitarbeiterstruktur,  Freigebender: Mitarbeiterstruktur, Urlaub: Urlaubsstruktur): Promise<Urlaubsstruktur> {

    try {

      let Betreff: string = 'Anfrage Urlaubsfreigabe von ' + Mitarbeiter.Vorname + ' ' + Mitarbeiter.Name;
      let Nachricht: string;
      let Empfaenger: Outlookemailadressstruktur[] = [];
      let SendAntwort: boolean = false;
      let Vertreter: Mitarbeiterstruktur;
      let Heute: Moment = moment().locale('de');

      return new Promise((resolve, reject) => {

        Nachricht  = "Hallo " + Freigebender.Vorname + "<br><br> es liegen neue Anfragen zur Urlaufsfreigabe von ";
        Nachricht += Mitarbeiter.Vorname + " " + Mitarbeiter.Name + " vor:<br><br>";
        Nachricht += '<table border="1">';
        Nachricht += '<tr>';
        Nachricht += '<td style="width: 100px; text-align: center"><b>Von</b></td><td style="width: 100px; text-align: center"><b>Bis</b></td><td>Vertretung</td>';
        Nachricht += '</tr>';

        for(let Zeitspanne of Urlaub.Zeitspannen) {

          if(Zeitspanne.Status === this.Urlaubstatusvarianten.Vertreterfreigabe && Zeitspanne.FreigabeanfrageSended === false) {

            SendAntwort = true;
            Vertreter   = lodash.find(this.Pool.Mitarbeiterliste, {_id: Zeitspanne.VertreterID});

            Zeitspanne.FreigabeanfrageSended      = true;
            Zeitspanne.Freigabeantwortzeitstempel = Heute.valueOf();

            Nachricht += '<tr>';
            Nachricht += '<td style="text-align: center">' + Zeitspanne.Startstring + '</td>';
            Nachricht += '<td style="text-align: center">' + Zeitspanne.Endestring  + '</td>';
            Nachricht += '<td>';
            if(!lodash.isUndefined(Vertreter)) {

              Nachricht += Vertreter.Vorname + ' ' + Vertreter.Name;
            }
            Nachricht += '</td>';
            Nachricht += '</tr>';
          }
        }

        Nachricht += '</table>';
        Nachricht += '<br><br>';
        Nachricht += '<a href="' + this.Basics.WebAppUrl + '">Urlaubsplanung jetzt öffnen</a>';
        Nachricht += '<br><br>' + this.Pool.GetFilledSignatur(Mitarbeiter,true);

        Empfaenger.push({

          emailAddress: {

            address: Freigebender.Email,
            name: Freigebender.Vorname + ' ' + Freigebender.Name
          }
        });

        if(SendAntwort === true) {

          this.Graph.SendMail(Empfaenger, Betreff, Nachricht).then(() => {

            console.log('Freigabe Anfrage wurde versendet.');

            resolve(Urlaub);

          }).catch((error: any) => {

            // debugger;

            reject(error);
          });
        }
        else {

          console.log('Es wurde keine Freigabe Anfrage versendet.');

          resolve(Urlaub);
        }

      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'SendFreigabeanfrage', this.Debug.Typen.Service);
    }
  }

  public SendMitarbeiterFreigabezusage(Mitarbeiter: Mitarbeiterstruktur, Freigebender: Mitarbeiterstruktur, Urlaub: Urlaubsstruktur): Promise<Urlaubsstruktur> {

    try {

      let Betreff: string = 'Urlaubsfreigabe';
      let Nachricht: string;
      let Empfaenger: Outlookemailadressstruktur[] = [];
      let SendAntwort: boolean = false;
      let Heute: Moment = moment().locale('de');
      let Vertretung: Mitarbeiterstruktur;

      return new Promise((resolve, reject) => {

        Nachricht  = "Hallo " + Mitarbeiter.Vorname + ",<br><br>anbei meine Urlaubsfreigabe für folgende Zeiträume:<br><br>";
        Nachricht += '<table border="1">';
        Nachricht += '<tr>';
        Nachricht += '<td style="width: 100px; text-align: center"><b>Von</b></td>';
        Nachricht += '<td style="width: 100px; text-align: center"><b>Bis</b></td>';
        Nachricht += '<td><b>Vertretung</b></td>';
        Nachricht += '<td><b>Status</b></td>';
        Nachricht += '</tr>';

        for(let Zeitspanne of Urlaub.Zeitspannen) {

          if(Zeitspanne.Status === this.Urlaubstatusvarianten.Genehmigt && Zeitspanne.FreigabeantwortSended === false) {

            Zeitspanne.FreigabeantwortSended      = true;
            Zeitspanne.Freigabeantwortzeitstempel = Heute.valueOf();
            Vertretung = this.DBMitarbeiter.GetMitarbeiterByID(Zeitspanne.VertreterID);

            SendAntwort = true;

            Nachricht += '<tr>';
            Nachricht += '<td style="text-align: center">' + Zeitspanne.Startstring + '</td>';
            Nachricht += '<td style="text-align: center">' + Zeitspanne.Endestring  + '</td>';

            if(!lodash.isUndefined(Vertretung)) {

              Nachricht += '<td>' + Vertretung.Vorname + ' ' + Vertretung.Name + '</td>';
            }
            else {

              Nachricht += '<td style="color: red;">unbekannt</td>';
            }

            Nachricht += '<td style="color: green;">Freigabe</td>';
            Nachricht += '</tr>';


          }
        }

        Nachricht += '</table>';
        Nachricht += '<br><br>';
        Nachricht += 'Deine Urlaubsfreigabe wurde zur Eintragung in "untermStrich" dem Büro mitgeteilt.';
        Nachricht += '<br><br>';
        Nachricht += '<a href="' + this.Basics.WebAppUrl + '">Urlaubsplanung jetzt öffnen</a>';
        Nachricht += '<br><br>' + this.Pool.GetFilledSignatur(Freigebender,true);

        Empfaenger.push({

          emailAddress: {

            address: Mitarbeiter.Email,
            name: Mitarbeiter.Vorname + ' ' + Mitarbeiter.Name
          }
        });

        if(SendAntwort === true) {

          this.Graph.SendMail(Empfaenger, Betreff, Nachricht).then(() => {

            console.log('Urlaubsfreigabe wurde an ' + Mitarbeiter.Vorname + ' ' + Mitarbeiter.Name + ' gesendet.');

            resolve(Urlaub);

          }).catch((error: any) => {

            // debugger;

            reject(error);
          });
        }
        else {

          console.log('Es wurde keine Urlaubsfreigabe gesendet.');

          resolve(Urlaub);
        }
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'SendMitarbeiterFreigabezusage', this.Debug.Typen.Service);
    }
  }

  public SendOfficeFreigabezusage(Mitarbeiter: Mitarbeiterstruktur,  Freigebender: Mitarbeiterstruktur, Urlaub: Urlaubsstruktur): Promise<Urlaubsstruktur> {

    try {

      let Betreff: string = 'Urlaubsfreigabe';
      let Nachricht: string;
      let Empfaenger: Outlookemailadressstruktur[] = [];
      let SendAntwort: boolean = false;
      let Heute: Moment = moment().locale('de');
      let Vertretung: Mitarbeiterstruktur;

      return new Promise((resolve, reject) => {

        Nachricht  = "Hallo Office,<br><br>anbei eine Urlaubsfreigabe für " + Mitarbeiter.Vorname + ' ' + Mitarbeiter.Name + " mit folgenden Zeiträumen:<br><br>";
        Nachricht += '<table border="1">';
        Nachricht += '<tr>';
        Nachricht += '<td style="width: 100px; text-align: center"><b>Von</b></td>';
        Nachricht += '<td style="width: 100px; text-align: center"><b>Bis</b></td>';
        Nachricht += '<td><b>Vertretung</b></td>';
        Nachricht += '<td><b>Status</b></td>';
        Nachricht += '</tr>';

        for(let Zeitspanne of Urlaub.Zeitspannen) {

          if(Zeitspanne.Status === this.Urlaubstatusvarianten.Genehmigt && Zeitspanne.FreigabeantwortOfficeSended === false) {

            Zeitspanne.FreigabeantwortOfficeSended = true;
            Zeitspanne.Freigabeantwortzeitstempel  = Heute.valueOf();
            Vertretung = this.DBMitarbeiter.GetMitarbeiterByID(Zeitspanne.VertreterID);

            SendAntwort = true;

            Nachricht += '<tr>';
            Nachricht += '<td style="text-align: center">' + Zeitspanne.Startstring + '</td>';
            Nachricht += '<td style="text-align: center">' + Zeitspanne.Endestring  + '</td>';

            if(!lodash.isUndefined(Vertretung)) {

              Nachricht += '<td>' + Vertretung.Vorname + ' ' + Vertretung.Name + '</td>';
            }
            else {

              Nachricht += '<td style="color: red;">unbekannt</td>';
            }

            Nachricht += '<td style="color: green;">Freigabe</td>';
            Nachricht += '</tr>';
          }
        }

        Nachricht += '</table>';
        Nachricht += '<br><br>';
        Nachricht += '<a href="' + this.Basics.WebAppUrl + '">Urlaubsplanung jetzt öffnen</a>';
        Nachricht += '<br><br>' + this.Pool.GetFilledSignatur(Freigebender,true);

        Empfaenger.push({

          emailAddress: {

            address: this.Officeemailadress,
            name: 'Office'
          }
        });

        if(SendAntwort === true) {

          this.Graph.SendMail(Empfaenger, Betreff, Nachricht).then(() => {

            console.log('Urlaubsfreigabe wurde an ' + Mitarbeiter.Vorname + ' ' + Mitarbeiter.Name + ' gesendet.');

            resolve(Urlaub);

          }).catch((error: any) => {

            // debugger;

            reject(error);
          });
        }
        else {

          console.log('Es wurde keine Urlaubsfreigabe gesendet.');

          resolve(Urlaub);
        }
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'SendOfficeFreigabezusage', this.Debug.Typen.Service);
    }
  }

  public SendMitarbeiterFreigabeablehnung(Mitarbeiter: Mitarbeiterstruktur, Freigebender: Mitarbeiterstruktur, Urlaub: Urlaubsstruktur): Promise<Urlaubsstruktur> {

    try {

      let Betreff: string = 'Ablehnung deiner Urlaubsanfrage';
      let Nachricht: string;
      let Empfaenger: Outlookemailadressstruktur[] = [];
      let SendAntwort: boolean = false;
      let Heute: Moment = moment().locale('de');
      let Vertretung: Mitarbeiterstruktur;

      return new Promise((resolve, reject) => {

        Nachricht  = "Hallo " + Mitarbeiter.Vorname + " " + Mitarbeiter.Name + ",<br><br>leider muss ich deine Urlaubsanfrage für nachfolgende Zeiträume ablehnen:<br><br>";
        Nachricht += '<table border="1">';
        Nachricht += '<tr>';
        Nachricht += '<td style="width: 100px; text-align: center"><b>Von</b></td>';
        Nachricht += '<td style="width: 100px; text-align: center"><b>Bis</b></td>';
        Nachricht += '<td><b>Vertretung</b></td>';
        Nachricht += '<td><b>Status</b></td>';
        Nachricht += '</tr>';

        for(let Zeitspanne of Urlaub.Zeitspannen) {

          if(Zeitspanne.Status === this.Urlaubstatusvarianten.Abgelehnt && Zeitspanne.FreigabeantwortSended === false) {

            Zeitspanne.FreigabeantwortSended       = true;
            Zeitspanne.Freigabeantwortzeitstempel  = Heute.valueOf();
            Vertretung = this.DBMitarbeiter.GetMitarbeiterByID(Zeitspanne.VertreterID);

            SendAntwort = true;

            Nachricht += '<tr>';
            Nachricht += '<td style="text-align: center">' + Zeitspanne.Startstring + '</td>';
            Nachricht += '<td style="text-align: center">' + Zeitspanne.Endestring  + '</td>';

            if(!lodash.isUndefined(Vertretung)) {

              Nachricht += '<td>' + Vertretung.Vorname + ' ' + Vertretung.Name + '</td>';
            }
            else {

              Nachricht += '<td style="color: red;">unbekannt</td>';
            }

            Nachricht += '<td style="color: red;">Abgelehnt</td>';
            Nachricht += '</tr>';
          }
        }

        Nachricht += '</table>';
        Nachricht += '<br><br>';
        Nachricht += '<a href="' + this.Basics.WebAppUrl + '">Urlaubsplanung jetzt öffnen</a>';
        Nachricht += '<br><br>' + this.Pool.GetFilledSignatur(Freigebender,true);

        Empfaenger.push({

          emailAddress: {

            address: Freigebender.Email,
            name: Freigebender.Vorname + ' ' + Freigebender.Name
          }
        });

        if(SendAntwort === true) {

          this.Graph.SendMail(Empfaenger, Betreff, Nachricht).then(() => {

            console.log('Urlaubsablehung wurde an ' + Mitarbeiter.Vorname + ' ' + Mitarbeiter.Name + ' gesendet.');

            resolve(Urlaub);

          }).catch((error: any) => {

            // debugger;

            reject(error);
          });
        }
        else {

          console.log('Es wurde keine Urlaubsablehnung gesendet.');

          resolve(Urlaub);
        }
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'SendMitarbeiterFreigabeablehnung', this.Debug.Typen.Service);
    }
  }

  public ReadRegionen(landcode: string) {

    try {

      return new Promise((resolve, reject)=> {

        let Daten = {

          Landcode: landcode
        };

        let RegionenObserver = this.http.put(this.ServerReadRegionenUrl, Daten);

        RegionenObserver.subscribe({

          next: (data: any) => {

            this.Regionenliste = <Regionenstruktur[]>data.Regionenliste;
          },
          complete: () => {

            this.Regionenliste = lodash.filter(this.Regionenliste, (region: Regionenstruktur) => {

              return region.isoCode !== '';
            });

            for(let Region of this.Regionenliste) {

              Region.Name = Region.name[0].text;
            }

            resolve(true);
          },
          error: (error: HttpErrorResponse) => {

            // debugger;

            this.Regionenliste = [];

            console.log('Read Regionen ist fehlgeschlagen.');

            resolve(true);

            // reject(error);
          }
        });
      });
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'ReadRegionen', this.Debug.Typen.Service);
    }
  }

  public ReadFeiertage(landcode: string): Promise<any> {

    try {

      let Observer: Observable<any>;
      let Standort: Standortestruktur = lodash.find(this.Pool.Standorteliste, {_id: this.CurrentMitarbeiter.StandortID});

      if(lodash.isUndefined(Standort)) Standort = null;

      let Daten = {

        Standort:          Standort,
        Jahr:              this.Jahr,
        Bundeslandkuerzel: this.Bundeslandkuerzel,
        Landcode:          landcode
      };

      return new Promise((resolve, reject)=> {

        this.Feiertageliste[landcode] = [];

        Observer = this.http.put(this.ServerReadfeiertageUrl, Daten);

        Observer.subscribe({

          next: (ne) => {

            this.Feiertageliste[landcode] = <Feiertagestruktur[]>ne.Feiertageliste;
          },
          complete: () => {

            resolve(true);
          },
          error: (error: HttpErrorResponse) => {

            this.Feiertageliste[landcode] = [];

            // debugger;

            console.log('Read Feiertage ist fehlgeschlagen.');

            resolve(true);
          }
        });
      });
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Page', 'ReadFeiertage', this.Debug.Typen.Service);
    }
  }

  public ReadFerien(landcode: string): Promise<any> {

    try {

      let FerienObserver: Observable<any>;
      let Daten = {

        Jahr:              this.Jahr,
        Bundeslandkuerzel: this.Bundeslandkuerzel,
        Landcode:          landcode
      };

      this.Ferienliste[landcode] = [];

      return new Promise((resolve, reject)=> {

        FerienObserver = this.http.put(this.ServerReadFerienUrl, Daten);

        FerienObserver.subscribe({

          next: (data: any) => {

            this.Ferienliste[landcode] = <Ferienstruktur[]>data.Ferienliste;
          },
          complete: () => {

            resolve(true);
          },

          error: (error: HttpErrorResponse) => {

            this.Ferienliste[landcode] = [];

            console.log('Read Ferien ist fehlgeschlagen.');

            // debugger;

            resolve(true);
          }
        });
      });
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'ReadFerien', this.Debug.Typen.Service);
    }
  }

   public CountAnfragenanzahlen() {

    try {

      this.Anfragenanzahl             = 0;
      this.Antwortenanzahl            = 0;
      this.Vertretungsanfragenanzahl  = 0;
      this.Vertretungsantwortenanzahl = 0;
      this.Freigabenanfragenanzahl    = 0;
      this.Freigabenantwortenanzahl   = 0;

      if(this.CurrentMitarbeiter !== null) {

        this.GetVertretungenliste();
        this.GetFreigabenliste();
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'CountAnfragenanzahlen', this.Debug.Typen.Service);

      return 0;
    }
  }

  public Init() {

    try {

      let Standort: Standortestruktur;
      let Mitarbeiter: Mitarbeiterstruktur;
      let Urlaub: Urlaubsstruktur;
      let Gesamturlaub: number;
      let Urlaubstage: number;

      this.Anfragenanzahl             = 0;
      this.Vertretungsanfragenanzahl  = 0;
      this.Vertretungsantwortenanzahl = 0;
      this.Freigabenanfragenanzahl    = 0;
      this.Freigabenantwortenanzahl   = 0;

      // Land einstellen

      if(this.CurrentMitarbeiter !== null) {

        Standort = lodash.find(this.Pool.Standorteliste, {_id: this.CurrentMitarbeiter.StandortID});

        if (lodash.isUndefined(Standort)) this.Laendercode = 'DE';
        else {

          this.Laendercode = Standort.Land;
        }
      }

      this.ShowFerientage_DE = this.Pool.Mitarbeitersettings.UrlaubShowFerien_DE;
      this.ShowFeiertage_DE  = this.Pool.Mitarbeitersettings.UrlaubShowFeiertage_DE;
      this.Ferienfarbe_DE    = this.Urlaubsfaben.Ferien_DE;
      this.Feiertagefarbe_DE = this.Urlaubsfaben.Feiertage_DE;

      this.ShowFerientage_BG = this.Pool.Mitarbeitersettings.UrlaubShowFerien_BG;
      this.ShowFeiertage_BG  = this.Pool.Mitarbeitersettings.UrlaubShowFeiertage_BG;
      this.Ferienfarbe_BG    = this.Urlaubsfaben.Ferien_BG;
      this.Feiertagefarbe_BG = this.Urlaubsfaben.Feiertage_BG;

      // Urlaub initialisieren

      if(this.CurrentMitarbeiter !== null) {

        this.CurrentUrlaub = lodash.find(this.CurrentMitarbeiter.Urlaubsliste, {Jahr: this.Jahr});

        if(lodash.isUndefined(this.CurrentUrlaub)) {

          this.CurrentUrlaub         = this.GetEmptyUrlaub(this.Jahr);
          this.CurrentZeitspanne     = null;

          this.CurrentMitarbeiter.Urlaubsliste.push(this.CurrentUrlaub);
        }
        else {

          this.CurrentZeitspanne  = null;
        }

        if(lodash.isUndefined(this.CurrentUrlaub.Projektbeteiligteliste)) this.CurrentUrlaub.Projektbeteiligteliste = [];
        if(lodash.isUndefined(this.CurrentUrlaub.Ferienblockerliste))     this.CurrentUrlaub.Ferienblockerliste     = [];
        if(lodash.isUndefined(this.CurrentUrlaub.Feiertageblockerliste))  this.CurrentUrlaub.Feiertageblockerliste  = [];
        if(lodash.isUndefined(this.CurrentUrlaub.FreigeberID))            this.CurrentUrlaub.FreigeberID            = null;
      }

      for(let Zeitspanne of this.CurrentUrlaub.Zeitspannen) {

        Zeitspanne = this.InitZeitspanne(Zeitspanne);
      }

      // Fremde Urlaube zur Einsicht vorbereiten

      this.UrlaublisteExtern = [];

      // Erstmal potentielle Freigabenanfragen mit einfügen in die Projektbeteiligteliste

      for(Mitarbeiter of this.Pool.Mitarbeiterliste) {

        Urlaub = lodash.find(Mitarbeiter.Urlaubsliste, {Jahr: this.Jahr});

        if(!lodash.isUndefined(Urlaub)) {

          if(Urlaub.FreigeberID === this.CurrentMitarbeiter._id && lodash.findIndex(this.CurrentUrlaub.Projektbeteiligteliste, {MitarbeiterID:  Mitarbeiter._id}) === -1) {

            this.CurrentUrlaub.Projektbeteiligteliste.push({

              MitarbeiterID: Mitarbeiter._id,
              Display: true
            });
          }
        }
      }

      // Mitarbeiter aus Projektbeteiligtenliste einfügen

      for(let Eintrag of this.CurrentUrlaub.Projektbeteiligteliste) {

        Mitarbeiter = lodash.find(this.Pool.Mitarbeiterliste, {_id: Eintrag.MitarbeiterID});

        if(!lodash.isUndefined(Mitarbeiter)) {

          Urlaub = lodash.find(Mitarbeiter.Urlaubsliste, {Jahr: this.Jahr});

          if(!lodash.isUndefined(Urlaub)) {

            Urlaub = lodash.cloneDeep(Urlaub);

            Urlaub.MitarbeiterIDExtern = Mitarbeiter._id;
            Urlaub.NameExtern          = Mitarbeiter.Vorname + ' ' + Mitarbeiter.Name;
            Urlaub.NameKuerzel         = Mitarbeiter.Kuerzel;
            Urlaub.Zeitspannen         = lodash.filter(Urlaub.Zeitspannen, (spanne: Urlauzeitspannenstruktur) => {

              return spanne.Status !== this.Urlaubstatusvarianten.Abgelehnt;
            });

          }
          else {

            Urlaub = this.GetEmptyUrlaub(this.Jahr);

            Urlaub.MitarbeiterIDExtern = Mitarbeiter._id;
            Urlaub.NameExtern          = Mitarbeiter.Vorname + ' ' + Mitarbeiter.Name;
            Urlaub.NameKuerzel         = Mitarbeiter.Kuerzel;
          }

          Gesamturlaub  = 0;
          Gesamturlaub += Mitarbeiter.Urlaub;
          Gesamturlaub += Urlaub.Resturlaub;
          Urlaubstage   = 0;

          for(let Zeitspanne of Urlaub.Zeitspannen) {

            if(Zeitspanne.Status !== this.Urlaubstatusvarianten.Abgelehnt) Urlaubstage += Zeitspanne.Tageanzahl;
          }

          if(this.CurrentMitarbeiter !== null && this.CurrentMitarbeiter.Urlaubsadministrator !== null) Urlaub.Text = '[' + Urlaubstage + ' von ' + Gesamturlaub + ']';
          else Urlaub.Text = '[' + Urlaubstage + ']';

          this.UrlaublisteExtern.push(Urlaub);
        }
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'Init', this.Debug.Typen.Service);
    }
  }

  private InitZeitspanne(Zeitspanne: Urlauzeitspannenstruktur): Urlauzeitspannenstruktur {

    try {

      if(lodash.isUndefined(Zeitspanne.VertreterID) || Zeitspanne.VertreterID === '') Zeitspanne.VertreterID = null;

      if(lodash.isUndefined(Zeitspanne.Planungmeldung))    Zeitspanne.Planungmeldung    = '';
      if(lodash.isUndefined(Zeitspanne.Vertretungmeldung)) Zeitspanne.Vertretungmeldung = '';
      if(lodash.isUndefined(Zeitspanne.Freigabemeldung))   Zeitspanne.Freigabemeldung   = '';

      if(lodash.isUndefined(Zeitspanne.VertreteranfrageSended))      Zeitspanne.VertreteranfrageSended      = false;
      if(lodash.isUndefined(Zeitspanne.VertreterantwortSended))      Zeitspanne.VertreterantwortSended      = false;

      if(lodash.isUndefined(Zeitspanne.FreigabeanfrageSended))       Zeitspanne.FreigabeanfrageSended       = false;
      if(lodash.isUndefined(Zeitspanne.FreigabeantwortSended))       Zeitspanne.FreigabeantwortSended       = false;
      if(lodash.isUndefined(Zeitspanne.FreigabeantwortOfficeSended)) Zeitspanne.FreigabeantwortOfficeSended = false;

      if(lodash.isUndefined(Zeitspanne.Vertretunganfragezeitstempel))     Zeitspanne.Vertretunganfragezeitstempel     = null;
      if(lodash.isUndefined(Zeitspanne.Vertretungantwortzeitstempel))     Zeitspanne.Vertretungantwortzeitstempel     = null;
      if(lodash.isUndefined(Zeitspanne.Freigabeantwortzeitstempel))       Zeitspanne.Freigabeantwortzeitstempel       = null;
      if(lodash.isUndefined(Zeitspanne.FreigabeantwortOfficezeitstempel)) Zeitspanne.FreigabeantwortOfficezeitstempel = null;

      if(Zeitspanne.Status === 'Beantragt') Zeitspanne.Status = this.Urlaubstatusvarianten.Geplant;

      return Zeitspanne;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'InitZeitspanne', this.Debug.Typen.Service);
    }
  }

  public SetPlanungsmonate() {

    try {

      if(this.CurrentMonatindex === 0) {

        this.FirstMonatIndex   = 0;
        this.CurrentMonatindex = 1;
        this.LastMonatIndex    = 2;
      }
      else if(this.CurrentMonatindex === 11) {

        this.FirstMonatIndex   = 9;
        this.CurrentMonatindex = 10;
        this.LastMonatIndex    = 11;
      }
      else {

        this.FirstMonatIndex = this.CurrentMonatindex - 1;
        this.LastMonatIndex  = this.CurrentMonatindex + 1;
      }


      // this.PlanungsmonateChanged.emit();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'SetPlanungsmonate', this.Debug.Typen.Service);
    }
  }

  public GetEmptyUrlaub(jahr): Urlaubsstruktur {

    try {

      let Urlaub: Urlaubsstruktur =  {
        Jahr: jahr,
        Resturlaub: 0,
        Zeitspannen: [],
        FreigeberID: null,
        Projektbeteiligteliste: [],
        Ferienblockerliste: [],
        Feiertageblockerliste: []
      };

      if(this.CurrentMitarbeiter !== null && !lodash.isUndefined(this.CurrentMitarbeiter.Urlaubsliste[0])) {

        Urlaub.Projektbeteiligteliste = this.CurrentMitarbeiter.Urlaubsliste[0].Projektbeteiligteliste;
        Urlaub.Ferienblockerliste     = this.CurrentMitarbeiter.Urlaubsliste[0].Ferienblockerliste;
        Urlaub.Feiertageblockerliste  = this.CurrentMitarbeiter.Urlaubsliste[0].Feiertageblockerliste;
      }

      return Urlaub;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Urlaub', 'GetEmptyUrlaub', this.Debug.Typen.Service);
    }
  }

  CheckIsFerientag(Tag: Kalendertagestruktur, landcode: string): boolean {

    try {

      let CurrentTag: Moment = moment(Tag.Tagstempel);
      let Starttag: Moment;
      let Endetag: Moment;
      let IsFerientag: boolean = false;

      if(!lodash.isUndefined(this.Ferienliste[landcode])) {

        for(let Eintrag of this.Ferienliste[landcode]) {

          Starttag = moment(Eintrag.Anfangstempel);
          Endetag  = moment(Eintrag.Endestempel);

          if(CurrentTag.isSameOrAfter(Starttag, 'day') && CurrentTag.isSameOrBefore(Endetag, 'day')) {

            IsFerientag = true;

            break;
          }
        }
      }

      return IsFerientag;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'CheckIsFerientag', this.Debug.Typen.Service);
    }
  }

  GetFeriennamen(ferientag: Ferienstruktur, laendercode: string) {

    try {

      let Name: string = laendercode + ': Unbekannt';

      for(let name of ferientag.name) {

        if(name.language === laendercode) Name = name.text;
      }

      return Name;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'GetFeriennamen', this.Debug.Typen.Service);
    }
  }

  GetFeiertagnamen(feiertag: Ferienstruktur, laendercode: string) {

    try {

      let Name: string = laendercode + ': Unbekannt';

      for(let name of feiertag.name) {

        if(name.language === laendercode) Name = name.text;
      }

      return Name;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'GetFeiertagnamen', this.Debug.Typen.Service);
    }
  }

  GetFerientag(Tag: Kalendertagestruktur, landcode: string): Kalendertagestruktur {

    try {

      let CurrentTag: Moment = moment(Tag.Tagstempel);
      let Starttag: Moment;
      let Endetag: Moment;
      let Ferientag: Kalendertagestruktur;
      let Eintrag: Ferienstruktur;

      if(!lodash.isUndefined(this.Ferienliste[landcode])) {

        for(Eintrag of this.Ferienliste[landcode]) {

          Starttag = moment(Eintrag.Anfangstempel);
          Endetag  = moment(Eintrag.Endestempel);

          if(CurrentTag.isSameOrAfter(Starttag, 'day') && CurrentTag.isSameOrBefore(Endetag, 'day')) {

            Ferientag = {
              Tagnummer: 0,
              Hauptmonat: false,
              Kalenderwoche: 0,
              Tag: "",
              Tagstempel: Eintrag.Anfangstempel,
              Ferienname_DE: this.GetFeriennamen(Eintrag, 'DE'),
              Ferienname_BG: this.GetFeriennamen(Eintrag, 'EN'),
            };

            return Ferientag;

            break;
          }
        }
      }

      return null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'GetFerientag', this.Debug.Typen.Service);
    }
  }

  CheckIsFeiertag(Tag: Kalendertagestruktur, landcode: string): boolean {

    try {

      let CurrentTag: Moment = moment(Tag.Tagstempel);
      let Feiertag: Moment;
      let IsFeiertag: boolean = false;

      if(!lodash.isUndefined(this.Feiertageliste[landcode])) {

        for(let Eintrag of this.Feiertageliste[landcode]) {

          Feiertag = moment(Eintrag.Anfangstempel);

          if(Feiertag.isSame(CurrentTag, 'day') && lodash.findIndex(this.CurrentUrlaub.Feiertageblockerliste, Tag.Tagstempel) === -1) {

            IsFeiertag = true;

            break;
          }
        }
      }

      return IsFeiertag;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'CheckIsFeiertag', this.Debug.Typen.Service);
    }
  }

  GetFeiertag(currenttag: Kalendertagestruktur, landcode: string): Kalendertagestruktur {

    try {

      let CurrentTag: Moment = moment(currenttag.Tagstempel);
      let Feiertagdatum: Moment;
      let Feiertag: Kalendertagestruktur;
      let Tag: Ferienstruktur;

      if(!lodash.isUndefined(this.Feiertageliste[landcode])) {

        for(Tag of this.Feiertageliste[landcode]) {

          Feiertagdatum = moment(Tag.Anfangstempel);

          if(Feiertagdatum.isSame(CurrentTag, 'day')) {

            Feiertag = {
              Tagnummer: 0,
              Hauptmonat: false,
              Kalenderwoche: 0,
              Tag: "",
              Tagstempel: Tag.Anfangstempel,
              Feiertagname_DE: this.GetFeiertagnamen(Tag, 'DE'),
              Feiertagname_BG: this.GetFeiertagnamen(Tag, 'EN'),
            };

            return Feiertag;

            break;
          }
        }
      }

      return null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'GetFeiertag', this.Debug.Typen.Service);
    }
  }

  public GetEmptyZeitspanne(): Urlauzeitspannenstruktur {

    try {

      return {

        ZeitspannenID: this.Pool.GetNewUniqueID(),
        Startstempel: null,
        Endestempel:  null,
        Startstring: "",
        Endestring:  "",
        VertreterID: null,
        Status: this.Urlaubstatusvarianten.Geplant,
        Planungmeldung: '',
        Vertretungmeldung: '',
        Freigabemeldung: '',
        Tageanzahl: 0,
        VertreteranfrageSended: false,
        VertreterantwortSended: false,
        FreigabeanfrageSended: false,
        FreigabeantwortSended: false,
        FreigabeantwortOfficeSended: false,
        Vertretunganfragezeitstempel: null,
        Vertretungantwortzeitstempel: null,
        Freigabeantwortzeitstempel: null,
        FreigabeantwortOfficezeitstempel: null
      };
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Urlaub', 'GetEmptyZeitspanne', this.Debug.Typen.Service);
    }
  }

  /*
  private UpdateUrlaubsliste(changelog: Changelogstruktur) {

    try {


      let Index: number;

      Index = lodash.findIndex(this.Pool.Changlogliste, {_id : this.CurrentChangelog._id});

      if(Index !== -1) {

        this.Pool.Changlogliste[Index] = changelog; // aktualisieren

        this.Debug.ShowMessage('Changelogliste updated: ' + changelog.Version, 'Database Changelog', 'UpdateChangelogliste', this.Debug.Typen.Service);

      }
      else {

        this.Debug.ShowMessage('Chnagelog nicht gefunden -> neues Changlog hinzufügen', 'Database Chnagelog', 'UpdateChangelogliste', this.Debug.Typen.Service);

        this.Pool.Changlogliste.unshift(changelog); // neuen
      }

      // Gelöscht markiert Einträge entfernen

      this.Pool.Changlogliste = lodash.filter(this.Pool.Changlogliste, (currentchangelog: Changelogstruktur) => {

        return currentchangelog.Deleted === false;
      });



    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Urlaub', 'UpdateUrlaubsliste', this.Debug.Typen.Service);
    }
  }
  */

  public CountResturlaub(): number {

    try {

      let Gesamturlaub: number = 0;

      if(this.CurrentUrlaub !== null && this.Pool.Mitarbeiterdaten !== null) {

        Gesamturlaub += this.Pool.Mitarbeiterdaten.Urlaub;
        Gesamturlaub += this.CurrentUrlaub.Resturlaub;

        for(let Zeitspanne of this.CurrentUrlaub.Zeitspannen) {

          if(Zeitspanne.Status !== this.Urlaubstatusvarianten.Abgelehnt) Gesamturlaub -= Zeitspanne.Tageanzahl;
        }

        return Gesamturlaub;
      }
      else return 0;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'CountResturlaub', this.Debug.Typen.Service);
    }
  }



  public CheckDisplayExternenUrlaub(mitrbeiterid: string):boolean {

    try {

      let Beteiligt: Urlaubprojektbeteiligtestruktur;
      let Mitarbeiter: Mitarbeiterstruktur;
      let Urlaub: Urlaubsstruktur;

      if(this.CurrentUrlaub !== null) {

        Beteiligt = lodash.find(this.CurrentUrlaub.Projektbeteiligteliste, {MitarbeiterID: mitrbeiterid});

        if(lodash.isUndefined(Beteiligt)) return false;
        else {

          Mitarbeiter = lodash.find(this.Pool.Mitarbeiterliste, {_id: Beteiligt.MitarbeiterID});
          Urlaub      = lodash.find(Mitarbeiter.Urlaubsliste, {Jahr: this.CurrentUrlaub.Jahr});

          if(lodash.isUndefined(Urlaub)) return false;
          else {

            return Beteiligt.Display && Urlaub.Zeitspannen.length > 0;
          }

        }
      }
      else return false;


    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Database Urlaub', 'CheckDisplayExternenUrlaub', this.Debug.Typen.Service);
    }
  }
}
