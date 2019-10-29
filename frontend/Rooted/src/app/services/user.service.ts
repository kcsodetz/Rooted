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

    getUserPhotos() {
        return this.http.get<Object[]>('http://localhost:5000/user/photo-library').toPromise();
    }

    addPhotoToLibrary(photoURL: string) {
        return this.http.post('http://localhost:5000/user/add-photo', photoURL).toPromise();
    }


    //may not work 
    getUserProfile(name: string){
        const user = {
            headers: new HttpHeaders({
                'username': name
            })
        }
        return this.http.get<Object>('http://localhost:5000/user/find-user', user).toPromise();
    }
}
