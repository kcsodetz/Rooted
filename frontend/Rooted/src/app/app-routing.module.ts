import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth-guard';
import { SignUpComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './home/home.component';
import { TreeComponent } from './tree/tree.component'
import { ProfileComponent } from './profile/profile.component';
import { AdminComponent } from './tree/admin/admin.component';
import { PhotoLibraryComponent } from './photo-library/photo-library.component'
import { OtherProfileComponent } from './other-profile/other-profile.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ChangeEmailComponent } from './change-email/change-email.component';
import { AboutComponent } from './about/about.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ReportuserComponent } from './reportuser/reportuser.component';
import { ReportgroupComponent } from './reportgroup/reportgroup.component';



const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',

  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'other-profile',
    component: OtherProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/:id',
    component: AdminComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    component: LoginComponent

  },
  {
    path: 'register',
    component: SignUpComponent
  },
  {
    path: 'forgot',
    component: ForgotPasswordComponent
  },
  {
    path:'report-user',
    component: ReportuserComponent
  },
  {
    path: 'report-group',
    component: ReportgroupComponent
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent
  },
  {
    path: 'change-email',
    component: ChangeEmailComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    //:id is parameter, important 
    path: 'tree/:id',
    component: TreeComponent,
    canActivate: [AuthGuard],
    data: {
      type: 'tree'
    }
  },
  {
    path: 'photo-library',
    component: PhotoLibraryComponent
  },
  {
    path: 'not-found',
    component: NotFoundComponent
  },
  {
    // 404 error, leave this one as last route check
    path: '**',
    redirectTo: 'not-found',
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
