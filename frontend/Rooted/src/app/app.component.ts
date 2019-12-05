import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router, UrlSerializer } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Account } from './models/account.model';
import { UserService } from './services/user.service';
import { AdminService } from './services/admin.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Rooted';
  username: String = 'User';
  userAuthed: Boolean;
  account: Account;
  private loggedIn = new BehaviorSubject<boolean>(false); // {1}
  admObj: Object;
  admins: [string];

  constructor(private adminService: AdminService, private router: Router, public authService: AuthService, public userService: UserService) { }

  get auth() { return (!localStorage.getItem('token')); }

  logout() {
    this.userAuthed = false;
    this.authService.logout();
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnInit() {
    this.admins = [null];
    if (this.authService.autoAuthUser()) {
      this.userAuthed = true;
    }
    this.userService.getAccountInfo().then((res) => {
      this.account = new Account(res);
      this.username = this.account.username;
    });
    this.adminService.getAllAdmins().then((res) => {
      this.admObj = res;
      let x = 0;
      while(this.admObj[x]!=undefined){
        this.admins[x] = this.admObj[x++];
      }
    });
  }
}
