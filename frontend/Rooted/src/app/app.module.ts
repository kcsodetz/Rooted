import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import {
  MDBBootstrapModule,
  ModalModule,
  NavbarModule,
  BadgeModule,
  BreadcrumbModule,
  ButtonsModule,
  CarouselModule,
  CardsFreeModule,
  ChartsModule,
  CheckboxModule,
  CollapseModule,
  DropdownModule,
  IconsModule,
  InputsModule,
  PopoverModule,
  TooltipModule,
  WavesModule
} from 'angular-bootstrap-md';


import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignUpComponent } from './auth/signup/signup.component';
import { AuthComponent } from './auth/auth.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { FormsModule, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './home/home.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { TreeComponent } from './tree/tree.component';
import { EditNameComponent } from './tree/admin/edit-name/edit-name.component';

import { ChangePasswordComponent } from './change-password/change-password.component';
import { ChangeEmailComponent } from './change-email/change-email.component';
import { AboutComponent } from './about/about.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProfileComponent } from './profile/profile.component';
import { PhotoLibraryComponent } from './photo-library/photo-library.component'

import { OtherProfileComponent } from './other-profile/other-profile.component';
import { CreategroupComponent } from './creategroup/creategroup.component';
import { ReportuserComponent } from './reportuser/reportuser.component';
import { ReportgroupComponent } from './reportgroup/reportgroup.component';
import { AdminComponent } from './tree/admin/admin.component';
import { SearchComponent } from './search/search.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SiteAdminPageComponent } from './site-admin-page/site-admin-page.component';



@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    AuthComponent,
    LoginComponent,
    EditNameComponent,
    HomeComponent,
    ForgotPasswordComponent,

    ChangePasswordComponent,
    ChangeEmailComponent,
    AboutComponent,
    NotFoundComponent,
    ProfileComponent,
    PhotoLibraryComponent,

    OtherProfileComponent,

    CreategroupComponent,

    ReportuserComponent,
    TreeComponent,
    ReportgroupComponent,
    AdminComponent,
    SearchComponent,
    SiteAdminPageComponent

  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MDBBootstrapModule.forRoot(),
    ModalModule.forRoot(),
    NavbarModule,
    BadgeModule,
    BreadcrumbModule,
    ButtonsModule,
    CardsFreeModule,
    CarouselModule.forRoot(),
    ChartsModule,
    CheckboxModule,
    CollapseModule.forRoot(),
    DropdownModule.forRoot(),
    IconsModule,
    InputsModule.forRoot(),
    ModalModule.forRoot(),
    NavbarModule,
    PopoverModule.forRoot(),
    TooltipModule.forRoot(),
    WavesModule.forRoot(),
    BrowserAnimationsModule,
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
