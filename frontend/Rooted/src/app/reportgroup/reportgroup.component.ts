import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { NgForm, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TreeService } from '../services/tree.service';

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
  
  constructor(private _location: Location, private treeService: TreeService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    console.log(history.state.data);
    this.treeID = history.state.data.treeID;
    this.treeName = history.state.data.treeName;
    this.reporter = history.state.data.reporter;

    // Form inputs and validators
    this.reportForm = this.formBuilder.group({
      reason: ['']
    })
  }

  backClicked() {
    this._location.back();
  }

  submitReport(treeID: string, treeName: string, reason: string, reporter: string) {
    console.log(treeID, treeName, reason, reporter)
    this.treeService.reportTree(treeID, treeName, reason, reporter).then(() => {
      var confirm = window.alert('Tree: ' + treeName + ' Reported');
      window.location.replace("/home");
      console.log(confirm)
    });
  }

}
