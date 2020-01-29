import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MoviesComponent } from './movies.component';
import { MoviesService } from './movies.service';
import { MovieDetailsComponent } from './movie-details/movie-details.component';
import { MoviesListComponent } from './movies-list/movies-list.component';

@NgModule({
  declarations: [
    MoviesComponent,
    MovieDetailsComponent,
    MoviesListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  exports: [
    MoviesComponent,
    MovieDetailsComponent,
  ],
  providers: [
    MoviesService
  ]
})
export class MoviesModule { }
