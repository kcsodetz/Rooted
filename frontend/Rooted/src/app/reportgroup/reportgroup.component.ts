import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { NgForm, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TreeService } from '../services/tree.service';
import { UserService} from '../services/user.service'
import { Account } from '../models/account.model';
@Component({
  selector: 'app-reportgroup',
  templateUrl: './reportgroup.component.html',
  styleUrls: ['./reportgroup.component.scss']
})
export class ReportgroupComponent implements OnInit {

  treeID: string;
  treeName: string;
  reporter: string;
  reportForm: FormGroup;
  username: string ="";
  account: Account;
  constructor(private _location: Location, private treeService: TreeService, private formBuilder: FormBuilder, private userService: UserService) { }

  ngOnInit() {
    console.log(history.state.data);
    this.treeID = history.state.data.treeID;
    this.treeName = history.state.data.treeName;
    this.reporter = history.state.data.reporter;
    this.userService.getAccountInfo().then((res)=>{
      this.account=new Account(res);
      this.username=this.account.username;
    });
    // Form inputs and validators
    this.reportForm = this.formBuilder.group({
      reason: ['']
    })
  }

  backClicked() {
    this._location.back();
  }

  submitReport(treeID: string, treeName: string, reason: string, reporter: string) {
    console.log(treeID, treeName, reason, this.username)
    console.log(this.username)
    this.treeService.reportTree(treeID, treeName, reason, this.username).then(() => {
      var confirm = window.alert('Tree: ' + treeName + ' Reported');
      window.location.replace("/home");
      console.log(confirm)
    });
  }

}
