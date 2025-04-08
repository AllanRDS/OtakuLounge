import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient } from '@angular/common/http';
import { HomeComponent } from './Paginas/home/home.component';
import { CarroselComponent } from './Componentes/carrosel/carrosel.component';
import { AnimeComponent } from './Paginas/anime/anime.component';
import { FilmeComponent } from './Paginas/filme/filme.component';
import { NavbarComponent } from './Componentes/navbar/navbar.component';
import { FooterComponent } from './Componentes/footer/footer.component';
import { CarroselCardsComponent } from './Componentes/carrosel-cards/carrosel-cards.component';
import { TruncatePipe } from './Pipes/truncate.pipe';
import { CardListSelectorComponent } from './Componentes/card-list-selector/card-list-selector.component';
import { FormsModule } from '@angular/forms';
import { TransicaoComponent } from './Componentes/transicao/transicao.component';
import { CarroselCardsPComponent } from './Componentes/carrosel-cards-p/carrosel-cards-p.component';
import { RouterModule } from '@angular/router';
import { CoreModule } from './core/core.module';
import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { HoverZoomDirective } from './Diretivas/hover-zoom.directive';
import { HoverZoomListDirective } from './Diretivas/hover-zoom-list.directive';

registerLocaleData(localePt);




@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CarroselComponent,
    AnimeComponent,
    FilmeComponent,
    NavbarComponent,
    FooterComponent,
    CarroselCardsComponent,
    TruncatePipe,
    CardListSelectorComponent,
    TransicaoComponent,
    CarroselCardsPComponent,
    HoverZoomDirective,
    HoverZoomListDirective,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RouterModule,
    CoreModule
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient()
  ],
  bootstrap: [AppComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
