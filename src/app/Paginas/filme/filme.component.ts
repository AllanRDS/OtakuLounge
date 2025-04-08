import { Component, OnInit } from '@angular/core';
import { MoviefilterService } from '../../Services/moviefilter.service';
import { of, Observable, throwError } from 'rxjs';
import { catchError, retry, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-filme',
  templateUrl: './filme.component.html',
  styleUrls: ['./filme.component.css']
})
export class FilmeComponent implements OnInit {
  filmes: any[] = [];
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

  constructor(private moviefilterService: MoviefilterService) {}

  ngOnInit() {
    this.loadInitialData();
  }

  loadInitialData() {
    this.isLoading = true;

    this.moviefilterService.loadGenreMapping().pipe(
      retry(this.MAX_RETRIES),
      switchMap(() => this.safeLoadInitialFilmes()),
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

  safeLoadInitialFilmes(): Observable<any> {
    return this.moviefilterService.getInitialFilmes(this.currentPage).pipe(
      retry(this.MAX_RETRIES),
      map(response => {
        if (!response || !response.data || response.data.length === 0) {
          throw new Error('Nenhum filme encontrado');
        }

        this.filmes = response.data;
        this.totalPages = response.pagination.last_visible_page;

        return response;
      }),
      catchError(error => {
        console.error('Erro ao carregar filmes iniciais', error);
        return this.fallbackLoadFilmes();
      })
    );
  }

  fallbackLoadFilmes(): Observable<any> {
    return this.moviefilterService.getInitialFilmes(1).pipe(
      map(response => {
        if (!response || !response.data || response.data.length === 0) {
          throw new Error('Falha no carregamento de fallback');
        }

        this.filmes = response.data;
        this.totalPages = response.pagination.last_visible_page;

        return response;
      }),
      catchError(() => {
        this.filmes = [];
        this.totalPages = 1;
        return of({ data: [], pagination: { last_visible_page: 1 } });
      })
    );
  }

  loadGenres() {
    this.moviefilterService.getAnimeGenres().pipe(
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
    this.years = this.moviefilterService.getFilmesYears();
  }

  searchFilmes() {
    this.isLoading = true;
    this.isInitialLoad = false;

    this.moviefilterService.getFilteredFilmes(
      this.searchTerm,
      this.currentPage,
      this.selectedGenre,
      this.selectedYear
    ).pipe(
      retry(this.MAX_RETRIES),
      catchError(error => {
        console.error('Erro ao buscar filmes', error);
        this.filmes = [];
        this.totalPages = 1;
        this.isLoading = false;
        return of({ data: [], pagination: { last_visible_page: 1 } });
      })
    ).subscribe({
      next: (response) => {
        if (response && response.data && response.data.length > 0) {
          this.filmes = response.data;
          this.totalPages = response.pagination.last_visible_page;
        } else {
          this.filmes = [];
          this.totalPages = 1;
        }
        this.isLoading = false;
      }
    });
  }

  applyFilter() {
    this.currentPage = 1;
    this.searchFilmes();
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
      this.loadInitialFilmes();
    } else {
      this.searchFilmes();
    }
  }

  extractYear(filme: any): string {
    if (filme.aired?.from) {
      return new Date(filme.aired.from).getFullYear().toString();
    }
    return 'N/A';
  }

  onSearchEnter() {
    this.currentPage = 1;
    this.searchFilmes();
  }

  loadInitialFilmes() {
    this.isLoading = true;
    this.isInitialLoad = true;

    this.safeLoadInitialFilmes().subscribe({
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