import { TestBed } from '@angular/core/testing';

import { ItemNameService } from './item-name.service';

describe('ItemNameService', () => {
  let service: ItemNameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemNameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
