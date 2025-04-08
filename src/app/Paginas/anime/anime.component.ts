import { Component, OnInit } from '@angular/core';
import { AnimefilterService } from '../../Services/animefilter.service';
import { of, Observable, throwError } from 'rxjs';
import { catchError, retry, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-anime',
  templateUrl: './anime.component.html',
  styleUrls: ['./anime.component.css']
})
export class AnimeComponent implements OnInit {
  animes: any[] = [];
  searchTerm: string = '';
  selectedGenre: string = '';
  selectedYear: string = '';
  isLoading: boolean = false;
  currentPage: number = 1;
  totalPages: number = 1;

  genres: any[] = [];
  years: string[] = [];

  private isInitialLoad: boolean = true;
  private MAX_RETRIES = 5;

  constructor(private animeFilterService: AnimefilterService) {}

  ngOnInit() {
    this.loadInitialData();
  }

  loadInitialData() {
    this.isLoading = true;

    this.animeFilterService.loadGenreMapping().pipe(
      retry(this.MAX_RETRIES),
      switchMap(() => this.safeLoadInitialAnimes()),
      catchError(error => {
        console.error('Erro fatal no carregamento inicial', error);
        this.isLoading = false;
        return throwError(() => new Error('Falha no carregamento inicial'));
      })
    ).subscribe({
      next: () => {
        this.loadGenres();
        this.loadYears();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro no carregamento inicial', err);
        this.isLoading = false;
      }
    });
  }

  safeLoadInitialAnimes(): Observable<any> {
    return this.animeFilterService.getInitialAnimes(this.currentPage).pipe(
      retry(this.MAX_RETRIES),
      map(response => {
        if (!response || !response.data || response.data.length === 0) {
          throw new Error('Nenhum anime encontrado');
        }

        this.animes = response.data;
        this.totalPages = response.pagination.last_visible_page; // Atualiza o total de páginas

        return response;
      }),
      catchError(error => {
        console.error('Erro ao carregar animes iniciais', error);
        return this.fallbackLoadAnimes();
      })
    );
  }

  fallbackLoadAnimes(): Observable<any> {
    return this.animeFilterService.getInitialAnimes(1).pipe(
      map(response => {
        if (!response || !response.data || response.data.length === 0) {
          throw new Error('Falha no carregamento de fallback');
        }

        this.animes = response.data;
        this.totalPages = response.pagination.last_visible_page; // Atualiza o total de páginas

        return response;
      }),
      catchError(() => {
        this.animes = [];
        this.totalPages = 1; // Define totalPages como 1 se não houver dados
        return of({ data: [], pagination: { last_visible_page: 1 } });
      })
    );
  }

  loadGenres() {
    this.animeFilterService.getAnimeGenres().pipe(
      retry(this.MAX_RETRIES),
      catchError(error => {
        console.error('Erro ao carregar gêneros', error);
        return of({ data: [] });
      })
    ).subscribe({
      next: (response) => {
        this.genres = response.data || [];
      }
    });
  }

  loadYears() {
    this.years = this.animeFilterService.getAnimeYears();
  }

  searchAnimes() {
    this.isLoading = true;
    this.isInitialLoad = false;

    this.animeFilterService.getFilteredAnimes(
      this.searchTerm,
      this.currentPage,
      this.selectedGenre,
      this.selectedYear
    ).pipe(
      retry(this.MAX_RETRIES),
      catchError(error => {
        console.error('Erro ao buscar animes', error);
        this.animes = [];
        this.totalPages = 1;
        this.isLoading = false;
        return of({ data: [], pagination: { last_visible_page: 1 } });
      })
    ).subscribe({
      next: (response) => {
        if (response && response.data && response.data.length > 0) {
          this.animes = response.data;
          this.totalPages = response.pagination.last_visible_page;
        } else {
          this.animes = [];
          this.totalPages = 1;
        }
        this.isLoading = false;
      }
    });
  }

  applyFilter() {
    this.currentPage = 1;
    this.searchAnimes();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadPage();
      this.scrollToTop();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadPage();
      this.scrollToTop();
    }
  }

  loadPage() {
    if (this.isInitialLoad) {
      this.loadInitialAnimes();
    } else {
      this.searchAnimes();
    }
  }

  extractYear(anime: any): string {

    if (anime.aired?.from) {
      return new Date(anime.aired.from).getFullYear().toString();
    }

    return 'N/A';
  }


  onSearchEnter() {
    this.currentPage = 1;
    this.searchAnimes();
  }

  loadInitialAnimes() {
    this.isLoading = true;
    this.isInitialLoad = true;

    this.safeLoadInitialAnimes().subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}