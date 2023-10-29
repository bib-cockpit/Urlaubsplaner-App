 import {EventEmitter, Injectable} from '@angular/core';
import {DebugProvider} from "../debug/debug";
import {DatabasePoolService} from "../database-pool/database-pool.service";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ConstProvider} from "../const/const";
import {Outlookemailstruktur} from "../../dataclasses/outlookemailstruktur";
import moment, {Moment} from "moment/moment";

@Injectable({
  providedIn: 'root'
})
export class DatabaseOutlookemailService {

  public CurrentEmail: Outlookemailstruktur;
  private ServerUrl: string;
  public ShowUngelesenOnly: boolean;
  public Projektsortierung: boolean;
  public Emaildatum: Moment;
  public Heute: Moment;

  constructor(private Debug: DebugProvider,
              private Const: ConstProvider,
              private Pool: DatabasePoolService,
              private http: HttpClient) {
    try {

      this.CurrentEmail          = null;
      this.ServerUrl             = this.Pool.CockpitserverURL + '/email';
      this.ShowUngelesenOnly     = true;
      this.Projektsortierung     = true;

      this.Heute = moment();

      this.Emaildatum = this.Heute.clone().subtract(10, 'days');

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Outlookemail', 'constructor', this.Debug.Typen.Service);
    }
  }


  GetEmail(emailid):Promise<Outlookemailstruktur> {

    try {

      let Email: Outlookemailstruktur;
      let queryParams = new HttpParams({fromObject: {EmailID: emailid}});
      let headers: HttpHeaders = new HttpHeaders({

        'content-type': 'application/json',
      });

      return new Promise((resolve, reject) => {

        let EmailObservable = this.http.get(this.Pool.CockpitserverURL + '/email', { headers: headers, params: queryParams });

        EmailObservable.subscribe({

          next: (data) => {

            Email = <Outlookemailstruktur>data;
          },
          complete: () => {

            resolve(Email);

          },
          error: (error: HttpErrorResponse) => {

            reject(error);
          }
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Outlookemail', 'GetEmail', this.Debug.Typen.Service);
    }
  }

  public AddEmail(): Promise<Outlookemailstruktur> {

    try {

      let Observer: Observable<any>;
      let Email: Outlookemailstruktur;

      return new Promise<any>((resove, reject) => {

        // POST für neuen Eintrag

        Observer = this.http.post(this.ServerUrl, this.CurrentEmail);

        Observer.subscribe({

          next: (result) => {

            Email = result.data;

          },
          complete: () => {


            resove(Email);

          },
          error: (error: HttpErrorResponse) => {

            reject(error);
          }
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Outlookemail', 'AddEmail', this.Debug.Typen.Service);
    }
  }

  UpdateEmail(): Promise<Outlookemailstruktur> {

    try {

      let Observer: Observable<any>;
      let Merker: Outlookemailstruktur;

      return new Promise((resolve, reject) => {

        // PUT für update

        delete this.CurrentEmail.__v;

        Observer = this.http.put(this.ServerUrl, this.CurrentEmail);

        Observer.subscribe({

          next: (ne) => {

            Merker = ne.Email;
          },
          complete: () => {

            if(Merker !== null) {

              resolve(Merker);
            }
            else {

              reject(new Error('Email auf Server nicht gefunden.'));
            }
          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Outlookemail', 'UpdateEmail', this.Debug.Typen.Service);
    }
  }

  public DeleteEmail(): Promise<any> {

    try {

      let Observer: Observable<any>;

      this.CurrentEmail.Deleted = true;

      return new Promise<any>((resove, reject) => {

          // PUT für update

        Observer = this.http.put(this.ServerUrl, this.CurrentEmail);

        Observer.subscribe({

          next: (ne) => {

            debugger;

          },
          complete: () => {

            debugger;


            resove(true);

          },
          error: (error: HttpErrorResponse) => {

            debugger;

            reject(error);
          }
        });
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Database Outlookemail', 'DeleteStandort', this.Debug.Typen.Service);
    }
  }
}
