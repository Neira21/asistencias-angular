import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { prueba2Guard } from './prueba2-guard';

describe('prueba2Guard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => prueba2Guard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
