import { CanActivateFn } from '@angular/router';
import { ROLE } from './role.constant';

export const authGuard: CanActivateFn = (route, state) => {

   const login = JSON.parse(localStorage.getItem('currentUser') as string);
    if (login && (login.role === ROLE.ADMIN || login.role === ROLE.USER)) {
      return true; 
    }
  return false;
};
