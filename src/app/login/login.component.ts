import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { LocalStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  message: FormGroup

  constructor(private _service: HttpService, private fb: FormBuilder , private _router: Router, private localStorage: LocalStorageService) {
    // This is the form group that allows the forms to function on the html side
    // Forms work in a different way when using angular, so this is necessary.
    // This also allows for additional functionality such as secure front end validations.
    this.message = fb.group({
      content: ['', [Validators.required, Validators.minLength(1)]],
      name: ''
    });
  }

  lat: number;
  long: number;
  zoom: number = 5;
  mLat: number;
  mLong: number;
  location: {};
  user: any;
  myShips: any;
  shipKeys: any;
  messager: any;
  shipUid: any;
  allKeys: any;
  messageKeys: any;
  myMessages: any;

  // Variables initialized here prior to the page load.
  ngOnInit() {
    this.lat = 36.975875;
    this.long = -74.5;
    this.mLat = 36.9168;
    this.mLong = -76.1897;
    this.getUserData();
    this.user;
    this.getShipData();
    this.messager = {
      name: 'Messanger',
      image: '',
      messages: []
    }
  }

  // Calls the getUser function from the service.ts
  // Checks user object to see if the user is logged in. If email is empty, return to home page.
  // This ensures the correct user is logged in and the page cannot be accessed without credentials.
  getUserData() {
    this.user = this._service.getUser();
    if(!this.user){
      this._router.navigate(['/home']);
    }
    return this.user;
  }

  getShipData(){
    this.myShips = [];
    this.allKeys = [];
    this._service.ships.then((data) => {
      // Get ships from DB
      let ships = data;
      // Get list of keys
      this.shipKeys = Object.keys(ships)
      for(var i=0;i<this.shipKeys.length;i++){
        // CAN USE FORLOOP HERE TO PUSH EACH SHIP OBJECT INTO ARRAY
        let Key = this.shipKeys[i];
        this.allKeys.push(Key);
        this.myShips.push(ships[Key])
      }
      console.log(ships);
    })
  }

  // Function is called when user clicks on a boat. Loads necessary messages and images.
  clickMe(index,ships){
    this.shipUid = this.allKeys[index];
    let result = this.convertObjectToList(ships[index].messages);
    this.messager = {
      name: ships[index].First_Name +" "+ ships[index].Last_Name,
      image: ships[index].Photo,
      messages: result
    };
  }

  // Converts an object with nested objects into a list with objects.
  convertObjectToList(obj) {
    return Object.keys(obj).map(function(key){
      let currElement = [key, obj[key]];
      return currElement;
    });
  }
  
  // Function is called when user enters a new message on the form.
  Messaging(post){
    let newPost = {
      name: '',
      content: post.content
    }
    // Send post data over to service message function
    // When data comes back, convert nested objects to list for display.
    let newMessage = this._service.sendMessage(this.shipUid, newPost);
    newMessage.then((data) => {
      this.messager.messages = this.convertObjectToList(data);
    });
  }

  // Attempt at getting messages asynchronously from db...

  // getMessages(){
  //   let random = this._service.getMessages(this.shipUid);
  //   random.then((data) => {
  //     let messages = data;
  //     console.log(messages);
  //   })
  // }

}
