import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthData } from '../models/auth-data.model'
import { Subject } from "rxjs";
import { Router } from "@angular/router";

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    observe: 'response' as 'response'
};

@Injectable({ providedIn: "root" })

export class TreeService{

    Tree: Object;
    constructor(private http:HttpClient, private _router: Router) {}
    TreeUrl: string

    uploadPhoto(url:string, treeID:string){
        const options = {
            imageUrl: url,
            treeID: treeID,
        }
        return this.http.post("http://localhost:5000/tree/add-photo", options)
    }

    editTreeDescription(treeDescription:string, treeID:string) {
        const tree:Object = {
            treeDescription: treeDescription,
            treeID: treeID,
        }
        return this.http.post("http://localhost:5000/tree/edit-tree-description", tree)
    }

    addMessage(message:string, treeID:string){
        const options = {
            treeID: treeID,
            message: message
        }
        return this.http.post("http://localhost:5000/tree/add-message", options).toPromise()
    }

    setTreeUrl(url:string){
        this.TreeUrl=url
    }

    getTreeUrl(){
        return this.TreeUrl
    }

    getAllTreeInfo(treeID:string) {
        const info = {
            headers: new HttpHeaders({
                'treeID': treeID
            })
        }

        /* calls /tree/info from the backend*/
        return this.http.get("http://localhost:5000/tree/info", info).toPromise().catch((err) => {
            // this._router.navigate(['/not-found']);
        })
    }

    getMessages(treeID:string){
        const info = {
            headers: new HttpHeaders({
                'treeid': treeID
            })
        }
        return this.http.get<Array<Object>>("http://localhost:5000/tree/chat", info).toPromise()
    }

    leaveTree(treeID:string, username:string){
        const info = {
            treeID: treeID,
            username: username
        }
        return this.http.post("http://localhost:5000/tree/leave", info).toPromise()
    }

    addUser(treeID:string, username:string){
        const info = {
            treeID: treeID,
            username: username
        }
        return this.http.post("http://localhost:5000/tree/add-user", info).toPromise()
    }

    deleteChosenTree(treeID:string) {
        const chosen = {
            treeID: treeID
        }
        return this.http.post("http://localhost:5000/tree/delete", chosen).toPromise()
    }

    editTreeName(treeName:string, treeID:string) {
        const tree:Object = {
            treeName: treeName,
            treeID: treeID,
        }
        return this.http.post("http://localhost:5000/tree/edit-name", tree)
    }

    createTree(treeName:string, treeDescription:string, imageUrl: string){
        const tree = {
            treeName: treeName,
            description: treeDescription,
            imageUrl: imageUrl
        }
        return this.http.post("http://localhost:5000/tree/add", tree).toPromise()
    }
}
