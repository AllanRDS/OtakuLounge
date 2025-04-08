import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AnimeService {
  private apiLink = "https://api.jikan.moe/v4";

  constructor(private http: HttpClient) {}

   // Requisição usada na pesquisa do Modal(navbar)
  getAnimesMovies(searchTerm: string): Observable<any> {
    const params = new HttpParams()
      .set('q', searchTerm)
      .set('sfw', 'true');

    return this.http.get(`${this.apiLink}/anime`, { params }).pipe(
      retry(3)
    );
  }

  // Requisição usada no Carrosel Principal(carrosel)
  getCurrentAnimeSeason(): Observable<any> {
    return this.http.get(`${this.apiLink}/seasons/now`, {
      params: new HttpParams().set('sfw', 'true')
    }).pipe(retry(3));
  }

  // Requisição usada no Animes-Lançamento(carrosel-cards)
  getSeasonUpcoming(): Observable<any> {
    return this.http.get(`${this.apiLink}/seasons/upcoming`, {
      params: new HttpParams().set('sfw', 'true')
    }).pipe(retry(3));
  }

  // Requisição usada no Card-Selector(card-list-selector)
  getTopAnime(): Observable<any> {
    const params = new HttpParams()
      .set('type', 'tv')
      .set('sfw', 'true')
      .set('filter', 'bypopularity');

    return this.http.get(`${this.apiLink}/top/anime`, { params }).pipe(
      retry(3)
    );
  }

  // Requisição usada no Card-Selector(card-list-selector)
  getTopMovie(): Observable<any> {
    const params = new HttpParams()
      .set('type', 'movie')
      .set('sfw', 'true')
      .set('filter', 'bypopularity');

    return this.http.get(`${this.apiLink}/top/anime`, { params }).pipe(
      retry(3)
    );
  }

  //Requisição usada no Card-Selector(card-list-selector)
  getTopMusic(): Observable<any> {
    const params = new HttpParams()
      .set('type', 'music')
      .set('sfw', 'true')
      .set('filter', 'bypopularity');

    return this.http.get(`${this.apiLink}/top/anime`, { params }).pipe(
      retry(3)
    );
  }

  //Requisição usada nos Personagens Populares(carrosel-cards-p)
  getTopCharacters(): Observable<any> {
    return this.http.get(`${this.apiLink}/top/characters`).pipe(
      retry(3)
    );
  }
}