import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TreeService } from '../../../services/tree.service';
import { Tree} from '../../../models/tree.model';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';
import { NgForm, FormGroup, FormBuilder, Validators, Form } from "@angular/forms";


@Component({
  selector: 'app-edit-name',
  templateUrl: './edit-name.component.html',
  styleUrls: ['./edit-name.component.scss']
})
export class EditNameComponent implements OnInit {



  myTree: Tree = { memberRequestedUsers:null, pendingUsers:null ,founder: null, treeName: null, members: null, dateCreated: null, numberOfPeople: null, chat: null, imageUrl: null, ID: null, description: null, admins: null, privateStatus: false, bannedUsers: null, aboutBio: null, colorScheme: null};
  constructor(private route: ActivatedRoute, private treeService: TreeService, private _router: Router, private formBuilder: FormBuilder) { }
  editTreeForm: FormGroup;
  submitted = false;
  response: string = "NULL";
  r1: string = "NULL";
  r2: string = "NULL";
  r3: string = "NULL";
  r4: string = "NULL";
  r5: string = "NULL";

  ngOnInit() {

    /* grabs url and finds parameter 'id' */
    var id = this.route.snapshot.params['id'];

    /* treeService calls getAllTreeInfo of specified ID 
    * result is passed into data
    * 
    * Tree model gets data and passes it to myTree
    */

    this.treeService.getAllTreeInfo(id).then((data) => {
      this.myTree = new Tree(data);
      console.log(this.myTree);
      this.editTreeForm.controls.treeName.setValue(this.myTree.treeName);
      this.editTreeForm.controls.imageUrl.setValue(this.myTree.imageUrl);
      this.editTreeForm.controls.treeDescription.setValue(this.myTree.description);
      this.editTreeForm.controls.aboutBio.setValue(this.myTree.aboutBio);
      this.editTreeForm.controls.colorScheme.setValue(this.myTree.colorScheme);
    });

    this.editTreeForm = this.formBuilder.group({
      treeName: [this.myTree.treeName, Validators.required],
      imageUrl: [this.myTree.imageUrl, Validators.required],
      treeDescription: [this.myTree.description, Validators.required],
      aboutBio: [this.myTree.aboutBio, Validators.required],
      colorScheme: [this.myTree.colorScheme]
    });
  }

  get form() { return this.editTreeForm.controls }

  get response_msg() { return this.response }

  get tree() { return this.myTree }

  sendEdits(form: NgForm) {
  

    this.submitted = true;
    if (this.editTreeForm.invalid) {
      console.log("edit: " + form.value.imageUrl);
      return;
    }

    if (form.value.treeName != this.myTree.treeName) {
      this.treeService.editTreeName(form.value.treeName, this.myTree.ID).subscribe((response) => {
        console.log(response);
        this.response = "complete";
      },
        (err) => {
          console.log(err);
          this.response = "fatalError";
        });
    }
    else {
      this.r1 = "noEdit";
    }

    if (form.value.imageUrl != this.myTree.imageUrl) {
      this.treeService.editTreePhoto(form.value.imageUrl, this.myTree.ID).subscribe((response) => {
        console.log(response);
        this.response = "complete";
      },
        (err) => {

          if (err.error.message == "Invalid image, url is not validated") {
            this.response = "invalidURL";
          }
          else {
            this.response = "fatalError";
          }
          console.log(err);
        });
    }
    else {
      this.r2 = "noEdit";
    }

    if (form.value.treeDescription != this.myTree.description) {
      this.treeService.editTreeDescription(form.value.treeDescription, this.myTree.ID).subscribe((response) => {
        console.log(response);
        this.response = "complete";
      }),
        (err) => {
          console.log("err is:" + err);
          this.response = "fatalError";
        }
    }
    else {
      this.r3 = "noEdit";
    }

    if (form.value.aboutBio != this.myTree.aboutBio) {
        this.treeService.editAboutBio(form.value.aboutBio, this.myTree.ID).subscribe((response) => {
          console.log(response);
          this.response = "complete";
        }),
          (err) => {
            console.log("err is:" + err);
            this.response = "fatalError";
          }
      }
      else {
        this.r4 = "noEdit";
    }
    if( form.value.colorScheme!= this.myTree.colorScheme&& form.value.colorScheme!=null && form.value.colorScheme.charAt(0)=='#')
    {  
      var regex = /^#[0-9A-F]{6}$/i; 
      var isHex = regex.test(form.value.colorScheme);
      if(isHex)
      {
        this.treeService.setColorScheme(form.value.colorScheme, this.myTree.ID).then((response) => {
          console.log(response);
          this.response = "complete";
          }),
            (err) => {
              console.log("err is:" + err);
              this.response = "fatalError";
            }
      }
      else
      {
        form.value.colorScheme="Invalid Hex Code";
        this.r5 = "noEdit";
      }
    }
    else {
      this.r5 = "noEdit";
    }
    if (this.r1 == "noEdit" && this.r2 == "noEdit" && this.r3 == "noEdit" && this.r4 == "noEdit" && this.r5=="noEdit") {
      this.response = "noEdit";
    }

   
}

  cancelEdits() {
    var id = this.route.snapshot.params['id'];
    this._router.navigate(['/tree/' + this.myTree.ID]);
    // this.returnToParent.emit('dash');
  }
}

