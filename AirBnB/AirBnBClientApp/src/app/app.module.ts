import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import 'hammerjs';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component';
import { AuthService } from './_services/auth.service';
import { AlertifyService } from './_services/alertify.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';
import {HttpClientModule} from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { UsersComponent } from './users/users.component';
import { AdminGuard } from './_guards/admin.guard';
import { UserService } from './_services/user.service';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { AuthGuard } from './_guards/auth.guard';
import { AmenitiesComponent } from './amenities/amenities.component';
import { AmenitiesService } from './_services/amenities.service';
import { ApartmentsComponent } from './apartments/apartments.component';
import { AddApartmentComponent } from './add-apartment/add-apartment.component';
import { ApartmentService } from './_services/apartment.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgxGalleryModule } from 'ngx-gallery';
import { FileUploadModule } from 'ng2-file-upload';
import { NgSelectModule } from '@ng-select/ng-select';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ApartmentResolver } from './_resolvers/apartment.resolver';
import { ApartmentDetailComponent } from './apartment-detail/apartment-detail.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { UpdateApartmentComponent } from './update-apartment/update-apartment.component';
import { AllApartmentsResolver } from './_resolvers/all.resolver';
import { Ng5SliderModule } from 'ng5-slider';
import { RatingModule } from 'ngx-bootstrap/rating';
import { HostGuard } from './_guards/host.guard';
import { AddReservationComponent } from './add-reservation/add-reservation.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { ReservationsResolver } from './_resolvers/reservations.resolver';

const appRoutes: Routes = [
   { path: 'home',             component: HomeComponent},
   { path: 'users',            component: UsersComponent, canActivate: [AdminGuard]},
   { path: 'amenities',        component: AmenitiesComponent, canActivate: [AdminGuard]},
   { path: 'registration',     component: RegistrationComponent},
   { path: 'apartments',       component: ApartmentsComponent, resolve: {apms: AllApartmentsResolver}},
   { path:  'apartment/:name', component: ApartmentDetailComponent, resolve: {apm: ApartmentResolver}},
   { path:  'update/:name',    component: UpdateApartmentComponent, resolve: {apm: ApartmentResolver}},
   { path: 'newapartment',     component: AddApartmentComponent, canActivate: [HostGuard]},
   { path: 'editProfile',      component: EditProfileComponent, canActivate: [AuthGuard]},
   {path:  'reserve/:name',    component: AddReservationComponent, resolve: {apm: ApartmentResolver}},
   {path:  'reservations',    component: ReservationsComponent, resolve: {res: ReservationsResolver}},
   { path: '**',               component: HomeComponent}
 ];

@NgModule({
   declarations: [
      AppComponent,
      NavComponent,
      HomeComponent,
      RegistrationComponent,
      UsersComponent,
      EditProfileComponent,
      AmenitiesComponent,
      ApartmentsComponent,
      AddApartmentComponent,
      ApartmentDetailComponent,
      UpdateApartmentComponent,
      AddReservationComponent,
      ReservationsComponent
   ],
   imports: [
      RouterModule.forRoot(
         appRoutes
      ),
      BrowserModule,
      AppRoutingModule,
      FormsModule,
      BrowserAnimationsModule,
      ReactiveFormsModule,
      BsDatepickerModule.forRoot(),
      RatingModule.forRoot(),
      ModalModule.forRoot(),
      BsDropdownModule.forRoot(),
      CarouselModule.forRoot(),
      NgxGalleryModule,
      FileUploadModule,
      AmazingTimePickerModule,
      NgSelectModule,
      Ng5SliderModule,
      BrowserAnimationsModule,
      JwtModule.forRoot({
         config: {
           tokenGetter: () => {
              return localStorage.getItem('token');
           },
           whitelistedDomains: ['localhost:4200', 'localhost:44371'],
         }
       }),
      HttpClientModule
   ],
   providers: [
      AuthService,
      AlertifyService,
      UserService,
      AmenitiesService,
      ApartmentService,
      ApartmentResolver,
      AllApartmentsResolver,
      ReservationsResolver
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
