import { HttpInterceptorFn } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const httpErrorInterceptorFn: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Aquí capturamos cualquier error HTTP
      console.error('[HTTP ERROR]', error);
      // Mostramos un mensaje de error (esto se puede cambiar más adelante por un modal, un toast, etc)
      alert('Ha ocurrido un error en la petición HTTP');
      return throwError(() => error);
    })
  );
}