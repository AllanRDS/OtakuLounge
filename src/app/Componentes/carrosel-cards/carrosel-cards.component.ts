import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { AnimeService } from '../../Services/anime.service';
import { Subject, of, throwError } from 'rxjs';
import {
  takeUntil,
  catchError,
  retryWhen,
  mergeMap,
  delay,
  tap,
  finalize
} from 'rxjs/operators';

@Component({
  selector: 'carrosel-cards',
  templateUrl: './carrosel-cards.component.html',
  styleUrls: ['./carrosel-cards.component.css']
})
export class CarroselCardsComponent implements OnInit, OnDestroy {
  @ViewChild('carousel') carousel!: ElementRef;

  seasonUpcomingList: any[] = [];
  isDragging = false;
  startX = 0;
  scrollLeft = 0;

  isLoading = false;
  loadError: string | null = null;

  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 2000;

  private destroy$ = new Subject<void>();

  constructor(private animeService: AnimeService) { }

  ngOnInit() {
    this.getUpcomingSeason();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getUpcomingSeason() {
    if (this.isLoading) return;

    this.isLoading = true;
    this.loadError = null;

    this.animeService.getSeasonUpcoming().pipe(
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
        if (response && response.data) {
          this.seasonUpcomingList = this.processUpcomingAnimes(response.data);
          this.preloadAnimeImages(this.seasonUpcomingList);
        } else {
          throw new Error('Resposta inválida');
        }
      }),

      catchError(error => {
        console.error('Erro ao carregar a lista de animes:', error);
        this.loadError = this.getErrorMessage(error);
        return throwError(() => error);
      }),

      finalize(() => {
        this.isLoading = false;
      }),

      takeUntil(this.destroy$)
    ).subscribe({
      error: (err) => {
        console.error('Erro final:', err);
        this.loadError = 'Erro crítico ao carregar animes';
      }
    });
  }

  private processUpcomingAnimes(animes: any[]): any[] {
    return animes
      .filter(anime =>
        anime.images?.jpg?.image_url &&
        anime.genres?.length > 0
      )
      .slice(0, 20)
      .map(anime => ({
        mal_id: anime.mal_id,
        title: anime.title,
        images: anime.images,
        genres: anime.genres,
        trailer: anime.trailer
      }));
  }

  private preloadAnimeImages(animes: any[]) {
    animes.forEach(anime => {
      if (anime.images?.jpg?.image_url) {
        const img = new Image();
        img.src = anime.images.jpg.image_url;

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

  retryLoadAnimes() {
    this.getUpcomingSeason();
  }

  startDrag(event: MouseEvent) {
    this.initDrag(this.getClientX(event));
  }

  startTouch(event: TouchEvent) {
    this.initDrag(this.getClientX(event));
    event.preventDefault();
  }

  private initDrag(clientX: number) {
    if (!this.carousel?.nativeElement) return;

    this.isDragging = true;
    this.startX = clientX - this.carousel.nativeElement.offsetLeft;
    this.scrollLeft = this.carousel.nativeElement.scrollLeft;
    this.carousel.nativeElement.style.cursor = 'grabbing';
  }

  drag(event: MouseEvent | TouchEvent) {
    if (!this.isDragging || !this.carousel?.nativeElement) return;

    event.preventDefault();
    const clientX = this.getClientX(event);
    const x = clientX - this.carousel.nativeElement.offsetLeft;
    const walk = (x - this.startX) * 2;

    let newScrollLeft = this.scrollLeft - walk;
    const maxScrollLeft = this.carousel.nativeElement.scrollWidth - this.carousel.nativeElement.clientWidth;

    newScrollLeft = Math.max(0, Math.min(newScrollLeft, maxScrollLeft));
    this.carousel.nativeElement.scrollLeft = newScrollLeft;
  }

  endDrag() {
    if (!this.carousel?.nativeElement) return;

    this.isDragging = false;
    this.carousel.nativeElement.style.cursor = 'grab';
  }

  private getClientX(event: MouseEvent | TouchEvent): number {
    return event instanceof MouseEvent
      ? event.clientX
      : event.touches[0].clientX;
  }

  preventDrag(event: DragEvent) {
    event.preventDefault();
  }
}