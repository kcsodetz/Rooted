import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TreeService } from '../services/tree.service';
import { Tree } from '../models/tree.model';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';
import { UserService } from '../services/user.service';
import { Account } from '../models/account.model';


@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})

/**
 * Tree Page Component
 */
export class TreeComponent implements OnInit {

  @Input('childTree') tre: Tree;
  @Output() returnToParent = new EventEmitter<string>();

  // Tree object
  myTree: Tree;
  // Add user to tree form
  addUserForm: FormGroup;
  treePhotoLibraryImages: Array<Object>
  submitted = false;
  show = false;
  response: string = "NULL";
  messages: Array<Object>
  activeTabSection= "Tree";
  isAdmin: Boolean;
  account: Account;
  username: String;

  /* variables used in editing tree name*/
  renderComponent: string;
  chosenTree: Tree;

  constructor(private route: ActivatedRoute, public userService: UserService,
    private treeService: TreeService,  private formBuilder: FormBuilder, private _router: Router) {
    this.messages = []
    this.treePhotoLibraryImages = []


  }

  /**
   * Init function
   */
  ngOnInit() {

    /* grabs url and finds parameter 'id' */
    // var id = this.route.snapshot.params['id'];

    /* treeService calls getAllTreeInfo of specified ID
    * result is passed into data
    *
    * Tree model gets data and passes it to myTree
    */

    // this.treeService.getAllUsersInTree(id).then((data) => {
      
    // });


    // Form values and validators for create new DayDream
    this.addUserForm = this.formBuilder.group({
      username: ['', Validators.required]
    });
    this.userService.getAccountInfo().then((res) => {
      this.account = new Account(res);
      this.username = this.account.username;
      console.log(this.username);
      this.getTreeInfo();
      this.isUserAdmin();
    });

    this.displayImages()

  }

   /*
   * Get all tree information
   */
  getTreeInfo(){
    var id = this.route.snapshot.params['id'];

    this.treeService.getAllTreeInfo(id).then((data) => {
      this.myTree = new Tree(data);
      console.log(data);
    });

    
  }
  toggle(SectionName){
    console.log(SectionName);
    if(this.activeTabSection==SectionName)
    {
      return;
    }
    document.getElementById(this.activeTabSection+"Tab").classList.toggle("active");
    document.getElementById(this.activeTabSection+"Section").classList.toggle("invisible");
    document.getElementById(SectionName+"Tab").classList.toggle("active");
    document.getElementById(SectionName+"Section").classList.toggle("invisible");
    this.activeTabSection=SectionName;
  }
  /**
   * Get all messages for a tree
   */
  getMessages() {

    this.treeService.getMessages(this.myTree.ID).then((messages) => {
      // this.messages = messages;
      console.log(messages)
      var i: number = 0
      messages.forEach(element => {
        console.log(element)
        this.messages[i] = element
        i++;
      });
      console.log(this.messages)
    });
  }

  isUserAdmin(){
    console.log("in isUserAdmin");
    var id = this.route.snapshot.params['id'];

    this.treeService.getAllTreeInfo(id).then((data) => {
      this.myTree = new Tree(data);
      var admins = [];
      admins = this.myTree.admins;
      var i: number = 0;
      console.log("admins lenght: " + this.myTree.admins.length);
      this.myTree.admins.forEach(element => {
        console.log(this.myTree.admins[i]);
        if(this.myTree.admins[i] == this.username){
          this.isAdmin = true;
          console.log("user admin status: " + this.isAdmin);
          return;
        }
      });
    });
  }

  userProfile(username: string) {
    /* Navigate to /tree/id  */
    this._router.navigate(['/other-profile/' + username]);
  }

  /**
   * Add a message to a tree
   * @param event Event to parse input from
   */
  addMessage(event) {
    this.treeService.addMessage(event, this.myTree.ID).then(() => {
      this.getMessages()
    });
  }

  /**
   * Method that deletes a tree and redirects back to the homepage
   * @param tree Tree to be deleted
   */
  delTre(tree: Tree) {

    // call delete method from service
    var confirm = window.confirm('Are you sure you want to remove this tree? This action cannot be undone')
    if (confirm == false) {
      return
    }
    var id = this.route.snapshot.params['id'];
    this.treeService.deleteChosenTree(id).then((data) => {
      this.myTree = new Tree(data);
      console.log("Deleting Tree");
      //navigate back to page
      this._router.navigate(['/home']);
    })
  }



  // Get add user form
  get form_add_user() { return this.addUserForm.controls }

  // Get form respone for toasts
  get reponse() { return this.response }


  /**
   * Navigates to edit tree page 
   */
  renderEditTreeName() {
    this._router.navigate(['/edit-name/' + this.myTree.ID]);

  
  }

  /**
   * Navigates to an admin Dashboard
   */
  renderAdminDashboard() {
    /* Navigate to /tree/id  */
    this._router.navigate(['/admin/' + this.myTree.ID]);
  }

 

  leaveTree() {
    let username = localStorage.getItem('username')
    this.treeService.leaveTree(this.myTree.ID, username).then(() => {
      var confirm = window.confirm('Are you sure you want to leave this tree. To return, you must be added back by someone')
      if (confirm == false) {
        return
      }
      this._router.navigate(['/home'])
    })
  }

  /**
   * Adds user to current tree
   * @param event Event to parse user addition
   */
  addUser(event) {

    this.submitted = true;
    // Check if form is missing values. If true, then return.
    if (this.addUserForm.invalid) {
      console.log(event);
      return;
    }

    // Backend api call
    this.treeService.addUser(this.myTree.ID, event.value.username).then(() => {
      this.treeService.getAllTreeInfo(this.myTree.ID).then((c) => {
        console.log(c);
        window.location.replace("/tree/" + this.myTree.ID);
      })
    }).catch(e => {
      console.log(e.error.message);
      // Duplicate user
      if (e.error.message == "User is already in tree") {
        this.response = "Dup";
      }
      // User cannot be found
      else if (e.error.message == "Username does not exist") {
        this.response = "NoUser";
      }
      // Fatal error
      else {
        this.response = "fatalError";
      }
    });
  }

  /**
   * Get child event 
   * @param event Event passed
   */
  getChildEvent(event: string) { this.returnToParent.emit('reload'); }

  /**
   * Naviage to home
   */
  back() { this._router.navigate(['/home']); }


  

  onFileChanged(event) {
    let file = event.target.files[0]
    let formdata = new FormData()
    formdata.append('image', file, file.name)
    this.treeService.uploadPhoto(formdata, this.myTree.ID).then((res) => {
      window.location.replace("/tree/" + this.myTree.ID);
    })
  }

  displayImages() {
    console.log("HEY MOTHERFUCKER");
    var id = this.route.snapshot.params['id'];
    console.log(id);
    this.treeService.getPhotos(id).then((res) => {
      console.log("SURPRISE MOTHERFUCKER");
      var i: number = 0
      res.forEach(element => {
        this.treePhotoLibraryImages[i] = element
        i++
      });
    })
  }

  

}
