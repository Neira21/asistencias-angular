import { CanMatchFn } from '@angular/router';

export const pruebaGuard: CanMatchFn = (route, segments) => {
  return true;
};
