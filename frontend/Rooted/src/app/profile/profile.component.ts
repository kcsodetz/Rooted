import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from "../services/auth.service";
import { BehaviorSubject } from 'rxjs';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Account } from '../models/account.model'


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  userAuthed: Boolean;
  account: Account;
  username: String = "User";
  private loggedIn = new BehaviorSubject<boolean>(false); 
  editProfileForm: FormGroup;
  response: string;
  submitted = false;
  constructor(private userService: UserService, public authService: AuthService, private formBuilder: FormBuilder, private _router: Router) {

  }
  ngOnInit() {
    if(this.authService.autoAuthUser()){
      this.userAuthed = true;
    }

    this.userService.getAccountInfo().then((res) => {
      this.account = new Account(res);
      this.username = this.account.username;
  });

    this.editProfileForm = this.formBuilder.group({
      birthYear: [''],
      email: ['', Validators.required],
      phoneNumber: [''],
      facebook: [''],
      instagram: [''],
      twitter: [''],
  });
  }

  get form() { return this.editProfileForm.controls; }

  get response_msg() { return this.response; }

  async onSubmitEditProfile(form: NgForm) {
      this.submitted = true;
      if (this.editProfileForm.invalid) {
          return;
      }
      // NEEDS finishing
      console.log(this.response);
  }
}
