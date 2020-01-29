import { Component, OnInit, Input} from '@angular/core';

import { IMovieDetails, SearchParams } from '../movies.models';
import { moviesConfig } from '../movies.config';
import { MoviesService } from '../movies.service';

@Component({
  selector: 'movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss']
})
export class MovieDetailsComponent implements OnInit {
  @Input() movieImdbId: string;
  movie: IMovieDetails;
  imdbLink: string;
  error: string;

  constructor(private moviesService: MoviesService) { }

  ngOnInit() {
    this.moviesService.getMovies(new SearchParams({imdbId: this.movieImdbId}))
      .subscribe(
        (result: IMovieDetails) => this.movie = result,
        error => this.handleError(error)
      );
    this.imdbLink = `${moviesConfig.imdbLinkPrefix}${this.movieImdbId}`;
  }

  goToImdb() {
    window.open(this.imdbLink, "_blank");
  }

  private handleError(error: Error) {
    console.log(`Error: ${error.message}`);
    if (error.message.includes('not found')) {
      this.error = "error";
    } else {
      this.error = 'Failed to get movie data';
    }
  }

}
