import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FooterComponent } from './footer/footer.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { PaginationComponent } from './pagination/pagination.component';



@NgModule({
  declarations: [
    FooterComponent,
    SpinnerComponent,
    PaginationComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule
  ], 
  exports: [
    FooterComponent,
    SpinnerComponent,
    FontAwesomeModule,
    PaginationComponent
  ]
})
export class SharedModule { }
