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
  requestedUsersArray: [String];
  pendingUsersArray: [String];
  bannedUsers: [String];
  users: string;
 
  
  myTree: Tree = { memberRequestedUsers:null, pendingUsers:null ,founder: null, treeName: null, members: null, dateCreated: null, numberOfPeople: null, chat: null, imageUrl: null, ID: null, description: null, admins: null, privateStatus: false, bannedUsers: null, aboutBio: null, colorScheme:null };
  
  constructor(private route: ActivatedRoute, private treeService: TreeService, private _router: Router, private formBuilder: FormBuilder) { }
  privateStatus: Boolean;
  editTreeForm: FormGroup;
  announcementForm: FormGroup;

  admins = [];
  msgObj: Object;
  messages: [Object];
  annObj: Object;
  announcements: [Object];
 
  activeTabSection = 'Tree';
  submitted = false;
  response: string = "NULL";
  r1: string = "NULL";
  r2: string = "NULL";
  r3: string = "NULL";
  colorOption: string ="red";

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.messages = [null];
    this.announcements = [null];

    this.treeService.getAllTreeInfo(id).then((data) => {
      this.myTree = new Tree(data);
      //console.log(this.myTree);
      this.bannedUsers = this.myTree.bannedUsers;
      this.users = this.myTree.members;
      this.privateStatus = this.myTree.privateStatus;
      this.admins = this.myTree.admins;
      this.pendingUsersArray=this.myTree.pendingUsers;
      this.requestedUsersArray= this.myTree.memberRequestedUsers;
    });

    this.treeService.getAnonMessages(id).then((data) => {
      this.msgObj = data;
      let x = 0;
      while(this.msgObj[x]!=undefined){
        this.messages[x] = this.msgObj[x++];
      }
      console.log(this.messages);
    });

    this.announcementForm = this.formBuilder.group({
      announcement: ['']
    })

    this.treeService.getAnnouncements(id).then((data) => {
      this.annObj = data;
      let x = 0;
      while(this.annObj[x]!=undefined){
        this.announcements[x] = this.annObj[x++];
      }
      console.log(this.announcements);
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
    this.treeService.deleteChosenTree(id);
    console.log(id + " banned from the site")
    window.location.replace("/home");


  }

<<<<<<< HEAD
=======
  removeUser(username: string){
    if(confirm("Are you sure you want to kick this user from the group?")){
      this.treeService.removeUser(this.route.snapshot.params['id'],username);
      console.log("removed: " + username);
      window.location.replace("/admin/" + this.route.snapshot.params['id']);
    }
  }

>>>>>>> sprint-3
  banUser(username: string){
    if(confirm("Are you sure you want to ban this user from posting in the group?")){
      this.treeService.banUser(this.route.snapshot.params['id'],username);
      console.log("banned: " + username);
      window.location.replace("/admin/" + this.route.snapshot.params['id']);
    }
  }

  unbanUser(username: string){
    if(confirm("Are you sure you want to unban this user from the group?")){
      this.treeService.unbanUser(this.route.snapshot.params['id'],username);
      console.log("unbanned: " + username);
      window.location.replace("/admin/" + this.route.snapshot.params['id']);
    }
  }

  makeAdmin(username: string){
    if(confirm("Are you sure you want to make this user an admin?")){
      this.treeService.addAdmin(this.route.snapshot.params['id'],username);
      console.log("making admin: "+username);
      window.location.replace("/admin/" + this.route.snapshot.params['id']);
    }
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
    window.location.replace("/home");
  }

  renderEditTree(){
    this._router.navigate(['/edit-name/' + this.myTree.ID]);
  }

  acceptUser(us){
    this.treeService.addUser(this.myTree.ID, us).then((res) => {
      console.log(res);
      window.alert("Success!")
    }).catch((error) => {
  //    console.log(error);
      if(error.error.message=="Bad request")
      {
        window.alert("Username cannot be empty.")
      }
      else{
        window.alert(error.error.message+".")
      }
      this.response = 'fatal_error';

    });
<<<<<<< HEAD
=======
    //location.reload();
>>>>>>> sprint-3

  }
  rejectUser(us){
   
    //delete user from array
  }
  acceptUserRequest(n){
    this.treeService.inviteUser(this.myTree.ID, n).then((res) => {
      console.log(res);
      window.alert("Success!")
    }).catch((error) => {
  //    console.log(error);
      if(error.error.message=="Bad request")
      {
        window.alert("Username cannot be empty.")
      }
      else{
        window.alert(error.error.message+".")
      }
      this.response = 'fatal_error';

    });
<<<<<<< HEAD
=======
  //  location.reload();
>>>>>>> sprint-3

    //need to delete user from array      
  }
  rejectUserRequest(n){
    this.treeService.declineRequestedUser(this.myTree.ID, n).then((res) => {
      console.log(res);
      window.alert("Success!")
    }).catch((error) => {
  //    console.log(error);
      if(error.error.message=="Bad request")
      {
        window.alert("Username cannot be empty.")
      }
      else{
        window.alert(error.error.message+".")
      }
      this.response = 'fatal_error';

    });
<<<<<<< HEAD
=======
    //location.reload();
>>>>>>> sprint-3

    //need to delete user from array
  }

  addAnnouncement(announcement: string){
    this.treeService.addAnnouncement(this.route.snapshot.params['id'],announcement).then(()=> {
      var confirm = window.alert('Announcement Added');
      console.log(confirm);
    })
    window.location.replace("/admin/" + this.route.snapshot.params['id']);
  }

  removeAnnouncement(announcementID: string){
    if(confirm("Are you sure you want to permanently remove this announcement?")){
      this.treeService.removeAnnouncement(this.route.snapshot.params['id'],announcementID).then(() => {
        var confirm = window.alert('Announcement Removed');
        console.log(confirm);
      })
      window.location.replace("/admin/" + this.route.snapshot.params['id']);
    }
  }

  approveAnnouncement(announcementID: string, status: boolean){
    if(confirm("Are you sure you want to confirm/reject this announcmenet?")){
      this.treeService.approveAnnouncement(announcementID,this.route.snapshot.params['id'],status).then(()=>{
        if(status){
          var confirm = window.alert('Announcement Approved');
          console.log(confirm);
          window.location.replace("/admin/" + this.route.snapshot.params['id']);
        }else{
          var confirm = window.alert('Announcement Rejected');
          console.log(confirm);
          window.location.replace("/admin/" + this.route.snapshot.params['id']);
        }
      })
    }
  }

  backToTree(){
    window.location.replace("/tree/" + this.route.snapshot.params['id']);
  }

}
