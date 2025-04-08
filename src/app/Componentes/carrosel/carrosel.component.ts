import { Component, OnInit, OnDestroy } from '@angular/core';
import { AnimeService } from '../../Services/anime.service';
import {
  Subject,
  Observable,
  of,
  throwError
} from 'rxjs';
import {
  takeUntil,
  catchError,
  finalize,
  tap,
  switchMap,
  delay,
  retryWhen,
  mergeMap
} from 'rxjs/operators';

interface Anime {
  mal_id: number;
  title: string;
  trailer: {
    images: {
      maximum_image_url: string;
    }
  };
  genres: any[];
  images?: {
    jpg?: {
      large_image_url?: string;
    }
  };
}

@Component({
  selector: 'app-carrosel',
  templateUrl: './carrosel.component.html',
  styleUrls: ['./carrosel.component.css']
})
export class CarroselComponent implements OnInit, OnDestroy {
  currentSlide = 0;
  limitedAnimeList: Anime[] = [];
  slideInterval: any;

  isLoading = false;
  loadError: string | null = null;

  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 2000;

  private destroy$ = new Subject<void>();
  private loadingQueue$ = new Subject<void>();

  constructor(
    private animeService: AnimeService
  ) { }

  ngOnInit() {
    this.loadingQueue$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => this.safeLoadAnimes())
      )
      .subscribe({
        error: (err) => {
          console.error('Erro na fila de carregamento:', err);
          this.loadError = this.getErrorMessage(err);
        }
      });
    setTimeout(() => this.requestAnimeLoad(), 500);
  }

  ngOnDestroy() {
    this.stopSlideShow();
    this.destroy$.next();
    this.destroy$.complete();
  }

  private safeLoadAnimes(): Observable<any> {
    if (this.isLoading) {
      return of(null);
    }

    this.isLoading = true;
    this.loadError = null;

    return this.animeService.getCurrentAnimeSeason().pipe(
      retryWhen(errors =>
        errors.pipe(
          mergeMap((error, index) => {
            if (index < this.MAX_RETRIES) {
              console.warn(`Tentativa ${index + 1} de carregar animes falhou. Tentando novamente...`);

              this.loadError = `Falha ao carregar. Tentativa ${index + 1} de ${this.MAX_RETRIES}`;

              return of(error).pipe(delay(this.RETRY_DELAY * (index + 1)));
            }

            throw error;
          })
        )
      ),

      delay(300),

      tap(response => {
        if (response?.data?.length) {
          const validAnimes = this.processAnimes(response.data);

          this.limitedAnimeList = validAnimes;

          this.currentSlide = 0;

          this.startSlideShow();

          this.preloadAnimeImages(validAnimes);
        } else {
          throw new Error('Sem dados válidos');
        }
      }),

      catchError(error => {
        console.error('Erro no carrossel:', error);
        this.loadError = this.getErrorMessage(error);
        return throwError(() => error);
      }),

      finalize(() => {
        this.isLoading = false;
      })
    );
  }

  private processAnimes(animes: any[]): Anime[] {
    return animes
      .filter(anime =>
        (anime.trailer?.images?.maximum_image_url || anime.images?.jpg?.large_image_url) &&
        anime.genres?.length > 0
      )
      .slice(0, 5)
      .map(anime => ({
        mal_id: anime.mal_id,
        title: anime.title,
        trailer: anime.trailer,
        genres: anime.genres,
        images: anime.images
      }));
  }

  private preloadAnimeImages(animes: Anime[]) {
    animes.forEach(anime => {
      const imageUrl = anime.trailer?.images?.maximum_image_url || anime.images?.jpg?.large_image_url;

      if (imageUrl) {
        const img = new Image();
        img.src = imageUrl;

        img.onload = () => {
          console.log(`Imagem do anime ${anime.title} carregada`);
        };

        img.onerror = () => {
          console.warn(`Falha ao carregar imagem do anime ${anime.title}`);
        };
      }
    });
  }

  private getErrorMessage(error: any): string {
    if (error.status === 404) return 'Animes não encontrados';
    if (error.status === 500) return 'Erro interno do servidor';
    return 'Falha ao carregar animes. Verifique sua conexão.';
  }

  requestAnimeLoad() {
    this.loadingQueue$.next();
  }

  startSlideShow() {
    this.stopSlideShow();
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 10000);
  }

  stopSlideShow() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  nextSlide() {
    if (this.limitedAnimeList.length > 0) {
      this.currentSlide = (this.currentSlide + 1) % this.limitedAnimeList.length;
    }
  }

  prevSlide() {
    if (this.limitedAnimeList.length > 0) {
      this.currentSlide = (this.currentSlide - 1 + this.limitedAnimeList.length) % this.limitedAnimeList.length;
    }
  }

  reloadAnimes() {
    this.requestAnimeLoad();
  }
}