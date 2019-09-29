import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { NgForm, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  editProfileForm: FormGroup;
  response: string;
  submitted = false;
  constructor(private userService: UserService, private formBuilder: FormBuilder, private _router: Router) {

  }
  ngOnInit() {
    this.editProfileForm = this.formBuilder.group({
      birthYear: [''],
      email: ['', Validators.required],
      phoneNumber: [''],
      facebook: [''],
      instagram: [''],
      twitter: [''],
  });
  }

  get form() { return this.editProfileForm.controls }

  get response_msg() { return this.response; }

  async onSubmitEditProfile(form: NgForm) {
      this.submitted = true;
      if (this.editProfileForm.invalid) {
          return;
      }
      //NEEDS finishing
      console.log(this.response)
  }


}
