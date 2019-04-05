import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from 'ngx-webstorage';
import * as fb from 'firebase';
import 'firebase/database';
import { environment } from '../environments/environment';

interface Location {
  latitude: string;
  longitude: string;
}

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  ships: any;

  constructor(private _http: HttpClient,
    private localStorage: LocalStorageService,
    ) { 
      fb.initializeApp(environment.firebase);
      this.ships = this.getLocations();
      // this.ships.then((data) => {
      //   console.log(data);
      // });
    }

  login(data){
    let response = fb.auth().signInWithEmailAndPassword(data.email, data.password);
    response.then(newData => {
      let thisUser = {
        'email': newData.user.email,
        'displayName': newData.user.displayName,
        'uid': newData.user.uid
      }
      this.localStorage.store('user', thisUser);
    }).catch(error => {
      console.log(error);
    })
    return response;
  }

  getUser(){
    let thisUser = this.localStorage.retrieve('user');
    return thisUser;
  }

  // getLocations(){
  //   return fb.database().ref('user_locations')
  //   .on('value', this.gotData, this.gotErr)
  // }
  // gotData(data){
  //   let ships = data.val();
  //   let keys = Object.keys(ships)
  //   console.log(keys);
  //   for(var i=0;i<keys.length;i++){
  //     var Key = keys[i];
  //     console.log(ships[Key])
  //   }
  //   return ships;
  // }
  // gotErr(err){
  //   console.log('ERROR', err)
  // }

  async getLocations(){
    return await fb.database().ref('user_locations')
    .once('value').then((snapshot) => {
      return snapshot.val();
    })
  }

}

// add to top of login form to create a user with whatever you put in. cheers!

// fb.auth().createUserWithEmailAndPassword(data.email, data.password)
//   .then((userCredentials)=>{
//       if(userCredentials.user){
//         userCredentials.user.updateProfile({
//           displayName: 'Sean Casaus'
//         }).then((s)=> {
//           console.log(s)
//         })
//       }
// })
