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

    getAllUsers(){
        return this.http.get<Object>('http://localhost:5000/user/get-all-users').toPromise();
    }

    editUserProfilePicture(profilePictureURL: string, username: string) {
        const user: Object = {
            profilePictureURL: profilePictureURL,
            username: username,
        };
        return this.http.post('http://localhost:5000/user/edit-profile-picture', user);
    }


    uploadPhoto(formdata: FormData, username: string) {
        const info = {
            headers: new HttpHeaders({
                // 'Content-Type': 'application/form-data',
                'username': username
            })
        };
        console.log(formdata.getAll('image'));
        return this.http.post('http://localhost:5000/user/upload-photo', formdata, info).toPromise();
    }

    getPhotos(username: string) {
        const info = {
            headers: new HttpHeaders({
                // 'Content-Type': 'application/form-data',
                'username': username
            })
        };
        return this.http.get<Array<Object>>('http://localhost:5000/user/all-photos', info).toPromise();
    }

    getUserProfile(name: string) {
        const user = {
            headers: new HttpHeaders({
                'username': name
            })
        };
        return this.http.get<Object>('http://localhost:5000/user/find-user', user).toPromise();
    }


    /*
    *   Accept invitation to join a group
    */
    acceptInvitation(username: string, notif: Object) {
        const notifID = notif['_id'];
        const treeID = notif['meta'];
        const userAndNotif = {
            'username' : username,
            'treeID' : treeID,
            'notifID' : notifID
        };
        return this.http.post('http://localhost:5000/user/join-tree', userAndNotif).toPromise();
    }

    /*
    *   Decline invitation to join a group
    */
    declineInvitation(username: string, notif: Object) {
        const notifID = notif['_id'];
        const treeID = notif['meta'];
        const userAndNotif = {
            'username' : username,
            'treeID' : treeID,
            'notifID' : notifID
        };
        return this.http.post('http://localhost:5000/user/decline-invite', userAndNotif).toPromise();
    }

    /*
    *   Decline invitation to join a group
    */
    removeNotification(username: string, notifID: string) {
        const payload = {
            'username' : username,
            'notificationID' : notifID,
        };
        return this.http.post('http://localhost:5000/user/remove-notification', payload).toPromise();
    }

    joinTree(name: string, treeID: string) {
        const tree = {
            username: name,
            treeID: treeID,
        };
        return this.http.post('http://localhost:5000/tree/join-tree', tree).toPromise();

    }

    swBanUser(username: string){
        const payload = {
            'userToBan' : username
        };
        return this.http.post('http://localhost:5000/user/sw-admin-ban-user', payload).toPromise();
    }

    swAddAdmin(username: string){
        const payload = {
            'username' : username
        };
        return this.http.post('http://localhost:5000/user/add-sitewide-admin',payload).toPromise();
    }

    swRemoveAdmin(username: string){
        const payload = {
            'userToRemove' : username
        };
        return this.http.post('http://localhost:5000/user/remove-sitewide-admin',payload).toPromise();
    }

    swAllBannedUsers(){
        return this.http.get<Object>('http://localhost:5000/user/all-banned-users').toPromise();
    }

    swUnbanUser(username: string){
        const payload = {
            'userToUnban' : username
        };
        return this.http.post('http://localhost:5000/user/sw-admin-unban-user',payload).toPromise();
    }
}
