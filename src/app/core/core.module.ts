// src/app/core/core.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { httpInterceptorProviders } from '../core/interceptors/robust-http.interceptor';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    httpInterceptorProviders
  ]
})
export class CoreModule { }