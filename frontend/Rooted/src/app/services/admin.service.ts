import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthData } from '../models/auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Tree } from '../models/tree.model';


const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    observe: 'response' as 'response'
};

@Injectable({ providedIn: 'root' })

export class AdminService {
    renderComponent: String = '';

    constructor(private http: HttpClient) {
    }

    getAllAdmins(){
        return this.http.get<Array<String>>('http://localhost:5000/admin/all-admins').toPromise();
    }
}