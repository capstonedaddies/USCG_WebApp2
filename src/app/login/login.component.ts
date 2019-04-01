import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private _service: HttpService) { }

  lat: number;
  long: number;
  zoom: number = 5;
  mLat: number;
  mLong: number;
  location: {};

  ngOnInit() {
    this.lat = 36.975875;
    this.long = -74.5;
    this.mLat = 36.9168;
    this.mLong = -76.1897;
    // this._service.getLocation().subscribe(data => {
    //   console.log(data);
    // })

  }

}
