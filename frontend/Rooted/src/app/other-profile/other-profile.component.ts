import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Account } from '../models/account.model';

@Component({
  selector: 'app-other-profile',
  templateUrl: './other-profile.component.html',
  styleUrls: ['./other-profile.component.scss']
})
export class OtherProfileComponent implements OnInit {
  response: string;
  account: Account;
  email: string;
  birthYear: string;
  phoneNumber: string;
  facebook: string;
  instagram: string;
  twitter: string;
  username: string;
  submitted = false;
  constructor(private route: ActivatedRoute, private userService: UserService, private formBuilder: FormBuilder, private _router: Router) {

  }
  ngOnInit() {
    let user = this.route.snapshot.params['username'];
    this.getUser(user);
  }

  getUser(user: string) {
    console.log("in getUser: " + user)
    this.userService.getUserProfile(user).then((usr) => {
      console.log(usr);
      this.account = new Account(usr);
      this.username = this.account.username;
      this.email = this.account.email;
      this.birthYear = this.account.birthYear;
      this.phoneNumber = this.account.phoneNumber;
      this.facebook = this.account.facebook;
      this.instagram = this.account.instagram;
      this.twitter = this.account.twitter;
    })

  }
  get response_msg() { return this.response; }

}
