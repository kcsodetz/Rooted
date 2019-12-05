import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Account } from '../models/account.model';
import { Tree } from '../models/tree.model';

import { AuthService } from '../services/auth.service';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-other-profile',
  templateUrl: './other-profile.component.html',
  styleUrls: ['./other-profile.component.scss']
})
export class OtherProfileComponent implements OnInit {
  response: string;
  account: Account;
  email: string;
  emailHidden: Boolean;
  birthYear: string;
  birthYearHidden: Boolean;
  phoneNumber: string;
  phoneNumberHidden: Boolean;
  facebook: string;
  facebookHidden: Boolean;
  instagram: string;
  instagramHidden: Boolean;
  twitter: string;
  twitterHidden: Boolean;
  username: string;
  myTrees: Tree[];
  profilePicture: string;
  submitted = false;
  isAdmin: Boolean;
  admObj: Object;
  constructor(private route: ActivatedRoute, private userService: UserService, private formBuilder: FormBuilder, private _router: Router, private adminService: AdminService) {

  }
  ngOnInit() {
    let user = this.route.snapshot.params['username'];
  
    this.userService.getAccountInfo().then((res) => {
      this.account = new Account(res);
      if(user==this.account.username)
      {
        window.location.replace("/profile");
        return;
      }
    });
    this.adminService.getAllAdmins().then((res) => {
      this.admObj = res;
      let x = 0;
      while(this.admObj[x]!=undefined){
        if(this.admObj[x++]==this.account.username){
          this.isAdmin = true;
          break;
        }
      }
    });
    this.getUser(user);
    this.displayGroups();
  }

  getUser(user: string) {
   
    
  //  console.log("in getUser: " + user)
    this.userService.getUserProfile(user).then((usr) => {
    //  console.log(usr);
      this.account = new Account(usr);
      this.profilePicture = this.account.profilePictureURL;
      this.username = this.account.username;
      this.email = this.account.email;
      this.emailHidden = this.account.emailHidden;
      //console.log(this.emailHidden);
      this.birthYear = this.account.birthYear;
      this.birthYearHidden = this.account.birthYearHidden;
      this.phoneNumber = this.account.phoneNumber;
      this.phoneNumberHidden = this.account.phoneNumberHidden;
      this.facebook = this.account.facebook;
      this.facebookHidden = this.account.facebookHidden;
      this.instagram = this.account.instagram;
      this.instagramHidden = this.account.instagramHidden;
      this.twitter = this.account.twitter;
      this.twitterHidden = this.account.twitterHidden;
    })

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

  get response_msg() { return this.response; }

  banUser(username: string){
    this.userService.swBanUser(username);
    console.log(username + " banned from the site");
    window.location.replace("/home");
  }

}
