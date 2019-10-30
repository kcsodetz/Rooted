import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
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
    images: Array<Object>
    photos = ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTdD0v9l5yAF-XiPHXrwBnIGwx64nVBJIO7SraU6gQNGz9lHMi", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTdD0v9l5yAF-XiPHXrwBnIGwx64nVBJIO7SraU6gQNGz9lHMi", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTdD0v9l5yAF-XiPHXrwBnIGwx64nVBJIO7SraU6gQNGz9lHMi", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTdD0v9l5yAF-XiPHXrwBnIGwx64nVBJIO7SraU6gQNGz9lHMi"]; 
    fileForm: FormGroup;
    userAuthed: Boolean;
    account: Account;
    username: string = "User";
    private loggedIn = new BehaviorSubject<boolean>(false); 
    response: string;
    submitted = false;
    constructor(private route: ActivatedRoute, private userService: UserService, public authService: AuthService) {
      this.images = []
    }

  ngOnInit() {
    if(this.authService.autoAuthUser()){
        this.userAuthed = true;
      }
  
      this.userService.getAccountInfo().then((res) => {
        this.account = new Account(res);
        this.username = this.account.username;
        this.displayImages(this.username);
    });

    

  }

  onFileChanged(event) {
    const file = event.target.files[0];
    // console.log(event.target.files[0])
    const formdata = new FormData();
    formdata.append('image', file, file.name);

    this.userService.uploadPhoto(formdata, this.account.username).then((res) => {
      // console.log(res)
      window.location.replace('/photo-library/');
    });
  }

  displayImages(username: string) {
    console.log("HEY");

    this.userService.getPhotos(username).then((res) => {
      console.log("LISTEN");
      let i = 0;
      res.forEach(element => {
        this.images[i] = element;
        i++;
      });
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

    
  }
}
