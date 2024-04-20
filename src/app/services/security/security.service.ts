import { Injectable } from '@angular/core';
import {CanLoad, Route, UrlSegment, UrlTree} from "@angular/router";
import {Observable} from "rxjs";
import {DatabasePoolService} from "../database-pool/database-pool.service";

@Injectable({
  providedIn: 'root'
})
export class SecurityService implements CanLoad {

  constructor(private Pool: DatabasePoolService) { }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if(this.Pool.Mitarbeiterdaten !== null && this.Pool.Mitarbeiterdaten.Planeradministrator === true) return false;
    else return false;
  }
}
