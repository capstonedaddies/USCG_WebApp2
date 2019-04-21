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
  messages: any;

  constructor(private _http: HttpClient,
    private localStorage: LocalStorageService,
    ) { 
      fb.initializeApp(environment.firebase);
      this.ships = this.getLocations();
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

  async getLocations(){
    return await fb.database().ref('user_locations')
    .once('value').then((snapshot) => {
      return snapshot.val();
    })
  }

  async sendMessage(uid, data){
    data.name = this.getUser().displayName;
    fb.database().ref('user_locations/'+uid+'/messages').push(data);
    this.messages = this.getMessages(uid);
    return this.messages;
  }

  async getMessages(uid){
    return await fb.database().ref('user_locations/'+uid+'/messages')
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
