import {EventEmitter, Inject, Injectable} from '@angular/core';
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
import {DatabasePoolService} from "../database-pool/database-pool.service";
import {Teamsstruktur} from "../../dataclasses/teamsstruktur";
import {Teamsfilesstruktur} from "../../dataclasses/teamsfilesstruktur";
import {Teamsdownloadstruktur} from "../../dataclasses/teamsdownloadstruktur";
import {Teamsmitgliederstruktur} from "../../dataclasses/teamsmitgliederstruktur";
import moment, {Moment} from "moment";
// import {DatabaseOutlookemailService} from "../database-email/database-outlookemail.service";
import {BasicsProvider} from "../basics/basics";
import {Outlookemailadressstruktur} from "../../dataclasses/outlookemailadressstruktur";

@Injectable({
  providedIn: 'root'
})
export class Graphservice {

  public ImageZoomOut: EventEmitter<any> = new EventEmitter<any>();

  public Graphuser: Graphuserstruktur;
  public Teamsliste: Teamsstruktur[];
  public UserimageSRC: any;
  public TeamsRootfilelist: Teamsfilesstruktur[];
  public TeamsCurrentfilelist: Teamsfilesstruktur[];
  public TeamsSubdirectorylist: Teamsfilesstruktur[];
  public CurrentTeamsID: string;
  // public Outlookkontakteliste: Outlookkontaktestruktur[];
  public CurrentPDFDownload: Teamsdownloadstruktur;
  public KalenderKW: number;
  // public Outlookpresetcolors:Outlookpresetcolorsstruktur[];
  private BAESiteID: string;
  public FilebrowserModus: string;
  public FilebrowserModusvarianten = {

    Alle_Projekte:   'Alle_Projekte',
    Current_Projekt: 'Current_Projekt'
  };


  constructor(
              @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
              private Debug: DebugProvider,
              private Const: ConstProvider,
              private AuthService: DatabaseAuthenticationService,
              private Tools: ToolsProvider,
              public Basics: BasicsProvider,
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
      // this.Outlookkontakteliste  = [];
      this.FilebrowserModus      = this.FilebrowserModusvarianten.Alle_Projekte;
      this.KalenderKW            = moment().locale('de').isoWeek();
      /*
      this.Outlookpresetcolors   = [

        { Name: 'none',     Value: 'none',    Fontcolor: 'white' },
        { Name: 'Preset0',  Value: '#dc626d', Fontcolor: 'black' }, // Red
        { Name: 'Preset1',  Value: '#e8825d', Fontcolor: 'black' },
        { Name: 'Preset2',  Value: '#ffcd8f', Fontcolor: 'black' }, // Brown
        { Name: 'Preset3',  Value: '#5f5f58', Fontcolor: 'white' }, // Yellow
        { Name: 'Preset4',  Value: '#52ce90', Fontcolor: 'black' }, // Green
        { Name: 'Preset5',  Value: '#57d2da', Fontcolor: 'white' }, // Teal
        { Name: 'Preset6',  Value: '#5c5f53', Fontcolor: 'white' }, // Olive
        { Name: 'Preset7',  Value: '#5ca9e5', Fontcolor: 'white' },  // Blue
        { Name: 'Preset8',  Value: '#53525a', Fontcolor: 'white' }, // Purple
        { Name: 'Preset9',  Value: '#ee5fb7', Fontcolor: 'black' },
        { Name: 'Preset10', Value: '#c5ced1', Fontcolor: 'white' }, // 'Steel'
        { Name: 'Preset11', Value: '#5d6567', Fontcolor: 'white' },
        { Name: 'Preset12', Value: '#c3c5bb', Fontcolor: 'white' },
        { Name: 'Preset13', Value: '#9fadb1', Fontcolor: 'white' },
        { Name: 'Preset14', Value: '#8f8f8f', Fontcolor: 'white'}, // Black
        { Name: 'Preset15', Value: '#ac4e5e', Fontcolor: 'black' },
        { Name: 'Preset16', Value: '#df8e64', Fontcolor: 'white' },
        { Name: 'Preset17', Value: '#bc8f6f', Fontcolor: 'white' },
        { Name: 'Preset18', Value: '#dac257', Fontcolor: 'black' },
        { Name: 'Preset19', Value: '#4ca64c', Fontcolor: 'white' },
        { Name: 'Preset20', Value: '#4bb4b7', Fontcolor: 'white' },
        { Name: 'Preset21', Value: '#85b44c', Fontcolor: 'white' }, // DarkOlive
        { Name: 'Preset22', Value: '#4179a3', Fontcolor: 'white' }, // DarkBlue
        { Name: 'Preset23', Value: '#8f6fbc', Fontcolor: 'white' },
        { Name: 'Preset24', Value: '#c34e98', Fontcolor: 'black' },

        { Name: 'PresetFeiertag', Value: '#b0d6f2', Fontcolor: 'black' },
      ];

       */

      this.BAESiteID = 'baeeu.sharepoint.com,1b93d6ea-3f8b-4416-9ff1-a50aaba6f8ca,134790cc-e062-4882-ae5e-18813809cc87'; // Projekte Seite


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Graph', 'constructor', this.Debug.Typen.Service);
    }
  }


  /*
  public async GetOwnOutlookcontacts(withemailonly: boolean): Promise<any> {

    try {

      let Valueliste: any[]    = [];
      let data: any;
      let nexturl: any;
      let count: number = 0;
      let Eintrag: Outlookkontaktestruktur;

      let token = await this.AuthService.RequestToken('Contacts.ReadWrite');

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
  */

  /*

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
        FirmaID: null,
        Email: kontakt.emailAddresses.length > 0 ? kontakt.emailAddresses[0].address : '',
        Possition: kontakt.profession,
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
  */

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

                // this.AuthService.AccessTokenExpired = true;
                this.AuthService.UnsetActiveUser();

                this.Tools.SetRootPage(this.Const.Pages.HomePage);

                break;

              default:

                // debugger;

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

  /*

  public async GetOwnOutlookCategories(): Promise<Outlookkategoriesstruktur[]> {

    try {

      let token = await this.AuthService.RequestToken('MailboxSettings.Read');
      let data: any;
      let Liste: Outlookkategoriesstruktur[] = [];

      const graphClient = Client.init({ authProvider: (done: AuthProviderCallback) => {

          done(null, token);
        }
      });

      try {

        data = await graphClient.api('/me/outlook/masterCategories').get();

        if(!lodash.isUndefined(data.value)) {

          for(let Eintrag of data.value) {

            Liste.push(Eintrag);

            console.log(Eintrag.id);
          }
        }

        Liste.push({

          displayName: 'Feiertag',
          id:          'feiertrag',
          color:       'PresetFeiertag'
        });

        Liste.sort( (a: Outlookkategoriesstruktur, b: Outlookkategoriesstruktur) => {

          if (a.displayName < b.displayName) return -1;
          if (a.displayName > b.displayName) return 1;
          return 0;
        });

        return Liste;
      }
      catch(error: any) {

        return error;
      }
    }
    catch (error)  {

      this.Debug.ShowErrorMessage(error, 'Graph', 'GetOwnOutlookCategories', this.Debug.Typen.Service);
    }
  }


   */

  /*

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

   */

  public GetEmptyTeamsfile() {

    try {

      return  {
        cTag: "",
        createdBy:
          {
            user:
              {
                displayName: "",
                email: "",
                id: ""
              }
            },
        createdDateTime: "",
        eTag: "",
        fileSystemInfo:
          {
            createdDateTime: "",
            lastModifiedDateTime: ""
          },
        id: "",
        lastModifiedBy: {},
        lastModifiedDateTime: "",
        name: "",
        parentReference:
          {
            driveId: "",
            driveType: "",
            id: "",
            path: ""
          },
        shared: {scope: ""},
        size: 0,
        webUrl: ""
      };

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Graph', 'GetEmptyTeamsfile', this.Debug.Typen.Service);
    }
  }

  public async GetSiteSubdirictoryfilelist(file: Teamsfilesstruktur, showfiles: boolean): Promise<any> {

    try {

      let token = await this.AuthService.RequestToken('user.read');
      let Eintrag: Teamsfilesstruktur;
      let Dateiliste: Teamsfilesstruktur[] = [];
      let Verzeichnisliste: Teamsfilesstruktur[] = [];

      this.TeamsRootfilelist     = [];
      this.TeamsCurrentfilelist  = [];

      const graphClient = Client.init({ authProvider: (done: AuthProviderCallback) => {

          done(null, token);
        }
      });

      return new Promise((resolve, reject) => {

        if(token !== null) {

          graphClient.api('/sites/' + this.BAESiteID + '/drive/items/' + file.id + '/children').get().then((result: any) => {


            for(Eintrag of result.value) {

              if(lodash.isUndefined(Eintrag.file)) {

                Eintrag.isfolder = true;

                Verzeichnisliste.push(Eintrag);
              }
              else {

                Eintrag.isfolder = false;

                Dateiliste.push(Eintrag);
              }

              // this.TeamsRootfilelist.push(Eintrag);
            }

            Verzeichnisliste.sort((a: Teamsfilesstruktur, b: Teamsfilesstruktur) => {

              if (a.name < b.name) return -1;
              if (a.name > b.name) return  1;

              return 0;
            });

            Dateiliste.sort((a: Teamsfilesstruktur, b: Teamsfilesstruktur) => {

              if (a.name < b.name) return -1;
              if (a.name > b.name) return  1;

              return 0;
            });

            if(showfiles === false) {

              this.TeamsRootfilelist = Verzeichnisliste;
              // this.TeamsRootfilelist = lodash.filter(this.TeamsRootfilelist, {isfolder : true});
            }
            else {

              this.TeamsRootfilelist = Verzeichnisliste;
              this.TeamsRootfilelist = this.TeamsRootfilelist.concat(Dateiliste);

            }

            this.TeamsCurrentfilelist = this.TeamsRootfilelist;

            if(lodash.isUndefined(lodash.find(this.TeamsSubdirectorylist, (eintrag: Teamsfilesstruktur) => {

              return eintrag.id === file.id;

            }))) {

              this.TeamsSubdirectorylist.push(file);
            }
            else {

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

      this.Debug.ShowErrorMessage(error, 'Graph', 'GetSiteSubdirictoryfilelist', this.Debug.Typen.Service);
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

      return new Promise <Teamsdownloadstruktur>((resolve, reject) => {

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

  public async DownloadPDFSiteFile(file: Teamsfilesstruktur): Promise<Teamsdownloadstruktur> {

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

      return new Promise <Teamsdownloadstruktur>((resolve, reject) => {

        if(token !== null) {

          graphClient.api('/sites/' +  this.BAESiteID + '/drive/items/' + file.id + '?select=id,@microsoft.graph.downloadUrl').get().then((result: any) => {

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

      this.Debug.ShowErrorMessage(error, 'Graph', 'DownloadPDFSiteFile', this.Debug.Typen.Service);
    }
  }

  public async DownloadPDFSiteFileViaLink(fileid: string): Promise<Teamsdownloadstruktur> {

    try {

      let token = await this.AuthService.RequestToken('user.read');
      let Link: any =  document.createElement('a');
      let Download: Teamsdownloadstruktur = {

        name: '',
        id: '',
        context: '',
        url: ''
      };

      const graphClient = Client.init({ authProvider: (done: AuthProviderCallback) => {

          done(null, token);
        }
      });

      return new Promise <Teamsdownloadstruktur>((resolve, reject) => {

        if(token !== null) {

          graphClient.api('/sites/' +  this.BAESiteID + '/drive/items/' + fileid + '?select=id,@microsoft.graph.downloadUrl').get().then((result: any) => {

            Download.id      = result.id;
            Download.url     = result['@microsoft.graph.downloadUrl'];
            Download.context = result['@odata.context'];

            this.CurrentPDFDownload = Download;

            document.body.appendChild(Link);

            Link.href = Download.url;

            Link.click();
            Link.remove();

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

      this.Debug.ShowErrorMessage(error, 'Graph', 'DownloadPDFSiteFileViaLink', this.Debug.Typen.Service);
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

      return new Promise <boolean>((resolve, reject) => {

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

  public async SiteCheckFileExists(directoryid: string, filename: string): Promise<boolean> {

    try {

      let token = await this.AuthService.RequestToken('user.read');
      let FileExists: boolean = false;
      let Fileeintrag: Teamsfilesstruktur;

      const graphClient = Client.init({ authProvider: (done: AuthProviderCallback) => {

          done(null, token);
        }
      });

      directoryid = directoryid.replace('ROOT:', '');

      return new Promise <boolean>((resolve, reject) => {

        if(token !== null) {

            graphClient.api('/sites/' + this.BAESiteID + '/drive/items/' + directoryid + '/children').get().then((result: any) => { // Fileliste abrufen

            for(Fileeintrag of result.value) {

              if(lodash.isUndefined(Fileeintrag.folder)) { // Prüfen das Eintrag keine Directory

                if(Fileeintrag.name === filename) { // Filenamen prüfen auf Übereinstimmung

                  FileExists = true;
                }
              }
            }

            resolve(FileExists);

          }).catch((error: GraphError) => {

            resolve(null);
          });
        }
        else {

          reject(false);
        }
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Graph', 'SiteCheckFileExists', this.Debug.Typen.Service);
    }
  }

  public async GetTeamsSubDirectory(teamsid: string, dirid: string): Promise<Teamsfilesstruktur> {

    try {

      let token = await this.AuthService.RequestToken('user.read');

      const graphClient = Client.init({ authProvider: (done: AuthProviderCallback) => {

          done(null, token);
        }
      });

      return new Promise <Teamsfilesstruktur>((resolve, reject) => {

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

  public async GetSiteSubDirectory(dirid: string): Promise<Teamsfilesstruktur> {

    try {

      let token = await this.AuthService.RequestToken('user.read');

      const graphClient = Client.init({ authProvider: (done: AuthProviderCallback) => {

          done(null, token);
        }
      });

      return new Promise <Teamsfilesstruktur>((resolve, reject) => {

        if(token !== null) {

          graphClient.api('/sites/' + this.BAESiteID + '/drive/items/' + dirid).get().then((result: any) => {

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

      this.Debug.ShowErrorMessage(error, 'Graph', 'GetSiteSubDirectory', this.Debug.Typen.Service);
    }
  }

  /*

  public async GetTeamsRootDirectory(teamsid: string): Promise<Teamsfilesstruktur> {

    try {

      let token = await this.AuthService.RequestToken('user.read');

      const graphClient = Client.init({ authProvider: (done: AuthProviderCallback) => {

          done(null, token);
        }
      });

      debugger;

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

   */

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

      return new Promise <Teamsmitgliederstruktur[]>((resolve, reject) => {

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

  public async SendMail(Empfaengerliste: Outlookemailadressstruktur[], Betreff: string, Nachricht: string): Promise<any> {

    try {

      let data: any;

      let token = await this.AuthService.RequestToken('Mail.Send');

      const graphClient = Client.init({ authProvider: (done: AuthProviderCallback) => {

          done(null, token);
        }
      });

      if(this.Basics.DebugNoExternalEmail === true) {

        for(let Eintrag of Empfaengerliste) {

          Eintrag.emailAddress.address = 'p.hornburger@gmail.com';
        }
      }

      if(token !== null) {

        const sendMail = {
          message: {
            subject: Betreff,
            body: {
              contentType: 'html',
              content: Nachricht
            },
            toRecipients: Empfaengerliste,
          },
          saveToSentItems: 'true'
        };


        data = await graphClient.api('/me/sendMail').post(sendMail);

        return Promise.resolve(data);

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
