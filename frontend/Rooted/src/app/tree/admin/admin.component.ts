import { Component, OnInit } from '@angular/core';
import { TreeService } from '../../services/tree.service';
import { Tree } from '../../models/tree.model';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';
import { NgForm, FormGroup, FormBuilder, Validators, Form } from '@angular/forms';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']

})
export class AdminComponent implements OnInit {
  bannedUsers: [String];
  users: string;
  myTree: Tree = { founder: null, treeName: null, members: null, dateCreated: null, numberOfPeople: null, chat: null, imageUrl: null, ID: null, description: null, admins: null, privateStatus: false, bannedUsers: null, aboutBio: null };
  
  constructor(private route: ActivatedRoute, private treeService: TreeService, private _router: Router) { }
  privateStatus: Boolean;
  editTreeForm: FormGroup;
  admins = [];

  activeTabSection = 'Tree';
  submitted = false;
  response: string = "NULL";
  r1: string = "NULL";
  r2: string = "NULL";
  r3: string = "NULL";

  ngOnInit() {
    const id = this.route.snapshot.params['id'];


    this.treeService.getAllTreeInfo(id).then((data) => {
      this.myTree = new Tree(data);
      console.log(this.myTree);
      this.bannedUsers = this.myTree.bannedUsers;
      this.users = this.myTree.members;
      this.privateStatus = this.myTree.privateStatus;
      this.admins = this.myTree.admins;
      console.log("this tree's private status: " + this.myTree.privateStatus);
    });



  }
  get tree() { return this.myTree; }


  /**
   * Method that deletes a tree and redirects back to the homepage
   * @param tree Tree to be deleted
   */
  delTre(tree: Tree) {

    // call delete method from service
    const confirm = window.confirm('Are you sure you want to remove this tree? This action cannot be undone');
    if (confirm === false) {
      return;
    }
    const id = this.route.snapshot.params['id'];
    this.treeService.deleteChosenTree(id).then((data) => {
      this.myTree = new Tree(data);
      console.log('Deleting Tree');
      // navigate back to page
      this._router.navigate(['/home']);
    });
  }

  banUser(username: string){
    console.log("banned: " + username);
    this.treeService.banUser(this.route.snapshot.params['id'],username);
  }

  unbanUser(username: string){
    console.log("unbanned: " + username);
    this.treeService.unbanUser(this.route.snapshot.params['id'],username);
  }

  makeAdmin(username: string){
    console.log("making admin: "+username);
    this.treeService.addAdmin(this.route.snapshot.params['id'],username);
    window.location.replace("/admin/" + this.route.snapshot.params['id']);
  }

  changeVisibility(){
    console.log("visibility: "+this.privateStatus)
    if(this.privateStatus){
      this.treeService.setPrivateStatus(this.route.snapshot.params['id'],false);
      this.privateStatus = false;
      window.location.replace("/admin/" + this.route.snapshot.params['id']);
    }else if(!this.myTree.privateStatus){
      this.treeService.setPrivateStatus(this.route.snapshot.params['id'],true);
      this.privateStatus = false;
      window.location.replace("/admin/" + this.route.snapshot.params['id']);
    }
  }

  toggle(SectionName) {
    console.log(SectionName);
    if (this.activeTabSection === SectionName) {
      return;
    }
    document.getElementById(this.activeTabSection + 'Tab').classList.toggle('active');
    document.getElementById(this.activeTabSection + 'Section').classList.toggle('invisible');
    document.getElementById(SectionName + 'Tab').classList.toggle('active');
    document.getElementById(SectionName + 'Section').classList.toggle('invisible');
    this.activeTabSection = SectionName;
  }

  deleteTree() {
    this.treeService.deleteChosenTree(this.route.snapshot.params['id']);
  }

  renderEditTree(){
    this._router.navigate(['/edit-name/' + this.myTree.ID]);
  }
}
