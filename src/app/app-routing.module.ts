import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Paginas/home/home.component';
import { AnimeComponent } from './Paginas/anime/anime.component';
import { FilmeComponent } from './Paginas/filme/filme.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'anime', component: AnimeComponent},
  {path: 'filme', component: FilmeComponent},
  { path: '**', redirectTo: '' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
