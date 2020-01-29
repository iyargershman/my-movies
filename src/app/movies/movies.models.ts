export interface IMovieDetails {
    title: string;
    year: string;
    genre: string;
    image: string;
    language: string;
    imdbRating: string;
    length: string;
    country: string;
    description: string;
    imdbId: string;
}

export class SearchParams {
    title?: string;
    year?: string;
    page?: number;
    imdbId?: string;

    constructor(params: SearchParams) {
        this.title = params.title;
        this.year = params.year;
        this.page = params.page;
        this.imdbId = params.imdbId;
    }
}