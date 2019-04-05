import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  login: FormGroup;
  errors: string = '';
  

  constructor(private _httpService: HttpService, private fb: FormBuilder, private _router: Router, private localStorage: LocalStorageService) {
    this.localStorage.clear();
    this.errors = '';
    this.login = fb.group({
      email: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });

  }

  Login(post){
    let user = this._httpService.login(post);
    user.then(() => {
      this._router.navigate(['/login']);
    }).catch(error => {
      if ('message' in error) {
        this.errors = "Incorrect email address or password";
      }
    })
  }

  ngOnInit() {
  }

}
