import { Component, OnInit } from '@angular/core';
import { TreeService } from '../../services/tree.service';
import { Tree } from '../../models/tree.model';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';
import { NgForm, FormGroup, FormBuilder, Validators, Form } from "@angular/forms";



@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
  
})
export class AdminComponent implements OnInit {

  myTree: Tree = { founder: null, treeName: null, members: null, dateCreated: null, numberOfPeople: null, chat: null, imageUrl: null, ID: null, description: null };

  constructor(private route: ActivatedRoute, private treeService: TreeService, private _router: Router) { }


  ngOnInit() {
    var id = this.route.snapshot.params['id'];


    this.treeService.getAllTreeInfo(id).then((data) => {
      this.myTree = new Tree(data);
      console.log(this.myTree);
    });

    

  }
  get tree() { return this.myTree }

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

}
