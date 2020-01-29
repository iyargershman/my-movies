import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError, of } from 'rxjs';
import { IMovieDetails, SearchParams } from './movies.models';
import { moviesConfig } from './movies.config';

@Injectable({
  providedIn: 'root',
})

export class MoviesService {
  private maxYear: number;
  private moviesCache: Map<string, IMovieDetails[]>;
  private numberOfResults: number;

  constructor(private http: HttpClient) {
    this.moviesCache = new Map();
    this.maxYear = (new Date()).getFullYear() + 5;
  }

  getTotalNumberOfResults(): number {
    return this.numberOfResults;
  }

  getMovies(seachParams: SearchParams) {
    const resultFromCache = this.getMovieFromCache(seachParams);
    if (resultFromCache) {
      return of(resultFromCache);
    }
    const url = this.buildUrl(seachParams);
    return this.http.get(url).pipe(
      catchError( (error) => {
        let message = error.message;
        if (error.status === 429) {
          message='Too many requests. Please try again later';
        }
        return throwError({message});
      }),
      map((moviesData: any) => {
        let result: IMovieDetails[] = [];
        if(moviesData.Response === moviesConfig.api.errorValue) {
          throw new Error(moviesData.Error);
        }
        if (!moviesData.Search) { // single movie request
          return {
            title: moviesData.Title,
            year: moviesData.Year,
            image: moviesData.Poster !== 'N/A' ? moviesData.Poster : null,
            language: moviesData.Language,
            imdbRating: moviesData.imdbRating !== 'N/A' ? moviesData.imdbRating : null,
            length: moviesData.Runtime,
            country: moviesData.Country,
            description: moviesData.Plot !== 'N/A' ? moviesData.Plot : null,
            imdbId: moviesData.imdbID
          } as IMovieDetails;
        }
        this.numberOfResults = parseInt(moviesData.totalResults);
        const movies: IMovieDetails[] = moviesData.Search.map(movieData => {
          return {
            title: movieData.Title,
            year: movieData.Year,
            image: movieData.Poster !== 'N/A' ? movieData.Poster : null,
            imdbId: movieData.imdbID
          }
        });
        this.moviesCache.set(this.getKeyForCache(seachParams), movies);
        return movies as IMovieDetails[];
      })
    );
  }

  getMaxYear(): number{
    return this.maxYear;
  }

  getMovieByImdbId(imdbKey: string) {
    const url = `${moviesConfig.api.url}&${moviesConfig.api.imdbKey}=${imdbKey}&${this.getApiKeyParam()}`;
  }

  private getMovieFromCache(seachParams: SearchParams): IMovieDetails[] {
    const key = this.getKeyForCache(seachParams);
    return this.moviesCache.get(key);
  }

  private getKeyForCache(seachParams: SearchParams): string {
    return `${seachParams.title}${seachParams.year || ''}${seachParams.page || ''}`;
  }

  private getApiKeyParam(): string {
    return `${moviesConfig.api.apiKey}=${moviesConfig.api.apiKeyValue}`;
  }

  private getValueParam(searchParams: SearchParams): string {
    return searchParams.imdbId ? `&${moviesConfig.api.imdbKey}=${searchParams.imdbId}` : `${moviesConfig.api.searchKey}=${searchParams.title}`;
  }

  private buildUrl(searchParams: SearchParams): string {
    const apiKeyParam = `${moviesConfig.api.apiKey}=${moviesConfig.api.apiKeyValue}`;
    const valueParam = this.getValueParam(searchParams);
    const yearParam = searchParams.year ? `&${moviesConfig.api.yearKey}=${searchParams.year}` : '';
    const pageParam = searchParams.page ? `&${moviesConfig.api.pageKey}=${searchParams.page}` : ``;
    const url = `${moviesConfig.api.url}?${valueParam}${yearParam}${pageParam}&${apiKeyParam}`;
    return url;
  }
}
