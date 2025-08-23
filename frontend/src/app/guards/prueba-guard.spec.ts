import { TestBed } from '@angular/core/testing';
import { CanMatchFn } from '@angular/router';

import { pruebaGuard } from './prueba-guard';

describe('pruebaGuard', () => {
  const executeGuard: CanMatchFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => pruebaGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
