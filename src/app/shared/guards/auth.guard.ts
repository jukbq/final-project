import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ROLE } from './role.constant';
import { inject } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
):
  | Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree => {
  const router: Router = inject(Router);
  const login = JSON.parse(localStorage.getItem('currentUser') as string);
  if (login && (login.role === ROLE.ADMIN || login.role === ROLE.USER)) {
    console.log('login', login, login.role);
    return true;
  }
  router.navigate(['']);
  return false;
  console.log('login, login.role');
};
