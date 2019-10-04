import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TreeService } from '../services/tree.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-reportuser',
  templateUrl: './reportuser.component.html',
  styleUrls: ['./reportuser.component.scss']
})
export class ReportuserComponent implements OnInit {

  treeID: string;
  userToReport: string;
  reportForm: FormGroup;

  constructor(private _location: Location, private treeService: TreeService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    console.log(history.state.data)
    this.treeID = history.state.data.treeID;
    this.userToReport = history.state.data.userToReport;

    this.reportForm = this.formBuilder.group({
      reason: ['']
    })
  }

  backClicked() {
    this._location.back();
  }

  submitReport(treeID: string, reason: string, userToReport: string) {
    console.log(treeID, reason, userToReport)
    this.treeService.reportUser(treeID, reason, userToReport).then(() => {
      var confirm = window.alert('Tree: ' + userToReport + ' Reported');
      window.location.replace("/home");
      console.log(confirm)
    });
  }

}
