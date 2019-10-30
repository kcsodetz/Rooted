import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthData } from '../models/auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { RequestOptions, Headers } from '@angular/http';


const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    observe: 'response' as 'response'
};

@Injectable({ providedIn: 'root' })

export class TreeService {

    Tree: Object;
    constructor(private http: HttpClient, private _router: Router) {}
    TreeUrl: string;

    uploadPhoto(formdata: FormData, treeID: string) {
        const info = {
            headers: new HttpHeaders({
                // 'Content-Type': 'application/form-data',
                'treeID': treeID
            })
        };
        console.log(formdata.getAll('image'));
        return this.http.post('http://localhost:5000/tree/add-photo', formdata, info).toPromise();

    }

    getPhotos(treeID: string) {
        const info = {
            headers: new HttpHeaders({
                // 'Content-Type': 'application/form-data',
                'treeID': treeID
            })
        };
        return this.http.get<Array<Object>>('http://localhost:5000/tree/all-photos', info).toPromise();
    }


    editTreeDescription(treeDescription: string, treeID: string) {
        const tree: Object = {
            treeDescription: treeDescription,
            treeID: treeID,
        };
        return this.http.post('http://localhost:5000/tree/edit-tree-description', tree);
    }

    editTreeName(treeName: string, treeID: string) {
        const tree: Object = {
            treeName: treeName,
            treeID: treeID,
        };
        return this.http.post('http://localhost:5000/tree/edit-name', tree);
    }

    editTreePhoto(url:string, treeID:string){
        const options = {
            imageUrl: url,
            treeID: treeID,
        }
        return this.http.post('http://localhost:5000/tree/edit-photo', options)
    }

    addMessage(message: string, treeID: string) {
        const options = {
            treeID: treeID,
            message: message
        };
        return this.http.post('http://localhost:5000/tree/add-message', options).toPromise();
    }

    setTreeUrl(url: string) {
        this.TreeUrl = url;
    }

    getTreeUrl() {
        return this.TreeUrl;
    }

    getAllTreeInfo(treeID: string) {
        const info = {
            headers: new HttpHeaders({
                'treeid': treeID
            })
        };

        /* calls /tree/info from the backend*/
        return this.http.get('http://localhost:5000/tree/info', info).toPromise();

    }

    getMessages(treeID: string) {
        const info = {
            headers: new HttpHeaders({
                'treeid': treeID
            })
        };
        return this.http.get<Array<Object>>('http://localhost:5000/tree/chat', info).toPromise();
    }

    leaveTree(treeID: string, username: string) {
        const info = {
            treeID: treeID,
            username: username
        };
        return this.http.post('http://localhost:5000/tree/leave', info).toPromise();
    }

    addUser(treeID: string, username: string) {
        const info = {
            treeID: treeID,
            username: username
        };
        return this.http.post('http://localhost:5000/tree/add-user', info).toPromise();
    }

    deleteChosenTree(treeID: string) {
        const chosen = {
            treeID: treeID
        };
        return this.http.post('http://localhost:5000/tree/delete', chosen).toPromise();
    }

    

    createTree(treeName: string, treeDescription: string, imageUrl: string) {
        const tree = {
            treeName: treeName,
            description: treeDescription,
            imageUrl: imageUrl
        };
        return this.http.post('http://localhost:5000/tree/add', tree).toPromise();
    }

    reportTree(treeId: string, treeName: string, reason: string, reporter: string) {
        const report = {
            treeName: treeName,
            reason: reason,
            reporter: reporter
        };
        const info = {
            headers: new HttpHeaders({
                'treeid': treeId
            })
        };
        return this.http.post('http://localhost:5000/tree/report-tree', report, info).toPromise();
    }

    reportUser(treeId: string, reason: string, userToReport: string) {
        const report = {
            reason: reason,
            userToReport: userToReport
        };
        const info = {
            headers: new HttpHeaders({
                'treeid': treeId
            })
        };
        return this.http.post('http://localhost:5000/tree/report-user', report, info).toPromise();
    }

    setPrivateStatus(treeId: string, privateStatus: boolean) {
        const status = {
            treeID: treeId,
            private: privateStatus,
        };
        return this.http.post('http://localhost:5000/tree/set-private-status', status).toPromise();
    }

     /* If this doesn't work, tell Julien */
    banUser(treeId: string, username: string) {
        const user = {
            treeID: treeId,
            userToBan: username,
        };
        return this.http.post('http://localhost:5000/tree/ban-user', user).toPromise();
    }

     /* If this doesn't work, tell Julien */
    unbanUser(treeId: string, username: string) {
        const user = {
            treeID: treeId,
            userToUnban: username,
        };
        return this.http.post('http://localhost:5000/tree/unban-user', user).toPromise();
    }

    /* If this doesn't work, tell Julien */
    getBannedUsers(treeId: string) {
        const users = {
            headers: new HttpHeaders({
                'treeID': treeId
            })
        };
        return this.http.get('http://localhost:5000/tree/display-banned-users', users).toPromise();
    }

    requestAdminToJoinTree(treeID: string, username: string) {
        const payload = {
            treeID: treeID,
            username: username
        };
        return this.http.post('http://localhost:5000/tree/request-admin-to-add-user', payload).toPromise();
    }

    inviteUser(treeID: string, username: string) {
        const payload = {
            treeID: treeID,
            username: username
        };
        return this.http.post('http://localhost:5000/tree/invite-user', payload).toPromise();
    }

}
