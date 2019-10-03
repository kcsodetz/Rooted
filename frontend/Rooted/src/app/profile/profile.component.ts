import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from "../services/auth.service";
import { BehaviorSubject } from 'rxjs';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TreeService } from '../services/tree.service';
import { Tree } from '../models/tree.model';
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
  myTrees: Tree[];
  constructor(private userService: UserService, public authService: AuthService, private formBuilder: FormBuilder, private _router: Router) {

  }
  ngOnInit() {
    
    if(this.authService.autoAuthUser()){
      this.userAuthed = true;
    }
    this.displayGroups();
    this.userService.getAccountInfo().then((res) => {
      this.account = new Account(res);
      this.username = this.account.username;
      document.getElementById("usernameLabel").innerHTML=this.account.username;
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
  displayGroups(){
    this.userService.getUserTrees().then((data) => {

      let i: number;

      let response = [];
      response.push(data);

      this.myTrees = new Array(response[0].length)

      for (i = 0; i < response[0].length; i += 1) {
        let tree = new Tree(response[0][i])
        if (tree.treeName.length > 18) {
          tree.treeName = tree.treeName.substring(0, 20) + '...'
        }
        this.myTrees[i] = tree;
      }
    });
  }
  renderTree(tree: Tree) {
    /* Navigate to /tree/id  */
    this._router.navigate(['/tree/' + tree.ID]);
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
