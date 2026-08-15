import { TestBed } from '@angular/core/testing';

import { LawyerService } from './lawyer.service';

describe('LawyerService', () => {
  let service: LawyerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    service = TestBed.inject(LawyerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all lawyers', () => {
    const lawyers = service.getAll();

    expect(lawyers).toBeTruthy();
    expect(Array.isArray(lawyers)).toBe(true);
  });

  it('should return a lawyer by id', () => {
    const lawyers = service.getAll();

    expect(lawyers.length).toBeGreaterThan(0);

    const firstLawyer = lawyers[0];
    const result = service.getById(firstLawyer.id);

    expect(result).toEqual(firstLawyer);
  });

  it('should return undefined when the lawyer does not exist', () => {
    const result = service.getById(-1);

    expect(result).toBeUndefined();
  });
});
