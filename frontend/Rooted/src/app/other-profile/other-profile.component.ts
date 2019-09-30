import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { NgForm, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router'

@Component({
  selector: 'app-other-profile',
  templateUrl: './other-profile.component.html',
  styleUrls: ['./other-profile.component.scss']
})
export class OtherProfileComponent implements OnInit {
  response: string;
  submitted = false;
  constructor(private userService: UserService, private formBuilder: FormBuilder, private _router: Router) {

  }
  ngOnInit() {
    
  }

  get response_msg() { return this.response; }

}
