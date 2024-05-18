import {HttpErrorResponse, HttpInterceptorFn, HttpResponse} from '@angular/common/http';
import {inject} from "@angular/core";
import {DA_SERVICE_TOKEN, ITokenService} from "@delon/auth";
import {catchError, map, throwError} from "rxjs";
import {UserService} from "../services/user.service";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const iTokenService: ITokenService = inject(DA_SERVICE_TOKEN);
  const userService: UserService = inject(UserService);
  const token = iTokenService.get()?.token;
  if (token) {
    req = req.clone({
      setHeaders: {
        token
      }
    });
  }
  return next(req)
    .pipe(catchError((error: HttpErrorResponse) => {
      userService.setShowLoginModal(true);
      return throwError(() =>'Custom error message');
    }))
    .pipe(map((resp: any) => {
      if (resp instanceof HttpResponse) {
      }
      return resp;
    }));
};
