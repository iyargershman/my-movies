import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IMovieDetails, SearchParams } from '../movies.models';
import { MoviesService } from '../movies.service';
import {moviesConfig } from '../movies.config';

@Component({
  selector: 'movies-list',
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.scss']
})
export class MoviesListComponent implements OnInit {
  @Input() movies: IMovieDetails[] = [];
  @Output() pageSelected: EventEmitter<any> = new EventEmitter();
  currentPage = 1;
  displayNumberOfPages: number;
  pagesArray: number[];
  selectedMovie: IMovieDetails;

  constructor(private moviesService: MoviesService) { }

  ngOnInit() {
    const numberOfTotalMovies = this.moviesService.getTotalNumberOfResults();
    const divided = Math.floor(numberOfTotalMovies / moviesConfig.moviesPerPage);
    const numberOfPages = numberOfTotalMovies % moviesConfig.moviesPerPage ? divided + 1 : divided;
    this.pagesArray = Array(numberOfPages).fill(0).map((val, i) => i + 1);
  }

  pageChanged(currentPage: number) {
    this.currentPage = currentPage;
    this.pageSelected.emit(this.currentPage);
  }
}
