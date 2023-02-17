import { Injectable } from '@angular/core';
import {DebugProvider} from '../debug/debug';
import {BasicsProvider} from '../basics/basics';
import {ConstProvider} from '../const/const';
// import {Storage} from "@ionic/storage-angular";
import Cookies from 'js-cookie';


const Keys = {

  SecutityToken: 'SecurityToken',
};

@Injectable()
export class LocalstorageService {

  // public MyStorage: Storage;

  constructor(private Debug: DebugProvider,
              private Basics: BasicsProvider,
              // private Storageservice: Storage,
              private Const: ConstProvider) {
    try {

    }
    catch (error) {

      this.Debug.ShowErrorMessage(error, 'LocalstorageService', 'constructor', this.Debug.Typen.Service);
    }
  }

  public GetSecurityToken(): Promise<string> {

    try {

      return new Promise<string>((resolve, reject) => {

        let Wert = Cookies.get(Keys.SecutityToken);

        if(typeof Wert === 'undefined') {

          resolve(this.Const.NONE);
        }
        else {

          resolve(Wert);
        }
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'LocalstorageService', 'GetSecurityToken', this.Debug.Typen.Service);
    }
  }

  public SetSecurityToken(token: string): Promise<boolean> {

    try {

      return new Promise((resolve, reject) => {

        Cookies.set(Keys.SecutityToken, token);

        resolve(true);
        /*
        .then(() => {

          resolve(true);

        }).catch((error) => {

          reject(error);
        });

         */
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'LocalstorageService', 'SetSecurityToken', this.Debug.Typen.Service);
    }
  }

  public RemoveSecurityToken(): Promise<boolean> {

    try {

      return new Promise((resolve, reject) => {

        Cookies.remove(Keys.SecutityToken);

        resolve(true);
        /*
        this.MyStorage.remove(Keys.SecutityToken).then(() => {

          resolve(true);

        }).catch((error) => {

          reject(error);
        });

         */
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'LocalstorageService', 'ClearSecurityToken', this.Debug.Typen.Service);
    }
  }
}
