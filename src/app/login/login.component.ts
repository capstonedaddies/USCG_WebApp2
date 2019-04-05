import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { LocalStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private _service: HttpService,private _router: Router, private localStorage: LocalStorageService) { }

  lat: number;
  long: number;
  zoom: number = 5;
  mLat: number;
  mLong: number;
  location: {};
  user: any;
  myShips: any;
  shipKeys: any;
  
  ngOnInit() {
    this.lat = 36.975875;
    this.long = -74.5;
    this.mLat = 36.9168;
    this.mLong = -76.1897;
    this.getUserData();
    this.user;
    // this._service.ships.then((data) => {
    //   this.myShips = data;
    //   console.log('in the login component',data)
    // })
    this.getShipData();
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
    this._service.ships.then((data) => {
      // Get ships from DB
      let ships = data;
      // Get list of keys
      this.shipKeys = Object.keys(ships)
      console.log(this.shipKeys);
      for(var i=0;i<this.shipKeys.length;i++){
        // CAN USE FORLOOP HERE TO PUSH EACH SHIP OBJECT INTO ARRAY
        var Key = this.shipKeys[i];
        this.myShips.push(ships[Key])
      }
    })
    console.log(this.myShips)
  }

  clickMe(){
    console.log('i got got')
  }

}
