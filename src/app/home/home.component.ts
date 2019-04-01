import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  login: FormGroup;
  errors: '';
  
  //FIX ERRORS from service

  constructor(private _httpService: HttpService, private fb: FormBuilder, private _router: Router) {

    this.login = fb.group({
      email: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      errors: ''
    });

  }

  Login(post){
    let user = this._httpService.login(post);
    if(user.errors.length > 1){
      this.errors = user.errors
    }
    else {
      this._router.navigate(['/login']);
    }
    // user.subscribe(data => {
    //   if('errors' in data){
    //     console.log(data);
    //     this.errors = data.errors;
    //   }
    //   else {
    //     this._router.navigate(['/login']);
    //   }
    // }); //end subscribe
  }

  ngOnInit() {
  }

}
