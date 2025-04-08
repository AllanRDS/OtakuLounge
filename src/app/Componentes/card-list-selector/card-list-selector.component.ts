import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, catchError, finalize, tap, retryWhen, take } from 'rxjs/operators';
import { AnimeService } from '../../Services/anime.service';

interface CacheItem {
  data: any[];
  timestamp: number;
}

@Component({
  selector: 'cardSelector',
  templateUrl: './card-list-selector.component.html',
  styleUrl: './card-list-selector.component.css'
})
export class CardListSelectorComponent implements OnInit {
  private readonly CACHE_DURATION = 30 * 60 * 1000;

  animes: any[] = [];
  movies: any[] = [];
  music: any[] = [];
  filteredList: any[] = [];
  currentCategory: 'animes' | 'filmes' | 'outra' = 'animes';

  isLoading: boolean = false;
  loadError: string | null = null;

  constructor(private animeService: AnimeService) { }

  ngOnInit() {
    this.loadInitialContent();
  }

  private getCachedData(key: string): CacheItem | null {
    try {
      const cachedItem = localStorage.getItem(key);
      if (cachedItem) {
        const parsedItem: CacheItem = JSON.parse(cachedItem);

        if (Date.now() - parsedItem.timestamp < this.CACHE_DURATION) {
          return parsedItem;
        }
      }
      return null;
    } catch (error) {
      console.error('Erro ao recuperar cache', error);
      return null;
    }
  }

  private saveToCache(key: string, data: any[]) {
    try {
      const cacheItem: CacheItem = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(key, JSON.stringify(cacheItem));
    } catch (error) {
      console.error('Erro ao salvar cache', error);
    }
  }

  private loadDataWithCache(
    key: string,
    serviceMethod: () => Observable<any>,
    setCacheMethod: (data: any[]) => void
  ): Observable<any> {
    const cachedData = this.getCachedData(key);

    if (cachedData) {
      setCacheMethod(cachedData.data);
      return of({ data: cachedData.data });
    }

    return serviceMethod().pipe(
      delay(500),
      catchError(err => {
        this.loadError = 'Erro ao carregar conteúdo';
        console.error('Erro ao carregar conteúdo', err);
        return of(null);
      }),
      retryWhen(errors =>
        errors.pipe(
          delay(2000),
          take(3)
        )
      ),
      tap(response => {
        if (response?.data) {
          const limitedData = response.data.slice(0, 18);
          this.saveToCache(key, limitedData);
          setCacheMethod(limitedData);
        }
      })
    );
  }

  loadInitialContent() {
    this.isLoading = true;
    this.loadError = null;

    of(null).pipe(
      delay(0),
      finalize(() => this.loadAnimes())
    ).subscribe();
  }

  loadAnimes() {
    this.isLoading = true;

    this.loadDataWithCache(
      'animes',
      () => this.animeService.getTopAnime(),
      (data) => {
        this.animes = data;
        if (this.currentCategory === 'animes') {
          this.filteredList = this.animes;
        }
        this.preloadImages(this.animes);
      }
    ).pipe(
      finalize(() => this.loadMovies())
    ).subscribe();
  }

  loadMovies() {
    this.loadDataWithCache(
      'movies',
      () => this.animeService.getTopMovie(),
      (data) => {
        this.movies = data;
        this.preloadImages(this.movies);
      }
    ).pipe(
      finalize(() => this.loadMusic())
    ).subscribe();
  }

  loadMusic() {
    this.loadDataWithCache(
      'music',
      () => this.animeService.getTopMusic(),
      (data) => {
        this.music = data;
        this.preloadImages(this.music);
      }
    ).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe();
  }

  private preloadImages(items: any[]) {
    items.forEach(item => {
      if (item.image_url) {
        const img = new Image();
        img.src = item.image_url;
      }
    });
  }

  clearCache() {
    localStorage.removeItem('animes');
    localStorage.removeItem('movies');
    localStorage.removeItem('music');
  }

  selectCategory(category: 'animes' | 'filmes' | 'outra') {
    this.currentCategory = category;

    switch (category) {
      case 'animes':
        this.filteredList = this.animes;
        break;
      case 'filmes':
        this.filteredList = this.movies;
        break;
      case 'outra':
        this.filteredList = this.music;
        break;
    }
  }
}