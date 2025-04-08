// src/app/core/interceptors/robust-http.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import {
  catchError,
  retryWhen,
  mergeMap,
  timeout
} from 'rxjs/operators';

@Injectable()
export class RobustHttpInterceptor implements HttpInterceptor {
  // Configurações de retry e timeout
  private readonly MAX_RETRIES = 3;
  private readonly BASE_RETRY_DELAY = 1000;
  private readonly REQUEST_TIMEOUT = 10000; // 10 segundos

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Clona e modifica a requisição
    const modifiedRequest = this.enhanceRequest(request);

    return next.handle(modifiedRequest).pipe(
      // Adiciona timeout à requisição
      timeout(this.REQUEST_TIMEOUT),

      // Estratégia de retry inteligente
      retryWhen(errors =>
        errors.pipe(
          mergeMap((error: HttpErrorResponse, index) => {
            const retryAttempt = index + 1;

            // Verifica se é um erro retentável
            if (this.isRetryableError(error) && retryAttempt <= this.MAX_RETRIES) {
              console.warn(`Tentativa de retry ${retryAttempt}`, {
                url: request.url,
                status: error.status
              });
              return this.calculateRetryDelay(retryAttempt);
            }

            return throwError(() => error);
          })
        )
      ),

      // Tratamento de erros centralizado
      catchError(error => this.handleError(error, request))
    );
  }

  // Melhora a requisição com headers e identificadores
  private enhanceRequest(request: HttpRequest<any>): HttpRequest<any> {
    // Adiciona headers de segurança e rastreabilidade
    return request.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Request-ID': this.generateRequestId(),
        'X-Timestamp': Date.now().toString(),
        // Headers opcionais de segurança
        'X-Requested-With': 'XMLHttpRequest'
      }
    });
  }

  // Tratamento de erro personalizado
  private handleError = (
    error: HttpErrorResponse,
    request: HttpRequest<any>
  ): Observable<never> => {
    let errorMessage = this.generateErrorMessage(error);

    // Log detalhado de erro
    console.error('Erro HTTP Detalhado:', {
      url: request.url,
      method: request.method,
      status: error.status,
      message: errorMessage
    });

    // Tratamento específico para diferentes tipos de erro
    switch (error.status) {
      case 429: // Too Many Requests
        this.handleRateLimitError(error);
        break;
      case 401: // Unauthorized
        this.handleUnauthorizedError(error);
        break;
      case 403: // Forbidden
        this.handleForbiddenError(error);
        break;
    }

    return throwError(() => new Error(errorMessage));
  }

  // Geração de ID único para rastreabilidade
  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Verifica se o erro é retentável
  private isRetryableError(error: HttpErrorResponse): boolean {
    const retryableCodes = [
      429,   // Too Many Requests
      500,   // Internal Server Error
      502,   // Bad Gateway
      503,   // Service Unavailable
      504    // Gateway Timeout
    ];

    return (
      retryableCodes.includes(error.status) ||
      !navigator.onLine
    );
  }

  // Calcula delay de retry com backoff exponencial
  private calculateRetryDelay(attempt: number): Observable<number> {
    const delay = this.BASE_RETRY_DELAY * Math.pow(2, attempt);
    const jitter = Math.random() * 1000;

    return new Observable(observer => {
      setTimeout(() => observer.next(delay + jitter), delay + jitter);
    });
  }

  // Gera mensagem de erro amigável
  private generateErrorMessage(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente
      return `Erro de cliente: ${error.error.message}`;
    }

    // Mensagens de erro para códigos específicos
    switch (error.status) {
      case 400: return 'Requisição inválida';
      case 401: return 'Sessão expirada. Faça login novamente.';
      case 403: return 'Você não tem permissão para acessar este recurso';
      case 404: return 'Recurso não encontrado';
      case 429: return 'Limite de requisições excedido. Tente novamente mais tarde.';
      case 500: return 'Erro interno do servidor';
      default: return `Erro desconhecido: ${error.status}`;
    }
  }

  // Tratamento específico para rate limit
  private handleRateLimitError(error: HttpErrorResponse) {
    // Pode implementar lógica de backoff ou notificação
    console.warn('Rate limit atingido', {
      retryAfter: error.headers.get('Retry-After')
    });
  }

  // Tratamento para erro de autorização
  private handleUnauthorizedError(error: HttpErrorResponse) {
    // Pode acionar logout ou refresh de token
    console.warn('Sessão expirada');
    // this.authService.logout();
  }

  // Tratamento para erro de acesso proibido
  private handleForbiddenError(error: HttpErrorResponse) {
    // Pode redirecionar ou mostrar mensagem de erro
    console.warn('Acesso negado');
  }
}

// Provider para injeção no módulo
export const httpInterceptorProviders = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: RobustHttpInterceptor,
    multi: true
  }
];