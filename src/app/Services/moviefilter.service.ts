import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MoviefilterService {
  apiLink = "https://api.jikan.moe/v4";

  private genreMap: { [key: string]: number } = {};

  constructor(private http: HttpClient) { }

  loadGenreMapping(): Observable<void> {
    return this.http.get<any>(`${this.apiLink}/genres/anime`).pipe(
      map(response => {
        this.genreMap = response.data.reduce((acc: any, genre: any) => {
          acc[genre.name] = genre.mal_id;
          return acc;
        }, {});
      })
    );
  }

  // Método de filtro com parâmetros opcionais
  getFilteredFilmes(
    searchTerm: string = '',
    page: number = 1,
    genre: string = '',
    year: string = ''
  ): Observable<any> {
    let params = new HttpParams()
      .set('sfw', 'true')
      .set('type', 'movie')
      .set('page', page.toString())
      .set('order_by', 'popularity')
      .set('sort', 'asc')
      .set('limit', '24');

    if (searchTerm) {
      params = params.set('q', searchTerm);
    }

    if (genre && this.genreMap[genre]) {
      params = params.set('genres', this.genreMap[genre].toString());
    }

    if (year) {
      params = params.set('start_date', `${year}-01-01`);
    }

    return this.http.get<any>(`${this.apiLink}/anime`, { params }).pipe(
      map(response => {
        let filteredData = response.data;

        if (year) {
          filteredData = filteredData.filter((anime: any) => {
            if (anime.aired && anime.aired.from) {
              const animeYear = new Date(anime.aired.from).getFullYear();
              return animeYear === parseInt(year);
            }
            return false;
          });
        }

        return {
          ...response,
          data: filteredData,
          pagination: {
            ...response.pagination,
            items: {
              ...response.pagination.items,
              total: filteredData.length
            }
          }
        };
      })
    );
  }

  getAnimeGenres(): Observable<any> {
    return this.http.get<any>(`${this.apiLink}/genres/anime`);
  }

  getFilmesYears(): string[] {
    const currentYear = new Date().getFullYear();
    return Array.from(
      {length: 40},
      (_, i) => (currentYear - i).toString()
    );
  }

  getInitialFilmes(page: number) {
    return this.http.get<any>(`${this.apiLink}/anime?type=movie&page=${page}&order_by=popularity&limit=24`);
  }
}