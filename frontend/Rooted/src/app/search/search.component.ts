import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { NgForm, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TreeService } from '../services/tree.service';
import { Tree } from '../models/tree.model';
import { Router } from '@angular/router'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchTrees: Tree[];

  constructor(private userService: UserService,  private treeService: TreeService, private formBuilder: FormBuilder, private _router: Router) {}
  searchInputForm: FormGroup;

  ngOnInit() {
    this.searchInputForm = this.formBuilder.group({
      searchInput: ['']
    });
    
  }

  onSubmitSearch(form: NgForm) {
    console.log(form.value.searchInput);

    this.treeService.getSearchTrees(form.value.searchInput).then((data) => {


      let i: number;

      let response = [];
      response.push(data);


      this.searchTrees = new Array(response[0].length)

      for (i = 0; i < response[0].length; i += 1) {
        let tree = new Tree(response[0][i])
        if (tree.treeName.length > 18) {
          tree.treeName = tree.treeName.substring(0, 20) + '...'
        }
        this.searchTrees[i] = tree;
      }

      console.log(this.searchTrees);
    });
  }
  /**
   * Navigates to a tree 
   * @param tree Tree to navigate to
   */
  renderTree(tree: Tree) {
    /* Navigate to /tree/id  */
    this._router.navigate(['/tree/' + tree.ID]);
  }

}
