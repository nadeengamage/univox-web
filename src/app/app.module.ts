import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';

import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './service/authconfig.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FullLayoutComponent } from './layouts/full-layout/full-layout.component';
import { NavBarComponent } from './layouts/full-layout/nav-bar/nav-bar.component';
import { LoginComponent } from './layouts/login/login.component';
import { FooterComponent } from './layouts/full-layout/footer/footer.component';
import { SideMenuComponent } from './univox/side-menu/side-menu.component';
import { UnivoxComponent } from './univox/univox.component';
import { UsersComponent } from './univox/users/users.component';
import { FacultyComponent } from './univox/faculty/faculty.component';
import { DegreeComponent } from './univox/degree/degree.component';
import { CriteriaComponent } from './univox/criteria/criteria.component';
import { ApplicantComponent } from './univox/applicant/applicant.component';
import { UserDetailsService } from './service/user-details-service';
import { DataTablesModule } from 'angular-datatables';
import { NoRightClickDirective } from './service/no-right-click.directive';

const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'right',
      distance: 12
    },
    vertical: {
      position: 'top',
      distance: 70,
      gap: 10
    }
  },
  theme: 'material',
  behaviour: {
    autoHide: 5000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};

@NgModule({
  declarations: [
    NoRightClickDirective,
    AppComponent,
    FullLayoutComponent,
    NavBarComponent,
    LoginComponent,
    FooterComponent,
    SideMenuComponent,
    UnivoxComponent,
    UsersComponent,
    FacultyComponent,
    DegreeComponent,
    CriteriaComponent,
    ApplicantComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DataTablesModule,
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.wanderingCubes,
      backdropBackgroundColour: 'rgba(0,0,0,0.5)',
      backdropBorderRadius: '4px',
      primaryColour: '#ffffff',
      secondaryColour: '#ffffff',
      tertiaryColour: '#ffffff'
    }),
    NotifierModule.withConfig(customNotifierOptions)
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    UserDetailsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
