import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToasterService } from '../services/toaster.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toaster = inject(ToasterService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 402) {
        // Trigger the "Locked" state
        toaster.show("Access Denied: Demo limit reached. Contact admin for payment.", "error");
        
        // Broadcast a custom event or call a logout method
        window.dispatchEvent(new CustomEvent('force-logout-payment'));
      }
      return throwError(() => error);
    })
  );
};