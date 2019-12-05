import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service'
import { AdminService } from '../services/admin.service'
import { TreeService } from '../services/tree.service'

@Component({
  selector: 'app-site-admin-page',
  templateUrl: './site-admin-page.component.html',
  styleUrls: ['./site-admin-page.component.scss']
})
export class SiteAdminPageComponent implements OnInit {
  users: Object;
  bannedUsers: Object;
  admObj: Object;
  ban: [string];
  admins: [string];
  treeObj: Object;
  trees: [Object];

  constructor(private treeService: TreeService, private userService: UserService, private adminService: AdminService) { }

  activeTabSection = 'Trees';

  ngOnInit() {
    this.admins = [null];
    this.ban = [null];
    this.trees = [null];
    this.userService.getAllUsers().then((res) => {
      this.users = res;
    });
    this.userService.swAllBannedUsers().then((res) => {
      this.bannedUsers = res;
      let x = 0;
      while(this.bannedUsers[x]!=undefined){
        this.ban[x] = this.bannedUsers[x++];
      }
    });
    this.adminService.getAllAdmins().then((res) => {
      this.admObj = res;
      let x = 0;
      while(this.admObj[x]!=undefined){
        this.admins[x] = this.admObj[x++];
      }
    });
    this.treeService.getAllTrees().then((res) => {
      this.treeObj = res;
      let x = 0;
      while(this.treeObj[x]!=undefined){
        this.trees[x] = this.treeObj[x++];
      }
    });
  }

  toggle(SectionName) {
    //console.log(SectionName);
    if (this.activeTabSection === SectionName) {
      return;
    }
    document.getElementById(this.activeTabSection + 'Tab').classList.toggle('active');
    document.getElementById(this.activeTabSection + 'Section').classList.toggle('invisible');
    document.getElementById(SectionName + 'Tab').classList.toggle('active');
    document.getElementById(SectionName + 'Section').classList.toggle('invisible');
    this.activeTabSection = SectionName;
  }

  makeAdmin(username: string){
    this.userService.swAddAdmin(username);
    console.log(username + " made admin!");
    window.location.replace("/site-admins");
  }

  removeAdmin(username: string){
    this.userService.swRemoveAdmin(username);
    console.log(username + " removed as admin!");
    window.location.replace("/site-admins");
  }

  banUser(username: string){
    if(confirm("Are you sure you want to ban this user from the website?")){
      this.userService.swBanUser(username);
      console.log(username + " banned from the site");
      window.location.replace("/site-admins");
    }
  }

  unbanUser(username: string){
    if(confirm("Are you sure you want to unban this user?")){
      this.userService.swUnbanUser(username);
      console.log(username + " unbanned from the site");
      window.location.replace("/site-admins");
    }
  }

  deleteTree(treeId: string) {
    if(confirm("Are you sure you want to permanently delete this tree?")){
      this.treeService.deleteChosenTree(treeId);
      console.log(treeId + " banned from the site")
      window.location.replace("/site-admins");
    }
  }

}
