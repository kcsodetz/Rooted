import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { NgForm, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TreeService } from '../services/tree.service';
import { Tree } from '../models/tree.model';
import { Router } from '@angular/router'


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
/**
 * Home Page Component
 */
export class HomeComponent implements OnInit {

 
  myTrees: Tree[];
  fileForm: FormGroup;
  image: string;
  submitted = false;

  constructor(private userService: UserService,  private treeService: TreeService, private formBuilder: FormBuilder, private _router: Router) {}

   /**
   * Init function
   */
  ngOnInit() {
    // Displays all user trees
    this.displayTrees();

    // Form inputs and validators
    this.fileForm = this.formBuilder.group({
      imageUrl: [''],
      treeDesc: ['', Validators.required],
      treeName: ['', Validators.required],
    })
  }

  /**
   * Pass form to html component
   */
  get form() { return this.fileForm.controls; }

  /**
   * Navigates to a tree 
   * @param tree Tree to navigate to
   */
  renderTree(tree: Tree) {
    /* Navigate to /tree/id  */
    this._router.navigate(['/tree/' + tree.ID]);
  }

  /**
   * Displays all user trees
   */
  displayTrees() {
    this.userService.getUserTrees().then((data) => {

      let i: number;

      let response = [];
      response.push(data);

      this.myTrees = new Array(response[0].length)

      for (i = 0; i < response[0].length; i += 1) {
        let tree = new Tree(response[0][i])
        if (tree.treeName.length > 18) {
          tree.treeName = tree.treeName.substring(0, 20) + '...'
        }
        this.myTrees[i] = tree;
      }
    });
  }

  /**
   * Creates a tree
   * @param form Submission form for creating a tree
   */
  submitFile(form: NgForm) {
    this.submitted = true;
    if (this.fileForm.invalid) {
      console.log(form);
      return;
    }

    // backend call
    this.treeService.createTree(form.value.treeName, form.value.treeDesc, form.value.imageUrl).then(() => {
      var confirm = window.alert('Tree ' + form.value.treeName + ' Created!')
      window.location.replace("/home")
      console.log(confirm)
      // this._router.navigate(['/edit-name']);
    });
  }
 
  /**
   * Resets all values for the form when the cancel button is invoked
   */
  cancel() {
    this.submitted = false;
    this.fileForm.reset();
  }
  searchPage(){
    return
  }

}