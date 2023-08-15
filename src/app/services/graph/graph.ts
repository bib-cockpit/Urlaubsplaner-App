import {Inject, Injectable} from '@angular/core';
import {DebugProvider} from "../debug/debug";
import {MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalService} from "@azure/msal-angular";
import {ConstProvider} from "../const/const";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Graphuserstruktur} from "../../dataclasses/graphuserstruktur";
import {DomSanitizer} from "@angular/platform-browser";
import {DatabaseAuthenticationService} from "../database-authentication/database-authentication.service";
import {AuthProviderCallback, Client, GraphError, ResponseType} from '@microsoft/microsoft-graph-client';
import {User} from "@microsoft/microsoft-graph-types";
import {ToolsProvider} from "../tools/tools";
import * as lodash from 'lodash-es';
import {Projektestruktur} from "../../dataclasses/projektestruktur";
import {DatabasePoolService} from "../database-pool/database-pool.service";
import {Teamsstruktur} from "../../dataclasses/teamsstruktur";
import {Teamsfilesstruktur} from "../../dataclasses/teamsfilesstruktur";
import {Teamsdownloadstruktur} from "../../dataclasses/teamsdownloadstruktur";
import {GraphErrorHandler} from "@microsoft/microsoft-graph-client/lib/es/src/GraphErrorHandler";
import {Teamsmitgliederstruktur} from "../../dataclasses/teamsmitgliederstruktur";
import {Observable} from "rxjs";
import {group} from "@angular/animations";
import {Outlookkontaktestruktur} from "../../dataclasses/outlookkontaktestruktur";
import {ExtendedTemplateCheckerImpl} from "@angular/compiler-cli/src/ngtsc/typecheck/extended";
import {Projektbeteiligtestruktur} from "../../dataclasses/projektbeteiligtestruktur";
import moment, {Moment} from "moment";
import {Outlookemailstruktur} from "../../dataclasses/outlookemailstruktur";
import {Outlookemailattachmentstruktur} from "../../dataclasses/outlookemailattachmentstruktur";
import {Emailfolderstruktur} from "../../dataclasses/emailfolderstruktur";
import {folder} from "ionicons/icons";
import {DatabaseOutlookemailService} from "../database-email/database-outlookemail.service";
import {Outlookkalenderstruktur} from "../../dataclasses/outlookkalenderstruktur";

@Injectable({
  providedIn: 'root'
})
export class Graphservice {

  public Graphuser: Graphuserstruktur;
  public Teamsliste: Teamsstruktur[];
  public UserimageSRC: any;
  public TeamsRootfilelist: Teamsfilesstruktur[];
  public TeamsCurrentfilelist: Teamsfilesstruktur[];
  public TeamsSubdirectorylist: Teamsfilesstruktur[];
  public CurrentTeamsID: string;
  public Outlookkontakteliste: Outlookkontaktestruktur[];
  public CurrentPDFDownload: Teamsdownloadstruktur;
  public KalenderKW: number;

  constructor(
              @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
              private Debug: DebugProvider,
              private authService: MsalService,
              private Const: ConstProvider,
              private http: HttpClient,
              private AuthService: DatabaseAuthenticationService,
              private Tools: ToolsProvider,
              private DBEmail: DatabaseOutlookemailService,
              private Http:  HttpClient,
              private Pool: DatabasePoolService,
              private domSanitizer: DomSanitizer,
  ) {
    try {

      this.Graphuser             = null;
      this.UserimageSRC          = null;
      this.Teamsliste            = [];
      this.TeamsRootfilelist     = [];
      this.TeamsCurrentfilelist  = [];
      this.TeamsSubdirectorylist = [];
      this.CurrentTeamsID        = 'ea457111-b3f1-4c73-a8ae-cb1cbaf6d244'; // Köferinger Straße 20
      this.CurrentPDFDownload    = null;
      this.Outlookkontakteliste  = [];
      this.KalenderKW            = moment().locale('de').isoWeek();


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Graph', 'constructor', this.Debug.Typen.Service);
    }
  }


  public async GetOwnOutlookcontacts(withemailonly: boolean): Promise<any> {

    try {

      let Valueliste: any[]    = [];
      let data: any;
      let nexturl: any;
      let count: number = 0;
      let Eintrag: Outlookkontaktestruktur;

      let token = await this.AuthService.RequestToken('contacts.read');

      if(token !== null) {

        const graphClient = Client.init({ authProvider: (done: AuthProviderCallback) => {

            done(null, token);
          }
        });

        data = await graphClient.api('/me/contacts').count().get();

        if(!lodash.isUndefined(data['@odata.count'])) count = data['@odata.count'];

        if(!lodash.isUndefined(data.value)) {

          Valueliste.push(data.value);

          if(!lodash.isUndefined(data['@odata.nextLink'])) {

            do {

              nexturl = data['@odata.nextLink'];
              data    = await graphClient.api(nexturl).get();

              if(!lodash.isUndefined(data.value)) Valueliste.push(data.value);

            }
            while(!lodash.isUndefined(data['@odata.nextLink']));

            if(!lodash.isUndefined(data.value)) Valueliste.push(data.value);
          }
        }

        this.Outlookkontakteliste = [];

        for(let Liste of Valueliste) {

          for(Eintrag of Liste) {

            if(Eintrag.givenName !== null && Eintrag.givenName.toLowerCase() === 'lars' || Eintrag.surname !== null && Eintrag.surname.toLowerCase() === 'lars') {

              debugger;
            }

            if(Eintrag.title !== null && Eintrag.title !== '' && Eintrag.displayName !== null) {

              Eintrag.displayName = Eintrag.displayName.replace(Eintrag.title + ' ', '');
            }

            if(lodash.isUndefined(Eintrag.businessAddress)) {

              Eintrag.businessAddress = {

                street: '',
                city: '',
                state: '',
                postalCode: '',
                countryOrRegion: ''
              };
            }

            if(lodash.isUndefined(Eintrag.businessAddress.street)          || Eintrag.businessAddress.street          === null) Eintrag.businessAddress.street          = '';
            if(lodash.isUndefined(Eintrag.businessAddress.city)            || Eintrag.businessAddress.city            === null) Eintrag.businessAddress. city           = '';
            if(lodash.isUndefined(Eintrag.businessAddress.postalCode)      || Eintrag.businessAddress.postalCode      === null) Eintrag.businessAddress.postalCode      = '';
            if(lodash.isUndefined(Eintrag.businessAddress.state)           || Eintrag.businessAddress.state           === null) Eintrag.businessAddress.state           = '';
            if(lodash.isUndefined(Eintrag.businessAddress.countryOrRegion) || Eintrag.businessAddress.countryOrRegion === null) Eintrag.businessAddress.countryOrRegion = '';

            if(lodash.isUndefined(Eintrag.title)       || Eintrag.title       === null) Eintrag.title       = '';
            if(lodash.isUndefined(Eintrag.displayName) || Eintrag.displayName === null) Eintrag.displayName = '';
            if(lodash.isUndefined(Eintrag.surname)     || Eintrag.surname     === null) Eintrag.surname     = '';
            if(lodash.isUndefined(Eintrag.givenName)   || Eintrag.givenName   === null) Eintrag.givenName   = '';
            if(lodash.isUndefined(Eintrag.companyName) || Eintrag.companyName === null) Eintrag.companyName = '';

            if(Eintrag.surname === '' && Eintrag.givenName !== '') {

              Eintrag.surname   = Eintrag.givenName;
              Eintrag.givenName = '';
            }

            if(Eintrag.surname === '' && Eintrag.givenName === '' && Eintrag.displayName === '') {

              Eintrag.IsCompany   = true;
              Eintrag.surname     = Eintrag.companyName;
              Eintrag.companyName = '';
            }
            else {

              Eintrag.IsCompany = false;
            }

            if(withemailonly) {

              if(Eintrag.emailAddresses.length > 0) this.Outlookkontakteliste.push(Eintrag);
            }
            else {

              this.Outlookkontakteliste.push(Eintrag);
            }
          }
        }

        return Promise.resolve(true);
      }
      else {

        return Promise.reject(false);
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Graph', 'GetOwnOutlookcontacts', this.Debug.Typen.Service);
    }
  }

  public OutlookcontactToBeteiligte(kontakt: Outlookkontaktestruktur): Projektbeteiligtestruktur {

    try {

      let Beteiligter: Projektbeteiligtestruktur;
      let Beteiligteneintragtyp:string;

      if(kontakt.IsCompany) {

        Beteiligteneintragtyp = this.Const.Beteiligteneintragtypen.Firma;
      }
      else {

        Beteiligteneintragtyp = this.Const.Beteiligteneintragtypen.Person;
      }



      Beteiligter = {

        Anrede: kontakt.title,
        BeteiligtenID: kontakt.id,
        Beteiligteneintragtyp: Beteiligteneintragtyp,
        Beteiligtentyp: 0,
        Email: kontakt.emailAddresses.length > 0 ? kontakt.emailAddresses[0].address : '',
        Fachfirmentyp: 0,
        Firma: kontakt.companyName,
        Kuerzel: "",
        Mobil: kontakt.mobilePhone,
        Name: kontakt.surname,
        Vorname: kontakt.givenName,
        Ort: kontakt.businessAddress.city,
        PLZ: kontakt.businessAddress.postalCode,
        Strasse: "",
        Telefon: kontakt.businessPhones.length > 0 ? kontakt.businessPhones[0] : '',
        Verfasser: {

          Vorname: this.Pool.Mitarbeiterdaten.Vorname,
          Name:  this.Pool.Mitarbeiterdaten.Name,
          Email: this.Pool.Mitarbeiterdaten.Email
        },
      };

      return Beteiligter;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Graph', 'OutlookcontactToBeteiligte', this.Debug.Typen.Service);
    }
  }

  public async GetOwnCalendar(): Promise<any> {

    try {

      let token = await this.AuthService.RequestToken('user.read');
      let data: any;
      let Valueliste: any[]    = [];
      let nexturl: any;
      let count: number;
      let Kalenderliste: any[];
      let Tag: Moment = moment().isoWeek(this.KalenderKW).locale('de');
      let Montag: Moment = Tag.clone().startOf('week');
      let Sonntag: Moment = Tag.clone().endOf('week');
      let Datumsteile: string[];
      let Zeitteile: string[];
      let Uhrzeitteile: string[];
      let Eintrag: Outlookkalenderstruktur;
      let Zeitpunkt: Moment;

      console.log(Montag.format('DD.MM.YYYY'));
      console.log(Sonntag.format('DD.MM.YYYY'));

      const graphClient = Client.init({ authProvider: (done: AuthProviderCallback) => {

          done(null, token);
        }
      });

      try {

        // '2023-01-01'
        // '2023-03-30'

        data = await graphClient.api('/me/calendarview')
              .header('Prefer', 'UTC')
              .query({startDateTime: Montag.format('YYYY-MM-DD'), endDateTime: Sonntag.format('YYYY-MM-DD') }).count().get();

      }
      catch (error: any) {


      }

      if(!lodash.isUndefined(data['@odata.count'])) count = data['@odata.count'];

      if(!lodash.isUndefined(data.value)) {

        Valueliste.push(data.value);

        if(!lodash.isUndefined(data['@odata.nextLink'])) {

          do {

            nexturl = data['@odata.nextLink'];
            data    = await graphClient.api(nexturl).get();

            if(!lodash.isUndefined(data.value)) Valueliste.push(data.value);
          }
          while(!lodash.isUndefined(data['@odata.nextLink']));

          if(!lodash.isUndefined(data.value)) Valueliste.push(data.value);
        }
      }

      Kalenderliste = [];

      for(let Liste of Valueliste) {

        for(Eintrag of Liste) {

          Zeitteile    = Eintrag.start.dateTime.split('T');
          Datumsteile  = Zeitteile[0].split('-');
          Uhrzeitteile = Zeitteile[1].split('.');
          Uhrzeitteile = Uhrzeitteile[0].split(':');

          Zeitpunkt = moment(
            {
              year:   parseInt(Datumsteile[0]),
              month:  parseInt(Datumsteile[1]) - 1,
              day:    parseInt(Datumsteile[2]),
              hour:   parseInt(Uhrzeitteile[0]),
              minute: parseInt(Uhrzeitteile[1]),
              second: parseInt(Uhrzeitteile[2])
            });

          Eintrag.start.Zeitstempel = Zeitpunkt.valueOf();

          Zeitteile    = Eintrag.end.dateTime.split('T');
          Datumsteile  = Zeitteile[0].split('-');
          Uhrzeitteile = Zeitteile[1].split('.');
          Uhrzeitteile = Uhrzeitteile[0].split(':');

          Zeitpunkt = moment(
            {
              year:   parseInt(Datumsteile[0]),
              month:  parseInt(Datumsteile[1]) - 1,
              day:    parseInt(Datumsteile[2]),
              hour:   parseInt(Uhrzeitteile[0]),
              minute: parseInt(Uhrzeitteile[1]),
              second: parseInt(Uhrzeitteile[2])
            });

          Eintrag.end.Zeitstempel = Zeitpunkt.valueOf();

          Kalenderliste.push(Eintrag);
        }
      }

      return Kalenderliste;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Graph', 'GetOwnCalendar', this.Debug.Typen.Service);
    }
  }

  public async GetOwnUserinfo(): Promise<any> {

    try {

      let token = await this.AuthService.RequestToken('user.read');

      const graphClient = Client.init({ authProvider: (done: AuthProviderCallback) => {

          done(null, token);
        }
      });

      return new Promise((resolve, reject) => {

        if(token !== null) {


          graphClient.api('/me').select('*').get().then((result: User) => {

            this.Graphuser = <Graphuserstruktur>result;

            resolve(true);

          }).catch((error: GraphError) => {

            switch (error.code) {

              case "InvalidAuthenticationToken":

                debugger;

                this.AuthService.AccessTokenExpired = true;
                this.AuthService.UnsetActiveUser();

                this.Tools.SetRootPage(this.Const.Pages.HomePage);

                break;

              default:

                debugger;

                break;
            }

            reject(error);
          });
        }
        else {

          reject(false);
        }
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Graph', 'GetOwnUserinfo', this.Debug.Typen.Service);
    }
  }

  public async GetOwnEmail(emailid: string): Promise<Outlookemailstruktur> {

    try {

      let token = await this.AuthService.RequestToken('user.read');
      let Email: Outlookemailstruktur;
      let Datum: string;
      let Empfangstag: Moment;

      const graphClient = Client.init({ authProvider: (done: AuthProviderCallback) => {

          done(null, token);
        }
      });


      return new Promise((resolve, reject) => {

        if(token !== null) {

          graphClient.api('/me/messages/' + emailid + '?$expand=attachments').get().then((email: Outlookemailstruktur) => {

            Email         = email;
            Email.subject = Email.subject.replace('🏢', '');
            Datum         = Email.receivedDateTime.replace('T', ' ');
            Datum         = Datum.replace('Z', '');
            Empfangstag   = moment(Datum);

            Email.Zeitstempel = Empfangstag.valueOf();
            Email.Zeitstring  = Empfangstag.format('DD.MM.YYYY HH:mm');

            resolve(Email);

          }).catch((error: GraphError) => {

            switch (error.code) {

              case "InvalidAuthenticationToken":

                debugger;

                this.AuthService.AccessTokenExpired = true;
                this.AuthService.UnsetActiveUser();

                this.Tools.SetRootPage(this.Const.Pages.HomePage);

                break;

              default:

                debugger;

                break;
            }

            reject(error);
          });
        }
        else {

          reject(false);
        }
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Graph', 'GetOwnEmail', this.Debug.Typen.Service);
    }
  }

  public async GetOwnEmailAttachemntlist(emailid: string): Promise<Outlookemailattachmentstruktur[]> {

    try {

      let token = await this.AuthService.RequestToken('user.read');

      const graphClient = Client.init({ authProvider: (done: AuthProviderCallback) => {

          done(null, token);
        }
      });

      return new Promise((resolve, reject) => {

        if(token !== null) {

          graphClient.api('/me/messages/' + emailid + '/attachments').get().then((result: any) => {

            resolve(lodash.isUndefined(result.value) ? [] : result.value);

          }).catch((error: GraphError) => {

            switch (error.code) {

              case "InvalidAuthenticationToken":

                debugger;

                this.AuthService.AccessTokenExpired = true;
                this.AuthService.UnsetActiveUser();

                this.Tools.SetRootPage(this.Const.Pages.HomePage);

                break;

              default:

                debugger;

                break;
            }

            reject(error);
          });
        }
        else {

          reject(false);
        }
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Graph', 'GetOwnEmailAttachemntlist', this.Debug.Typen.Service);
    }
  }

  public async GetOwnEmailfolders(): Promise<Emailfolderstruktur[]> {

    try {

      let token = await this.AuthService.RequestToken('user.read');
      let data: any;
      let Liste: Emailfolderstruktur[] = [];

      const graphClient = Client.init({ authProvider: (done: AuthProviderCallback) => {

          done(null, token);
        }
      });

      try {

        data = await graphClient.api('/me/mailFolders').get();

        if(!lodash.isUndefined(data.value)) {

          for(let Eintrag of data.value) {

            Liste.push(Eintrag);

            console.log(Eintrag.id);
          }
        }

        return Liste;
      }
      catch(error: any) {

        return error;
      }
    }
    catch (error)  {

      this.Debug.ShowErrorMessage(error, 'Graph', 'GetOwnEmailfolders', this.Debug.Typen.Service);
    }
  }

  public async GetOwnEmailliste(folderid: string): Promise<any> {

    try {

      let data: any;
      let Valueliste: any[]    = [];
      let nexturl: any;
      let count: number;
      let Emailliste: Outlookemailstruktur[] = [];
      let token = await this.AuthService.RequestToken('user.read');
      let Empfangstag: Moment;
      let Datum: string;

      const graphClient = Client.init({ authProvider: (done: AuthProviderCallback) => {

          done(null, token);
        }
      });

      try {

        // Inbox

        Datum = this.DBEmail.Emaildatum.format('YYYY-MM-DD');
        data  = await graphClient.api('/me/mailFolders/' + folderid + '/messages?$filter=receivedDateTime ge ' + Datum + 'T01:00:00Z')
          .select('id, subject, isRead, sentDateTime, receivedDateTime, from, sender, toRecipients, ccRecipients, hasAttachments')
          .count().get();


        //  meetingCancelled
        //  meetingRequest
        // &meetingMessageType ne meetingRequest
        // , meetingMessageType, meetingRequestType, meetingRequestType

        //
      }
      catch(error: any) {

        debugger;

        return error;
      }

      if(!lodash.isUndefined(data['@odata.count'])) count = data['@odata.count'];

      if(!lodash.isUndefined(data.value)) {

        Valueliste.push(data.value);

        if(!lodash.isUndefined(data['@odata.nextLink'])) {

          do {

            nexturl = data['@odata.nextLink'];
            data    = await graphClient.api(nexturl).get();

            if(!lodash.isUndefined(data.value)) Valueliste.push(data.value);
          }
          while(!lodash.isUndefined(data['@odata.nextLink']));

          if(!lodash.isUndefined(data.value)) Valueliste.push(data.value);
        }
      }

      for(let Liste of Valueliste) {

        for(let Eintrag of Liste) {

          Datum       = Eintrag.receivedDateTime.replace('T', ' ');
          Datum       = Datum.replace('Z', '');
          Empfangstag = moment(Datum);

          if(!lodash.isUndefined(Eintrag.from)) {

            if(lodash.isUndefined(lodash.find(Emailliste, {id: Eintrag.id}))) {

              Eintrag.Zeitstempel = Empfangstag.valueOf();
              Eintrag.Zeitstring  = Empfangstag.format('DD.MM.YYYY HH:mm');
              Eintrag.subject     = Eintrag.subject.replace('🏢', '');

              if(Eintrag.subject.indexOf('anythingbutnothing') !== -1) {


              }

              Emailliste.push(Eintrag);
            }
          }
          else {


          }
        }
      }

      debugger;

      Emailliste = lodash.filter(Emailliste, (Eintrag: Outlookemailstruktur) => {

        return lodash.isUndefined(Eintrag['@odata.type']);
      });


      return Emailliste;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Graph', 'GetOwnEmailliste', this.Debug.Typen.Service);
    }
  }

  public async GetOtherUserinfo(userid: string): Promise<Graphuserstruktur> {

    try {

      let OtherUser: Graphuserstruktur;
      let token = await this.AuthService.RequestToken('user.read.all');

      const graphClient = Client.init({ authProvider: (done: AuthProviderCallback) => {

          done(null, token);
        }
      });

      return new Promise((resolve, reject) => {

        if(token !== null) {

          graphClient.api('/users/' + userid).select('*').get().then((result: User) => {

            OtherUser = <Graphuserstruktur>result;

            resolve(OtherUser);

          }).catch((error: GraphError) => {

            switch (error.code) {

              case "InvalidAuthenticationToken":

                break;

              default:

                debugger;

                break;
            }

            reject(error);
          });
        }
        else {

          reject(false);
        }
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Graph', 'GetOwnUserinfo', this.Debug.Typen.Service);
    }
  }

  public async GetOtherTeamsinfo(teamsid: string): Promise<Teamsstruktur> {

    try {

      let OtherTeams: Teamsstruktur;
      let token = await this.AuthService.RequestToken('team.readbasic.all');

      const graphClient = Client.init({ authProvider: (done: AuthProviderCallback) => {

          done(null, token);
        }
      });

      debugger;

      return new Promise((resolve, reject) => {

        if(token !== null) {

          graphClient.api('/teams/' + teamsid).get().then((result: User) => {

            OtherTeams = <Teamsstruktur>result;

            debugger;

            resolve(OtherTeams);

          }).catch((error: GraphError) => {

            debugger;

            switch (error.code) {

              case "InvalidAuthenticationToken":

                break;

              default:

                debugger;

                break;
            }

            reject(error);
          });
        }
        else {

          reject(false);
        }
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Graph', 'GetOwnUserinfo', this.Debug.Typen.Service);
    }
  }

  public async ReadDrives(): Promise<any> {

    try {

      let data: any;
      let IDListe: string[] = [];
      let FolderID: string = 'b!XZkHnfB1aUS9CAl7ACx42jN1tORayIZBnpNxgMZWN2yIJmx4iz54T59g6GswaFyl';

      let token = await this.AuthService.RequestToken('Files.ReadWrite.All');

      const graphClient = Client.init({ authProvider: (done: AuthProviderCallback) => {

          done(null, token);
        }
      });

      // GET /me/joinedTeams
      // GET /me/memberOf

      if(token !== null) {

        data = await graphClient.api('/drives/' + FolderID + '/items/root/children').get();

        data.value.forEach((Eintrag) => {

          if(Eintrag.name === 'Dokumente') {

            debugger;
          }
          console.log(Eintrag.name);
        });
        // debugger;
      }
      else {

        return Promise.reject(false);
      }

    } catch (error) {

      debugger;

      this.Debug.ShowErrorMessage(error, 'Graph', 'ReadDrives', this.Debug.Typen.Service);
    }
  }

  public async GetTeamsRootfilelist(teamsid: string, showfiles: boolean) {

    try {

      let token = await this.AuthService.RequestToken('user.read');
      let Eintrag: Teamsfilesstruktur;

      this.TeamsRootfilelist     = [];
      this.TeamsSubdirectorylist = [];

      const graphClient = Client.init({ authProvider: (done: AuthProviderCallback) => {

          done(null, token);
        }
      });

      return new Promise((resolve, reject) => {

        if(token !== null) {


          // "/groups/' + teamsid + '/drive/items/' + folderid + ':/test.txt:/content

          graphClient.api('/groups/' + teamsid + '/drive/items/root/children').get().then((result: any) => {

            for(Eintrag of result.value) {

              if(!lodash.isUndefined(Eintrag.folder)) Eintrag.isfolder = true;
              else Eintrag.isfolder = false;

              this.TeamsRootfilelist.push(Eintrag);
            }

            if(showfiles === false) this.TeamsRootfilelist = lodash.filter(this.TeamsRootfilelist, {isfolder : true});

            this.TeamsCurrentfilelist = this.TeamsRootfilelist;

            resolve(true);

          }).catch((error: GraphError) => {

            debugger;

            reject(error);
          });
        }
        else {

          reject(false);
        }
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Graph', 'GetTeamsRootfilelist', this.Debug.Typen.Service);
    }
  }

  public RemoveTeamsSubdirectory(file: Teamsfilesstruktur) {

    try {

      let Liste: Teamsfilesstruktur[] = lodash.cloneDeep(this.TeamsSubdirectorylist);

      this.TeamsSubdirectorylist = [];

      for(let Eintrag of Liste) {

        if(Eintrag.id !== file.id) this.TeamsSubdirectorylist.push(file);
        else break;
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'file', 'RemoveTeamsSubdirectory', this.Debug.Typen.Service);
    }
  }



  public async GetTeamsSubdirictoryfilelist(teamsid: string, file: Teamsfilesstruktur, showfiles: boolean) {

    try {

      let token = await this.AuthService.RequestToken('user.read');
      let Eintrag: Teamsfilesstruktur;

      this.TeamsRootfilelist = [];

      const graphClient = Client.init({ authProvider: (done: AuthProviderCallback) => {

          done(null, token);
        }
      });

      return new Promise((resolve, reject) => {

        if(token !== null) {


          graphClient.api('/groups/' + teamsid + '/drive/items/' + file.id + '/children').get().then((result: any) => {

            for(Eintrag of result.value) {

              if(!lodash.isUndefined(Eintrag.folder)) Eintrag.isfolder = true;
              else Eintrag.isfolder = false;

              this.TeamsRootfilelist.push(Eintrag);
            }

            if(showfiles === false) this.TeamsRootfilelist = lodash.filter(this.TeamsRootfilelist, {isfolder : true});

            this.TeamsCurrentfilelist = this.TeamsRootfilelist;

            this.TeamsSubdirectorylist.push(file);

            resolve(true);

          }).catch((error: GraphError) => {

            reject(error);
          });
        }
        else {

          reject(false);
        }
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Graph', 'GetTeamsSubdirictoryfilelist', this.Debug.Typen.Service);
    }
  }

  public async DownloadPDFTeamsFile(teamsid: string, file: Teamsfilesstruktur): Promise<Teamsdownloadstruktur> {

    try {

      let token = await this.AuthService.RequestToken('user.read');
      let Download: Teamsdownloadstruktur = {

        name: file.name,
        id: '',
        context: '',
        url: ''
      };

      const graphClient = Client.init({ authProvider: (done: AuthProviderCallback) => {

          done(null, token);
        }
      });

      return new Promise((resolve, reject) => {

        if(token !== null) {

          graphClient.api('/groups/' +  teamsid + '/drive/items/' + file.id + '?select=id,@microsoft.graph.downloadUrl').get().then((result: any) => {

            Download.id      = result.id;
            Download.url     = result['@microsoft.graph.downloadUrl'];
            Download.context = result['@odata.context'];

            this.CurrentPDFDownload = Download;

            resolve(Download);

          }).catch((error: GraphError) => {

            debugger;

            reject(error);
          });
        }
        else {

          reject(null);
        }
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Graph', 'DownloadPDFTeamsFile', this.Debug.Typen.Service);
    }
  }

  public async GetOwnUserteams() {

    try {

      let token = await this.AuthService.RequestToken('user.read');

      this.Teamsliste = [];

      const graphClient = Client.init({ authProvider: (done: AuthProviderCallback) => {

          done(null, token);
        }
      });

      return new Promise((resolve, reject) => {

        if(token !== null) {

          // Köferinger id: ea457111-b3f1-4c73-a8ae-cb1cbaf6d244

          graphClient.api('/me/joinedTeams').version('beta').get().then((result: any) => {

            for(let Eintrag of result.value) {

              this.Teamsliste.push(Eintrag);
            }

            resolve(true);

          }).catch((error: GraphError) => {

            debugger;

            reject(error);
          });
        }
        else {

          reject(false);
        }
      });


    } catch (error) {


      this.Debug.ShowErrorMessage(error, 'Graph', 'GetUserteams', this.Debug.Typen.Page);
    }
  }



  public async GetOtherUserteams(userid: string): Promise<Teamsstruktur[]> {

    try {

      let Observer: Observable<any>;
      let Liste: Teamsstruktur[];
      let Daten: { UserID : string } = { UserID: userid };

      let Url: string = this.Pool.CockpitserverURL + '/userteams';

      return new Promise((resolve, reject) => {

        Observer = this.http.put(Url, Daten);

        Observer.subscribe({

          next: (ne) => {

            Liste = ne.value;
          },
          complete: () => {

            resolve(Liste);
          },
          error: (error: HttpErrorResponse) => {

            reject(error);
          }
        });
      });


    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Graph', 'GetOtherUserteams', this.Debug.Typen.Page);
    }
  }

  public async JoinTeams(teamsid: string, userid: string): Promise<Teamsstruktur[]> {

    try {

      let Observer: Observable<any>;
      let Liste: Teamsstruktur[];
      let Daten: {
        UserID : string;
        TeamsID: string;
      } = { UserID: userid, TeamsID: teamsid };

      let Url: string = this.Pool.CockpitserverURL + '/addteamsmember';

      return new Promise((resolve, reject) => {

        Observer = this.http.put(Url, Daten);

        Observer.subscribe({

          next: (ne) => {

            Liste = ne.value;
          },
          complete: () => {

            resolve(Liste);
          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Graph', 'GetOtherUserteams', this.Debug.Typen.Page);
    }
  }



  public async TestGraph() {

    try {

      let token = await this.AuthService.RequestToken('user.read');
      let GroupID: string = "632cc6c8-51d5-4219-8092-ed10a792e715"; // Eggolsheim

      const graphClient = Client.init({ authProvider: (done: AuthProviderCallback) => {

          done(null, token);
        }
      });

      return new Promise((resolve, reject) => {

        if(token !== null) {

          // graphClient.api('/me/memberOf').get().then((result: any) => {

          // me/registeredDevices
          // /me/ownedObjects
          // /me/followedSites
          // /me/joinedTeams

          // /groups/ea457111-b3f1-4c73-a8ae-cb1cbaf6d244/drive/items/root/children
          graphClient.api('/groups/' + GroupID + '/drive/root:/General/11 Jour Fixe').version('beta').get().then((result: any) => {
          // graphClient.api('/groups/ea457111-b3f1-4c73-a8ae-cb1cbaf6d244/drive/items/root/children').version('beta').get().then((result: any) => {

            debugger;

            resolve(true);

          }).catch((error: GraphError) => {


            debugger;

            reject(error);
          });
        }
        else {

          reject(false);
        }
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Graph', 'TestGraph', this.Debug.Typen.Service);
    }
  }

  public async TeamsCheckFileExists(teamsid: string, directoryid: string, filename: string): Promise<boolean> {

    try {

      let token = await this.AuthService.RequestToken('user.read');
      let FileExists: boolean = false;
      let Fileeintrag: Teamsfilesstruktur;

      const graphClient = Client.init({ authProvider: (done: AuthProviderCallback) => {

          done(null, token);
        }
      });

      directoryid = directoryid.replace('ROOT:', '');

      return new Promise((resolve, reject) => {

        if(token !== null) {

          graphClient.api("/groups/" + teamsid + "/drive/items/" + directoryid + "/children").get().then((result: any) => { // Fileliste abrufen

            for(Fileeintrag of result.value) {

              if(lodash.isUndefined(Fileeintrag.folder)) { // Prüfen das Eintrag keine Directory

                if(Fileeintrag.name === filename) { // Filenamen prüfen auf Übereinstimmung

                  FileExists = true;
                }
              }
            }

            resolve(FileExists);

          }).catch((error: GraphError) => {

            reject(error);
          });
        }
        else {

          reject(false);
        }
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Graph', 'TeamsCheckFileExists', this.Debug.Typen.Service);
    }
  }

  public async GetTeamsSubDirectory(teamsid: string, dirid: string): Promise<Teamsfilesstruktur> {

    try {

      let token = await this.AuthService.RequestToken('user.read');

      const graphClient = Client.init({ authProvider: (done: AuthProviderCallback) => {

          done(null, token);
        }
      });

      return new Promise((resolve, reject) => {

        if(token !== null) {

          graphClient.api('/groups/' + teamsid + '/drive/items/' + dirid).get().then((result: Teamsfilesstruktur) => {

            debugger;

            resolve(result);

          }).catch((error: GraphError) => {


            debugger;

            resolve(null);
          });
        }
        else {

          reject(null);
        }
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Graph', 'GetTeamsSubDirectory', this.Debug.Typen.Service);
    }
  }

  public async GetTeamsRootDirectory(teamsid: string): Promise<Teamsfilesstruktur> {

    try {

      let token = await this.AuthService.RequestToken('user.read');

      const graphClient = Client.init({ authProvider: (done: AuthProviderCallback) => {

          done(null, token);
        }
      });

      return new Promise((resolve, reject) => {

        if(token !== null) {

          graphClient.api('/groups/' + teamsid + '/drive/root').get().then((result: Teamsfilesstruktur) => {

            resolve(result);

          }).catch((error: GraphError) => {



            resolve(null);
          });
        }
        else {

          reject(null);
        }
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Graph', 'GetTeamsRootDirectory', this.Debug.Typen.Service);
    }
  }

  public async GetAllUsers(): Promise<Graphuserstruktur[]> {

    try {

      let Userliste: Graphuserstruktur[] = [];
      let Valueliste: any[]    = [];
      let data: any;
      let nexturl: any;
      let count: number = 0;
      let token = await this.AuthService.RequestToken('User.ReadBasic.All'); // Der Scope ist so richtig und muss in der app.module.de in der Scopliste eingetragens ein

      const graphClient = Client.init({ authProvider: (done: AuthProviderCallback) => {

          done(null, token);
        }
      });

      data = await graphClient.api('/users').count().get();

      if(!lodash.isUndefined(data['@odata.count'])) count = data['@odata.count'];

      if(!lodash.isUndefined(data.value)) {

        Valueliste.push(data.value);

        if(!lodash.isUndefined(data['@odata.nextLink'])) {

          do {

            nexturl = data['@odata.nextLink'];
            data    = await graphClient.api(nexturl).get();

            if(!lodash.isUndefined(data.value)) Valueliste.push(data.value);

          }
          while(!lodash.isUndefined(data['@odata.nextLink']));

          if(!lodash.isUndefined(data.value)) Valueliste.push(data.value);
        }
      }

      for(let Liste of Valueliste) {

        for(let Eintrag of Liste) {

          Userliste.push(Eintrag);
        }
      }

      Userliste = lodash.filter(Userliste, (currentuser: Graphuserstruktur) => {

        return currentuser.mail !== null && currentuser.givenName !== null && currentuser.surname !== null;
      });

      return Promise.resolve(Userliste);

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Graph', 'GetAllUsers', this.Debug.Typen.Service);
    }
  }

  public async GetTeamsMitglieder(teamsid: string): Promise<Teamsmitgliederstruktur[]> {

    try {

      let Liste: Teamsmitgliederstruktur[] = [];
      let token = await this.AuthService.RequestToken('user.read');


      let GroupID: string = "2d2ff358-7380-442c-8fdc-b91c3df8baa5";

      const graphClient = Client.init({ authProvider: (done: AuthProviderCallback) => {

          done(null, token);
        }
      });

      return new Promise((resolve, reject) => {

        if(token !== null) {

          graphClient.api('/teams/' + teamsid + '/members').get().then((result: any) => {

            if(!lodash.isUndefined(result.value)) {

              Liste = <Teamsmitgliederstruktur[]>result.value;

              for(let Eintrag of Liste) {

                Eintrag.UserImageSRC = null;
              }
            }

            Liste = lodash.filter(Liste, (Mitglied: Teamsmitgliederstruktur) => {

              return Mitglied.email !== 'microsoft@burnicklgroup.onmicrosoft.com';
            });

            resolve(Liste);

          }).catch((error: GraphError) => {


            debugger;

            reject(error);
          });
        }
        else {

          reject(false);
        }
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Graph', 'GetTeamsMitglieder', this.Debug.Typen.Service);
    }
  }


  public async TestSites(): Promise<any> {

    try {

      let token = await this.AuthService.RequestToken('Sites.ReadWrite.All');

      let headers: HttpHeaders = new HttpHeaders({

        'content-type': 'application/json',
        'authorization': token
      });

      return new Promise((resolve, reject) => {

        let SitesObservable = this.Http.get(this.Pool.CockpitserverURL + '/sites', { headers: headers });

        SitesObservable.subscribe({

          next: (data) => {

            debugger;

            //  this.Gesamtprojektliste = <Projektestruktur[]>data;
          },
          complete: () => {

            /*

            for(let Projekt of this.Gesamtprojektliste) {

              if(lodash.isUndefined(Projekt.Projektfarbe)) Projekt.Projektfarbe = 'Burnicklgruen';

              for(let Beteiligter of Projekt.Beteiligtenliste) {

                if(lodash.isUndefined(Beteiligter.Fachfirmentyp)) Beteiligter.Fachfirmentyp = 0;
              }
            }

            this.GesamtprojektelisteChanged.emit();

            resolve(true);


             */

          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });

      /*


      let data: any;
      let IDListe: string[] = [];
      let FolderID: string = 'b!XZkHnfB1aUS9CAl7ACx42jN1tORayIZBnpNxgMZWN2yIJmx4iz54T59g6GswaFyl';

      let token = await this.AuthService.RequestToken('Sites.ReadWrite.All');

      const graphClient = Client.init({ authProvider: (done: AuthProviderCallback) => {

          done(null, token);
        }
      });

      // GET /me/joinedTeams
      // GET /me/memberOf

      if(token !== null) {

        data = await graphClient.api('/sites').get();

        debugger;

        data.value.forEach((Eintrag) => {

          if(Eintrag.name === 'Dokumente') {

            debugger;
          }
          console.log(Eintrag.name);
        });
        // debugger;
      }
      else {

        return Promise.reject(false);
      }

       */

    } catch (error) {

      debugger;

      this.Debug.ShowErrorMessage(error, 'Graph', 'TestSites', this.Debug.Typen.Service);
    }
  }

  public async SendMail(): Promise<any> {

    try {

      let data: any;

      let token = await this.AuthService.RequestToken('Mail.Send');

      const graphClient = Client.init({ authProvider: (done: AuthProviderCallback) => {

          done(null, token);
        }
      });

      // GET /me/joinedTeams
      // GET /me/memberOf

      if(token !== null) {

        const sendMail = {
          message: {
            subject: 'Hello World',
            body: {
              contentType: 'Text',
              content: 'Ein erster Test.'
            },
            toRecipients: [
              {
                emailAddress: {
                  address: 'p.hornburger@gmail.com'
                }
              }
            ],
          },
          saveToSentItems: 'true'
        };

        /*

                    ccRecipients: [
              {
                /*
                emailAddress: {
                  address: 'danas@contoso.onmicrosoft.com'
                }

                 */



        data = await graphClient.api('/me/sendMail').post(sendMail);

        debugger;
      }
      else {

        return Promise.reject(false);
      }

    } catch (error) {

      debugger;

      this.Debug.ShowErrorMessage(error, 'Graph', 'SendMail', this.Debug.Typen.Service);
    }
  }



  public async GetOwnUserimage(): Promise<any> {

    try {

      let token = await this.AuthService.RequestToken('user.read');

      const graphClient = Client.init({ authProvider: (done: AuthProviderCallback) => {

          done(null, token);
        }
      });

      const headers = {
        'Content-Type': 'image/jpeg'
      };

      return new Promise((resolve, reject) => {

        if(token !== null) {

          graphClient.api('/me/photo/$value').headers(headers).responseType(ResponseType.BLOB).get().then((result: any) => {

            this.UserimageSRC = this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(result));

            resolve(true);

          }).catch((error: GraphError) => {

            switch (error.statusCode) {

              case 404: // Not found

                this.UserimageSRC = null;

                resolve(true);

                break;

              default:

                debugger;

                break;
            }

            reject(error);
          });
        }
        else {

          reject(false);
        }

      });

    } catch (error) {

      debugger;

      this.Debug.ShowErrorMessage(error, 'Graph', 'GetOwnUserinfo', this.Debug.Typen.Service);
    }
  }

  public async GetOtherUserimage(userid: string): Promise<any> {

    try {

      let token = await this.AuthService.RequestToken('user.read');
      let UserImageSRC;

      const graphClient = Client.init({ authProvider: (done: AuthProviderCallback) => {

          done(null, token);
        }
      });

      const headers = {
        'Content-Type': 'image/jpeg'
      };

      return new Promise((resolve, reject) => {

        if(token !== null) {

          graphClient.api('/users/' + userid + '/photo/$value').headers(headers).responseType(ResponseType.BLOB).get().then((result: any) => {

            UserImageSRC = this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(result));

            resolve(UserImageSRC);

          }).catch((error: GraphError) => {

            switch (error.statusCode) {

              case 404: // Not found

                UserImageSRC = null;

                resolve(UserImageSRC);

                break;

              default:

                debugger;

                break;
            }

            reject(error);
          });
        }
        else {

          reject(false);
        }

      });

    } catch (error) {

      debugger;

      this.Debug.ShowErrorMessage(error, 'Graph', 'GetOwnUserinfo', this.Debug.Typen.Service);
    }
  }
}