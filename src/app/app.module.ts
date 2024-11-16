import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient } from '@angular/common/http';
import { BuscadorComponent } from './Componentes/buscador/buscador.component';
import { HomeComponent } from './Paginas/home/home.component';
import { CarroselComponent } from './Componentes/carrosel/carrosel.component';
import { AnimeComponent } from './Paginas/anime/anime.component';
import { FilmeComponent } from './Paginas/filme/filme.component';
import { NavbarComponent } from './Componentes/navbar/navbar.component';
import { FooterComponent } from './Componentes/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    BuscadorComponent,
    HomeComponent,
    CarroselComponent,
    AnimeComponent,
    FilmeComponent,
    NavbarComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
