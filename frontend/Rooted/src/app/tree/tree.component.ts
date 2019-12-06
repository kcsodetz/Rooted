import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  // tslint:disable-next-line: no-input-rename
  @Input('childTree') tre: Tree;
  @Output() returnToParent = new EventEmitter<string>();
  // Tree object
  myTree: Tree;
  // Add user to tree form
  addUserForm: FormGroup;
  addUserFormEmail: FormGroup;
  treePhotoLibraryImages: Array<Object>;
  submitted = false;
  show = false;
  response = 'NULL';
  messages: Array<Object>;
  activeTabSection = 'Tree';
  isPrivate: Boolean;
  isAdmin: Boolean;
  account: Account;
  username: String;
  isMember: Boolean;
  notMember: Boolean;
  photoID: string;
  selectedIndex = 0;
  messageForm: FormGroup;
  annObj: Object;
  announcements: [Object];
  announcementForm: FormGroup;
  involvementForm: FormGroup;
  /* variables used in editing tree name*/
  renderComponent: string;
  chosenTree: Tree;
  constructor(private route: ActivatedRoute, public userService: UserService,
    private treeService: TreeService, private formBuilder: FormBuilder, private _router: Router) {
    this.messages = [];
    this.treePhotoLibraryImages = [];
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
    // Form values and validators for create new
    this.addUserForm = this.formBuilder.group({
      username: ['', Validators.required]
    });
    this.userService.getAccountInfo().then((res) => {
      this.account = new Account(res);
      // console.log(this.username);
      this.username = this.account.username;
      // console.log("current username: " + this.username);
      this.getTreeInfo();
      this.isUserAdmin();
      // this.treeMember();
    });
    this.addUserFormEmail = this.formBuilder.group({
      email: ['', Validators.required],
      name: [''],
      sendEmail: [Boolean],
    });
    this.displayImages();
    this.messageForm = this.formBuilder.group({
      message: ['']
    });
    this.announcementForm = this.formBuilder.group({
      announcement: ['']
    });
    this.announcements = [null];
    this.treeService.getAnnouncements(this.route.snapshot.params['id']).then((data) => {
      this.annObj = data;
      let x = 0;
      while (this.annObj[x] != undefined) {
        this.announcements[x] = this.annObj[x++];
      }
      console.log(this.announcements);
    });
    this.involvementForm = this.formBuilder.group({
      joinYear: [''],
      exitYear: ['']
    });
  }
  /*
  * Get all tree information
  */
  getTreeInfo() {
    const id = this.route.snapshot.params['id'];
    this.treeService.getAllTreeInfo(id).then((data) => {
      this.myTree = new Tree(data);
      this.isPrivate = this.myTree.privateStatus;
      const len = this.myTree.members.length;
      let i = 0;
      for (i; i < len; i++) {
        if (this.username === this.myTree.members[i]) {
          this.isMember = true;
          return;
        }
      }
      this.notMember = true;
      //   console.log(data);
    });
  }
  toggle(SectionName) {
    // console.log(SectionName);
    if (this.activeTabSection === SectionName) {
      return;
    }
    document.getElementById(this.activeTabSection + 'Tab').classList.toggle('active');
    document.getElementById(this.activeTabSection + 'Section').classList.toggle('invisible');
    document.getElementById(SectionName + 'Tab').classList.toggle('active');
    document.getElementById(SectionName + 'Section').classList.toggle('invisible');
    this.activeTabSection = SectionName;
  }
  /**
   * Get all messages for a tree
   */
  getMessages() {
    this.treeService.getMessages(this.myTree.ID).then((messages) => {
      // this.messages = messages;
      console.log(messages);
      let i = 0;
      messages.forEach(element => {
        //   console.log(element)
        this.messages[i] = element;
        i++;
      });
      // console.log(this.messages)
    });
  }
  isUserAdmin() {
    // console.log("in isUserAdmin");
    const id = this.route.snapshot.params['id'];
    this.treeService.getAllTreeInfo(id).then((data) => {
      this.myTree = new Tree(data);
      let admins = [];
      admins = this.myTree.admins;
      let i = 0;
      console.log('admins length: ' + this.myTree.admins.length);
      this.myTree.admins.forEach(element => {
        if (this.myTree.admins[i] === this.username) {
          this.isAdmin = true;
          console.log('user admin status: ' + this.isAdmin);
          return;
        }
        i++;
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
      this.getMessages();
    });
  }
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
  // Get add user form
  get form_add_user() { return this.addUserForm.controls; }
  // Get form respone for toasts
  get reponse() { return this.response; }
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
  setRow(_index: number) {
    this.selectedIndex = _index;
    console.log(this.selectedIndex);
  }
  leaveTree() {
    const username = localStorage.getItem('username');
    this.treeService.leaveTree(this.myTree.ID, username).then(() => {
      const confirm = window.confirm('Are you sure you want to leave this tree. To return, you must be added back by someone');
      if (!confirm) {
        return;
      }
      this._router.navigate(['/home']);
    });
  }
  /**
   * Adds user to current tree
   * @param event Event to parse user addition
   */
  addUser(event) {
    this.submitted = true;
    // Check if form is missing values. If true, then return.
    if (this.addUserForm.invalid) {
      //  console.log(event);
      return;
    }
    // Backend api call
    this.treeService.addUser(this.myTree.ID, event.value.username).then(() => {
      this.treeService.getAllTreeInfo(this.myTree.ID).then((c) => {
        //   console.log(c);
        window.location.replace('/tree/' + this.myTree.ID);
      });
    }).catch(e => {
      // console.log(e.error.message);
      // Duplicate user
      if (e.error.message === 'User is already in tree') {
        this.response = 'Dup';
      } else if (e.error.message === 'Username does not exist') {
        this.response = 'NoUser';
      } else {
        this.response = 'fatalError';
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
    const file = event.target.files[0];
    const formdata = new FormData();
    formdata.append('image', file, file.name);
    this.treeService.uploadPhoto(formdata, this.myTree.ID).then((res) => {
      window.location.replace('/tree/' + this.myTree.ID);
    });
  }
  displayImages() {
    const id = this.route.snapshot.params['id'];
    //    console.log(id);
    this.treeService.getPhotos(id).then((res) => {
      let i = 0;
      res.forEach(element => {
        this.treePhotoLibraryImages[i] = element;
        i++;
      });
    });
  }
  selectPhoto(string: string) {
    this.photoID = string;
    console.log(this.photoID);
  }
  deletePhoto() {
    this.treeService.deletePhoto(this.myTree.ID, this.photoID).then(() => {
      console.log('Deleting Photo');
      // navigate back to page
      window.location.replace('/tree/' + this.myTree.ID);
    });
  }
  sendJoinRequest() {
    this.treeService.requestAdminToJoinTree(this.myTree.ID, this.account.username).then((res) => {
      //    console.log(res);
      window.alert('Successfully Requested to Join Tree!');
      this.response = 'complete_editProfile';
    }).catch((error) => {
      //  console.log(error);
      window.alert('Failure! :(');
      this.response = 'fatal_error';
    });
  }
  async sendAddRequestUsername(form: NgForm) {
    if (this.isAdmin) {
      console.log(this.myTree.ID + ' ' + form.value.username);
      this.treeService.inviteUser(this.myTree.ID, form.value.username).then((res) => {
        console.log(res);
        window.alert('Success!');
      }).catch((error) => {
        //    console.log(error);
        if (error.error.message === 'Bad request') {
          window.alert('Username cannot be empty.');
        } else {
          window.alert(error.error.message + '.');
        }
        this.response = 'fatal_error';
      });
      // location.reload();
    } else {
      this.treeService.requestAdminToJoinTree(this.myTree.ID, form.value.username).then((res) => {
        //      console.log(res);
        window.alert('Success!');
        this.response = 'complete_editProfile';
      }).catch((error) => {
        //    console.log(error);
        if (error.error.message === 'Bad request') {
          window.alert('Username cannot be empty.');
        } else {
          window.alert(error.error.message + '.');
        }
        this.response = 'fatal_error';
      });
      // location.reload();
    }
  }
  async sendAddRequestEmail(form: NgForm) {
    this.treeService.requestNonRootedUser(this.myTree.ID, form.value.name, form.value.email).then(() => {
      const confirm = window.alert('sucess');
      console.log(confirm);
    });
  }
  sendAnonMessage(message: string) {
    this.treeService.submitAnonMessage(this.myTree.ID, message).then(() => {
      const confirm = window.alert('Message anonymously sent to mods');
      console.log(confirm);
    });
    console.log('message: ' + message + 'submitted to mods');
  }
  addAnnouncement(announcement: string) {
    this.treeService.addAnnouncement(this.route.snapshot.params['id'], announcement).then(() => {
      const confirm = window.alert('Announcement Requested');
      console.log(confirm);
    });
  }
  editInvolvement(joinYear: string, exitYear: string) {
    if (joinYear == '') {
      joinYear = null;
    }
    if (exitYear == '') {
      exitYear = null;
    }
    console.log('joinyear ' + joinYear);
    console.log('exityear ' + exitYear);
    this.treeService.editInvolvement(this.route.snapshot.params['id'], joinYear, exitYear).then(() => {
      const confirm = window.alert('Your involvement has been updated');
      console.log(confirm);
    });
  }
}

