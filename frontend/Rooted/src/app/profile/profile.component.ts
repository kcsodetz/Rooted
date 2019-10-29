import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from "../services/auth.service";
import { BehaviorSubject } from 'rxjs';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TreeService } from '../services/tree.service';
import { Tree } from '../models/tree.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Account } from '../models/account.model'
import { ChangeEmailComponent } from '../change-email/change-email.component';
import { fillProperties } from '@angular/core/src/util/property';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profilePictureFileForm: FormGroup;
  userAuthed: Boolean;
  images: Array<Object>;
  account: Account;
  profilePicture: string;
  username: string = "User";
  emaill: string ="";
  private loggedIn = new BehaviorSubject<boolean>(false); 
  editProfileForm: FormGroup;
  response: string;
  rspp: Object;
  submitted = false;
  myTrees: Tree[];
  constructor(private route: ActivatedRoute, private userService: UserService, public authService: AuthService, private formBuilder: FormBuilder, private _router: Router) {
    this.images = []
  }
  ngOnInit() {
    
    if(this.authService.autoAuthUser()){
      this.userAuthed = true;
    }
    this.displayGroups();
    // Form inputs and validators
    this.profilePictureFileForm = this.formBuilder.group({
      profilePictureURL: ['']
    })
    this.editProfileForm = this.formBuilder.group({
      birthYear: [''],
      email: [''],
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
      this.rspp=res;
      // console.log(this.rspp);
      this.username = this.account.username;
      this.profilePicture = this.account.profilePictureURL;
      this.emaill= this.account.email;
      console.log("account: ", this.account);
      // console.log(this.account.twitter.valu)
      // console.log("Email: "+ this.account.email);
      // console.log("Email hidden: "+ this.account.emailHidden);
      // console.log("Birth Year: "+ this.account.birthYear);
      // console.log("Birth year hidden: "+ this.account.birthYearHidden);
      // console.log("phone number: "+ this.account.phoneNumber);
      // console.log("phone number hidden: "+ this.account.phoneNumberHidden);
      // console.log("facebook: "+ this.account.facebook);
      // console.log("facebook hidden: "+ this.account.facebookHidden);
      // console.log("instagram: "+ this.account.instagram);
      // console.log("instagram hidden: "+ this.account.instagramHidden);
      // console.log("twitter: "+ this.account.twitter);
      // console.log("twitter hidden: "+ this.account.twitterHidden);
      // console.log("facebook ", this.account.facebook[value]);

      document.getElementById("usernameLabel").innerHTML=this.account.username;
      this.editProfileForm.get("email").setValue(this.account.email);
      this.editProfileForm.get("birthYearHidden").setValue(this.account.birthYearHidden);
      this.editProfileForm.get("emailHidden").setValue(this.account.emailHidden);
      this.editProfileForm.get("phoneNumberHidden").setValue(this.account.phoneNumberHidden);
      this.editProfileForm.get("facebookHidden").setValue(this.account.facebookHidden);
      this.editProfileForm.get("instagramHidden").setValue(this.account.instagramHidden);
      this.editProfileForm.get("twitterHidden").setValue(this.account.twitterHidden);
      this.editProfileForm.get("birthYear").setValue(this.account.birthYear);
      this.editProfileForm.get("phoneNumber").setValue(this.account.phoneNumber);
      this.editProfileForm.get("facebook").setValue(this.account.facebook);
      this.editProfileForm.get("instagram").setValue(this.account.instagram);
      this.editProfileForm.get("twitter").setValue(this.account.twitter);
        

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
  showNotifications()
  {

  }
  renderTree(tree: Tree) {
    /* Navigate to /tree/id  */
    this._router.navigate(['/tree/' + tree.ID]);
  }

  onFileChanged(event) {
    let file = event.target.files[0]
    // console.log(event.target.files[0])
    let formdata = new FormData()
    formdata.append('image', file, file.name)
    this.userService.uploadPhoto(formdata, this.account.username).then((res) => {
      // console.log(res)
      window.location.replace("/profile/");
    })
  }

  displayImages() {
    var id = this.route.snapshot.params['id'];
    this.userService.getPhotos(id).then((res) => {
      // console.log(res)
      var i: number = 0
      res.forEach(element => {
        this.images[i] = element
        i++
      });
    })
  }

  get form() { return this.editProfileForm.controls; }

  get response_msg() { return this.response; }

  
  submitProfilePictureFile(form: NgForm) {
  
    console.log(form.value.profilePictureURL);
    if (this.profilePictureFileForm.invalid) {
      console.log("edit: " + form.value.profilePictureURL);
      return;
    }

    if (form.value.profilePictureURL != this.account.profilePictureURL) {
      console.log(form.value.profilePictureURL)
      this.userService.editUserProfilePicture(form.value.profilePictureURL, this.account.username).subscribe((response) => {
        console.log(response);
        this.response = "complete";
      },
        (err) => {
          console.log(err);
          this.response = "fatalError";
        });
    }
    else {
      this.response = "noEdit";
      console.log("else");
    }

    window.location.replace("/profile")

  }


    cancelEdits() {
      this._router.navigate(['/profile/']);
    }

  
 
  /**
   * Resets all values for the form when the cancel button is invoked
   */
  cancel() {
    this.submitted = false;
    this.profilePictureFileForm.reset();
  }

  async onSubmitEditProfile(form: NgForm) {
      this.submitted = true;
      if (this.editProfileForm.invalid) {
          return;
      }
      
      this.account = new Account(this.rspp);
      this.account.username= this.username;

      this.account.email=form.value.email;

     if(this.account.email!=""&&this.account.email!=undefined&&this.account.email!=this.emaill)
      {
        this.authService.changeEmail(this.account.email).then((res) => {
          console.log(res)
          this.response = "complete_email"
        }).catch((error) => {
          console.log(error)
          this.response = "fatal_error"
        })
      }

      this.account.emailHidden=form.value.emailHidden;
      this.account.birthYear=form.value.birthYear;
      this.account.birthYearHidden=form.value.birthYearHidden;
      this.account.phoneNumber=form.value.phoneNumber;
      this.account.phoneNumberHidden=form.value.phoneNumberHidden;
      this.account.facebook=form.value.facebook;
      this.account.facebookHidden=form.value.facebookHidden;
      this.account.instagram=form.value.instagram;
      this.account.instagramHidden=form.value.instagramHidden;
      this.account.twitter=form.value.twitter;
      this.account.twitterHidden=form.value.twitterHidden;
    this.authService.editProfile(this.account).then((res) => {
          console.log(res)
          this.response = "complete_editProfile"
          window.alert("Information Updated!");
        }).catch((error) => {
          console.log(error)
          this.response = "fatal_error"
          window.alert("Error updating Information.");
        })
      
  }
}
