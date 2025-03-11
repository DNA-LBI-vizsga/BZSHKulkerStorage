import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { firstLoginGuard } from './first-login.guard';

describe('firstLoginGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => firstLoginGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
