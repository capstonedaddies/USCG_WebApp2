import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { LocalStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  message: FormGroup

  constructor(private _service: HttpService, private fb: FormBuilder , private _router: Router, private localStorage: LocalStorageService) {
    this.message = fb.group({
      content: '',
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

  ngOnInit() {
    this.lat = 36.975875;
    this.long = -74.5;
    this.mLat = 36.9168;
    this.mLong = -76.1897;
    this.getUserData();
    this.user;
    this.getShipData();
    this.messager = {
      name: 'Messager',
      image: '',
      messages: []
    }
  }

  getUserData() {
    this.user = this._service.getUser();
    if(this.user.email.length < 2){
      this._router.navigate(['/login']);
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

  clickMe(index,ships){
    console.log(ships);
    console.log(this.allKeys[index]);
    this.shipUid = this.allKeys[index];
    let result = this.convertObjectToList(ships[index].messages);
    this.messager = {
      name: ships[index].First_Name +" "+ ships[index].Last_Name,
      image: ships[index].Photo,
      messages: result
    };
  }

  convertObjectToList(obj) {
    return Object.keys(obj).map(function(key){
      let currElement = [key, obj[key]];
      return currElement;
    });
   }
   
  Messaging(post){
    let newPost = {
      name: '',
      content: post.content
    }
    let newMessage = this._service.sendMessage(this.shipUid, newPost);
    newMessage.then((data) => {
      this.messager.messages = this.convertObjectToList(data);
    });
  }

  // getMessages(){
  //   let random = this._service.getMessages(this.shipUid);
  //   random.then((data) => {
  //     let messages = data;
  //     console.log(messages);
  //   })
  // }

}
