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
    this.editProfileForm = this.formBuilder.group({
      birthYear: [''],
      email: ['', Validators.required],
      phoneNumber: [''],
      facebook: [''],
      instagram: [''],
      twitter: [''],
      birthYearHidden: [Boolean],
      emailHidden: [Boolean],
      phoneNumberHidden: [Boolean],
      facebookHidden: [Boolean],
      instagramHidden: [Boolean],
      twitterHidden: [Boolean],
  });
    this.userService.getAccountInfo().then((res) => {
      this.account = new Account(res);
      this.username = this.account.username;
      console.log("EMAIL: "+ this.account.email);
      document.getElementById("usernameLabel").innerHTML=this.account.username;
      this.editProfileForm.get("email").setValue(this.account.email);
      this.editProfileForm.get("birthYearHidden").setValue(this.account.birthYearHidden);
  this.editProfileForm.get("emailHidden").setValue(this.account.emailHidden);
  this.editProfileForm.get("phoneNumberHidden").setValue(this.account.phoneNumberHidden);
  this.editProfileForm.get("facebookHidden").setValue(this.account.facebookHidden);
  this.editProfileForm.get("instagramHidden").setValue(this.account.instagramHidden);
  this.editProfileForm.get("twitterHidden").setValue(this.account.twitterHidden);
      if(this.account.birthYear!=undefined && !this.account.birthYearHidden)
      {
        this.editProfileForm.get("birthYear").setValue(this.account.birthYear);
      }
      if(this.account.phoneNumber!=undefined && !this.account.phoneNumberHidden)
      {
        this.editProfileForm.get("phoneNumber").setValue(this.account.phoneNumber);
      }
      if(this.account.facebook!=undefined && !this.account.facebookHidden)
      {
        this.editProfileForm.get("facebook").setValue(this.account.facebook);
      }
      if(this.account.instagram!=undefined && !this.account.instagramHidden)
      {
        this.editProfileForm.get("instagram").setValue(this.account.instagram);
      }
      if(this.account.twitter!=undefined && !this.account.twitterHidden)
      {
        this.editProfileForm.get("twitter").setValue(this.account.twitterHidden);
      }
  //    console.log("Username is " + this.username);
    //  document.getElementById("usernameLabel").innerHTML=this.account.username;
      //document.getElementById("email").setAttribute("placeholder",this.account.email);      
     
  });

    

  
 
 /* if(this.account.birthYearHidden!=true)
  {
    this.editProfileForm.get("birthYearHidden").setValue(false);
  }
  else{}
  if(this.account.emailHidden!=true)
  {
    this.editProfileForm.get("emailHidden").setValue(false);
  }*/
  
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

  submitStuff(){
      //backend routes //look in change email
      
  }

  async onSubmitEditProfile(form: NgForm) {
    console.log("WE ARE HERE");
      this.submitted = true;
      if (this.editProfileForm.invalid) {
          return;
      }
      // NEEDS finishing
      console.log(this.response);
  }
}
