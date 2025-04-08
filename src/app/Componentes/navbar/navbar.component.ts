import { Component } from '@angular/core';
import { AnimeService } from '../../Services/anime.service';
import { finalize, catchError } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Router } from '@angular/router';

interface ImageUrls {
  image_url: string;
  small_image_url: string;
  large_image_url: string;
}

interface AnimeResult {
  mal_id: number;
  title: string;
  images: {
    jpg: ImageUrls;
    webp: ImageUrls;
  };
  type: string;
  year?: number;
  score?: number;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isMenuVisible = false;
  isSearchModalOpen = false;
  searchTerm = '';
  searchResults: AnimeResult[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private animeService: AnimeService,
    private router: Router
  ) {}

  toggleMenu(): void {
    this.isMenuVisible = !this.isMenuVisible;
  }

  openSearchModal(): void {
    this.isSearchModalOpen = true;
    setTimeout(() => {
      const searchInput = document.getElementById('search-input');
      if (searchInput) {
        searchInput.focus();
      }
    });
  }

  closeSearchModal(): void {
    this.isSearchModalOpen = false;
    this.resetSearch();
  }

  resetSearch(): void {
    this.searchTerm = '';
    this.searchResults = [];
    this.errorMessage = null;
    this.isLoading = false;
  }

  searchAnimes(): void {
    if (!this.searchTerm || this.searchTerm.trim().length < 2) {
      this.errorMessage = 'Por favor, digite pelo menos 2 caracteres';
      return;
    }

    this.searchResults = [];
    this.errorMessage = null;
    this.isLoading = true;

    this.animeService.getAnimesMovies(this.searchTerm.trim())
      .pipe(
        catchError(error => {
          console.error('Erro na pesquisa', error);
          this.errorMessage = 'Não foi possível realizar a busca. Tente novamente.';
          return of(null);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          if (response && response.data) {
            this.searchResults = response.data.slice(0, 10);

            if (this.searchResults.length === 0) {
              this.errorMessage = `Nenhum anime ou filme encontrado para "${this.searchTerm}"`;
            }
          }
        }
      });
  }

  navigateToAnimeDetails(animeId: number): void {
    this.closeSearchModal();
    this.router.navigate(['/anime-details', animeId]);
  }
}