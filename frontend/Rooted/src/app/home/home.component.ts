import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { NgForm, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router'


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
/**
 * Home Page Component
 */
export class HomeComponent implements OnInit {

 
  fileForm: FormGroup;
  image: string;
  submitted = false;

  constructor(private userService: UserService, private formBuilder: FormBuilder, private _router: Router) {}

  /**
   * Init function
   */
  ngOnInit() {
    

  
  }

  /**
   * Pass form to html component
   */
  get form() { return this.fileForm.controls; }

  
  /**
   * Creates a circle 
   * @param form Submission form for creating a circle
   */
  submitFile(form: NgForm) {
    this.submitted = true;
    if (this.fileForm.invalid) {
      console.log(form);
      return;
    }


  }
 
  /**
   * Resets all values for the form when the cancel button is invoked
   */
  cancel() {
    this.submitted = false;
    this.fileForm.reset();
  }

}
