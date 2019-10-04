import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Account } from '../models/account.model';
import { AuthService } from "../services/auth.service";
import { BehaviorSubject } from 'rxjs';
import { NgForm, FormGroup, FormBuilder, Validators } from "@angular/forms";



@Component({
  selector: 'app-photo-library',
  templateUrl: './photo-library.component.html',
  styleUrls: ['./photo-library.component.scss']
})
export class PhotoLibraryComponent implements OnInit {
    photos = ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTdD0v9l5yAF-XiPHXrwBnIGwx64nVBJIO7SraU6gQNGz9lHMi", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTdD0v9l5yAF-XiPHXrwBnIGwx64nVBJIO7SraU6gQNGz9lHMi", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTdD0v9l5yAF-XiPHXrwBnIGwx64nVBJIO7SraU6gQNGz9lHMi", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTdD0v9l5yAF-XiPHXrwBnIGwx64nVBJIO7SraU6gQNGz9lHMi"]; 
    fileForm: FormGroup;
    userAuthed: Boolean;
    account: Account;
    username: String = "User";
    private loggedIn = new BehaviorSubject<boolean>(false); 
    response: string;
    submitted = false;
    constructor(private userService: UserService, public authService: AuthService) {
  
    }

  ngOnInit() {
    if(this.authService.autoAuthUser()){
        this.userAuthed = true;
      }
  
      this.userService.getAccountInfo().then((res) => {
        this.account = new Account(res);
        this.username = this.account.username;
    });
  }

  /**
   * Adds a Photo
   * @param form Submission form for adding a photo
   */
  submitFile(form: NgForm) {
    this.submitted = true;
    if (this.fileForm.invalid) {
      console.log(form);
      return;
    }

    // backend call
    this.userService.addPhotoToLibrary(form.value.imageUrl).then(() => {
      var confirm = window.alert('Photo ' + form.value.imageUrl + ' Added!')
      window.location.replace("/photo-library")
      console.log(confirm)
    });
  }
}
