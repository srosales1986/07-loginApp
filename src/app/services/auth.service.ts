import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../models/user.model';
import { pipe } from 'rxjs';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'https://identitytoolkit.googleapis.com/v1/accounts:';
  private apikey = 'AIzaSyDybMAhGausOXlqHhEFvoHI35dRD3ybSu8';
  userToken: string;

  //Crear nuevo usuario
  //https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

  //Login
  //https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]

  constructor( private http: HttpClient ) {
    this.leerToken();
  }

  logout() {
    localStorage.removeItem('token');
  }

  login( user: UserModel ) {
    const authData = {
      ...user,
      returnSecureToken: true
    };

    return this.http.post(
      `${this.url}signInWithPassword?key=${ this.apikey }`,
      authData
    ).pipe( map(resp => {
      this.saveToken(resp['idToken']);
      return resp;
    }) );
  }

  signup( user: UserModel ) {

    const authData = {
      ...user,
      returnSecureToken: true
    };

    return this.http.post(
      `${this.url}signUp?key=${ this.apikey }`,
      authData
    ).pipe( map(resp => {  
      this.saveToken(resp['expiresIn'], resp['idToken']);
      
      return resp;
    }) );
  }
//Continuar aqui!!!!
  private saveToken( idToken: string, expiresIn?: string ) {

    this.userToken = idToken;
    localStorage.setItem('token', idToken);

    let hoy = new Date();
    console.log(hoy);
    console.log(expiresIn);    
    
    hoy.setSeconds( Number(expiresIn) );
    
    localStorage.setItem('expira', hoy.getTime().toString());
  }

  leerToken() {

    if(localStorage.getItem('token')) {
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }
    return this.userToken;
    
  }

  isAuth(): boolean {

    if (this.userToken.length < 2) {
      return false;
    }
    
    const expira = Number(localStorage.getItem('expira'));
    const expiraDate = new Date();
    expiraDate.setTime(expira);

    if (expiraDate > new Date()) {
      return true;
    } else {
      return false;
    }
  }
}
