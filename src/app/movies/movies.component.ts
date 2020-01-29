import { Component, OnInit } from '@angular/core';

import { MoviesService } from './movies.service';
import { IMovieDetails, SearchParams } from './movies.models';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit {
  title: string;
  year: number;
  movies: IMovieDetails[];
  error: string;
  formYearError: string;
  formTitleError: string;
  searchParams: SearchParams;

  constructor(private moviesService: MoviesService) { }

  ngOnInit() {
  }

  search() {
    if (!this.title) {
      this.formTitleError = 'title is required';
      return;
    }
    this.formTitleError = '';
    this.movies = [];
    this.error = null;
    this.searchParams = new SearchParams({title: this.title, year: this.year ? this.year.toString() : ''});
    this.getMovies();
  }

  getMovies(page?: number) {
    if (page) {
      this.searchParams.page = page;
    }
    this.moviesService.getMovies(this.searchParams)
    .subscribe(
      (result: IMovieDetails[]) => this.handleResult(result),
      error => this.handleError(error)
    );
  }

  checkYearValid(yearValue: number) {
    if (yearValue > this.moviesService.getMaxYear()) {
      this.formYearError = 'Invalid year';
    } else {
      this.formYearError = '';
    }
  }

  checkTitleValid(titleValue: string) {
    if (titleValue.length) {
      this.formTitleError = '';
    } else {
      this.formTitleError = 'title is required';
    }
  }
  
  getMoviesPerPage(page: number) {
    this.getMovies(page);
  }

  private handleError(error: Error) {
    console.log(`Error: ${error.message}`);
    if (error.message.includes('not found')) {
      this.error = `No results found for title ${this.title} ${this.year ? ` and year ${this.year}` : ''}`
    } else {
      this.error = 'Failed to get movie data';
    }
  }

  private handleResult(movies: IMovieDetails[]) {
    this.movies = movies;
  }
}
