import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html',
  styleUrls: ['./change-email.component.scss']
})
export class ChangeEmailComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, public authservice: AuthService) { }
  response = 'NULL';
  changeEmailForm: FormGroup;
  submitted_email = false;

  ngOnInit() {
    this.changeEmailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      confirmEmail: ['']
    }, { validator: this.checkEmails });
  }

  get form_email() { return this.changeEmailForm.controls; }
  get response_msg() { return this.response; }

  // custom validator for checking emails
  checkEmails(group: FormGroup) {
    const email = group.controls.email.value;
    const confirmEmail = group.controls.confirmEmail.value;

    return email === confirmEmail ? null : { notSame: true };
  }

  onSubmitEmail(form: NgForm) {
    this.submitted_email = true;

    if (this.changeEmailForm.invalid) {
      return;
    }

    this.authservice.changeEmail(form.value.email).then((res) => {
      console.log(res);
      this.response = 'complete_email';
    }).catch((error) => {
      console.log(error.error.message);
      if (error.error.message === 'Duplicate Found') {
        this.response = 'duplicate';
      } else {
        this.response = 'fatal_error';
      }
    });
  }
}
