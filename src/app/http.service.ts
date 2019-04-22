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

  constructor(private _http: HttpClient, private localStorage: LocalStorageService,) { 
    fb.initializeApp(environment.firebase);
    this.ships = this.getLocations();
  }

  login(data){
    // Set variable to promise to capture the response from the firebase authentication api call.
    let response = fb.auth().signInWithEmailAndPassword(data.email, data.password);
    response.then(newData => {
      let thisUser = {
        'email': newData.user.email,
        'displayName': newData.user.displayName,
        'uid': newData.user.uid
      }
      // stores the above thisUser object in local storage cookie
      this.localStorage.store('user', thisUser);
    }).catch(error => {
      console.log(error);
    })
    return response;
  }

  // returns user object from storage
  getUser(){
    let thisUser = this.localStorage.retrieve('user');
    return thisUser;
  }

  // asynchronous function to get all ships from the database that fall under user_locations
  async getLocations(){
    return await fb.database().ref('user_locations')
    .once('value').then((snapshot) => {
      //returns snapshot from database values
      return snapshot.val();
    })
  }

  // async messaging function. gets uid + data from login.component.ts
  async sendMessage(uid, data){
    // get's name of logged in user for messaging purpose.
    data.name = this.getUser().displayName;
    //pushes data into database under specific uid's message list
    fb.database().ref('user_locations/'+uid+'/messages').push(data);
    this.messages = this.getMessages(uid);
    return this.messages;
  }

  // Grabs all messages under specific UID from Database
  async getMessages(uid){
    return await fb.database().ref('user_locations/'+uid+'/messages')
    .once('value').then((snapshot) => {
      return snapshot.val();
    })
  }

  // This is a TEST async function to try to get continuous data from the database. Not yet functional.
  async getMoreMessages(uid){
    return await fb.database().ref('user_locations/'+uid+'/messages')
    .on('value', snap => {
      return snap.val();
    });
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
