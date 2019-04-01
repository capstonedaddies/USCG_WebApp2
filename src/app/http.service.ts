import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from '../environments/environment';

interface Location {
  latitude: string;
  longitude: string;
}

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private _http: HttpClient, private _Auth: AngularFireAuth, private _db: AngularFireDatabaseModule) { }

  login(data){
    let response = this._Auth.auth.signInWithEmailAndPassword(data.email, data.password);
    // if()
    console.log(response);
    return data;
  }



  // getLocation(){
  //   return this._http.get<Location>('https://maps.googleapis.com/maps/api/js?key='+environment.apiKey+'&callback=initMap');
  // }

}
