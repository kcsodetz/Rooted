import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service'

@Component({
  selector: 'app-site-admin-page',
  templateUrl: './site-admin-page.component.html',
  styleUrls: ['./site-admin-page.component.scss']
})
export class SiteAdminPageComponent implements OnInit {
  users: Object;
  bannedUsers: Object;
  ban: [string];
  admins: [String];

  constructor(private userService: UserService) { }

  activeTabSection = 'Trees';

  ngOnInit() {
    this.ban = [null];
    this.userService.getAllUsers().then((res) => {
      this.users = res;
    });
    this.userService.swAllBannedUsers().then((res) => {
      this.bannedUsers = res;
      let x = 0;
      while(this.bannedUsers[x]!=undefined){
        this.ban[x] = this.bannedUsers[x++];
      }
    })
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
  }

  removeAdmin(username: string){
    this.userService.swRemoveAdmin(username);
    console.log(username + "removed as admin!");
  }

  banUser(username: string){
    this.userService.swBanUser(username);
    console.log(username + "banned from the site");
  }

  unbanUser(username: string){
    this.userService.swUnbanUser(username);
    console.log(username + "unbanned from the site");
  }

}
