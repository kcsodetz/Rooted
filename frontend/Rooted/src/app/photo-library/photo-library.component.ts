import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Account } from '../models/account.model';
import { AuthService } from "../services/auth.service";
import { BehaviorSubject } from 'rxjs';
import { NgForm, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector: 'app-photo-library',
  templateUrl: './photo-library.component.html',
  styleUrls: ['./photo-library.component.scss']
})
export class PhotoLibraryComponent implements OnInit {
    images: Array<Object>

    myPhotos: String[];
    fileForm: FormGroup;

    userAuthed: Boolean;
    account: Account;
    username: string = "User";
    private loggedIn = new BehaviorSubject<boolean>(false); 
    response: string;
    submitted = false;
    constructor(private route: ActivatedRoute, private userService: UserService, private formBuilder: FormBuilder, public authService: AuthService) {
      this.images = []

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

  onFileChanged(event) {
    let file = event.target.files[0]
    // console.log(event.target.files[0])
    let formdata = new FormData()
    formdata.append('image', file, file.name)
    this.userService.uploadPhoto(formdata, this.username).then((res) => {
      // console.log(res)
      window.location.replace("/photo-library/");
    })
  }

  displayImages() {
    var username = this.route.snapshot.params['username'];
    this.userService.getPhotos(username).then((res) => {
      // console.log(res)
      var i: number = 0
      res.forEach(element => {
        this.images[i] = element
        i++
      });
    })
  }

  
}
