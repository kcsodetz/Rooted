import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TreeService } from '../services/tree.service';
import { Tree } from '../models/tree.model';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';

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
  submitted = false;
  show = false;
  response: string = "NULL";
  messages: Array<Object>

  /* variables used in editing tree name*/
  renderComponent: string;
  chosenTree: Tree;

  constructor(private route: ActivatedRoute,
    private treeService: TreeService,  private formBuilder: FormBuilder, private _router: Router) {
    this.messages = []

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

    this.getTreeInfo();
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


}
