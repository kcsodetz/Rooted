import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthData } from '../models/auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Tree } from "../models/tree.model"


const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    observe: 'response' as 'response'
};

@Injectable({ providedIn: 'root' })

export class UserService {
    renderComponent: String = '';

    constructor(private http: HttpClient) {
    }

    getUserTrees() {
        return this.http.get<Tree[]>('http://localhost:5000/user/all-trees').toPromise();
    }

    getAccountInfo() {
        return this.http.get<Object>('http://localhost:5000/user/account').toPromise();
    }

    editUserProfilePicture(profilePictureURL: string, username: string) {
        const user: Object = {
            profilePictureURL: profilePictureURL,
            username: username,
        }
        return this.http.post("http://localhost:5000/user/edit-profile-picture", user)
    }


    uploadPhoto(formdata: FormData, username: string) {
        const info = {
            headers: new HttpHeaders({
                // 'Content-Type': 'application/form-data',
                'username': username
            })
        }
        console.log(formdata.getAll('image'))
        return this.http.post("http://localhost:5000/user/upload-photo", formdata, info).toPromise()
    }

    getPhotos(username: string) {
        const info = {
            headers: new HttpHeaders({
                // 'Content-Type': 'application/form-data',
                'username': username
            })
        }
        return this.http.get<Array<Object>>("http://localhost:5000/user/all-photos", info).toPromise()
    }

    //may not work 
    getUserProfile(username: string){
        const user = {
            headers: new HttpHeaders({
                'username': username
            })
        }
        return this.http.get<Object>('http://localhost:5000/user/find-user', user).toPromise();
    }
}
