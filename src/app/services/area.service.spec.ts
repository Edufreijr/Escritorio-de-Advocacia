import { TestBed } from '@angular/core/testing';

import { AreaService } from './area.service';

describe('AreaService', () => {
  let service: AreaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    service = TestBed.inject(AreaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all practice areas', () => {
    const areas = service.getAll();

    expect(areas).toBeTruthy();
    expect(Array.isArray(areas)).toBe(true);
  });

  it('should return a practice area by id', () => {
    const areas = service.getAll();

    expect(areas.length).toBeGreaterThan(0);

    const firstArea = areas[0];
    const result = service.getById(firstArea.id);

    expect(result).toEqual(firstArea);
  });

  it('should return undefined when the practice area id does not exist', () => {
    const result = service.getById(-1);

    expect(result).toBeUndefined();
  });

  it('should return a practice area by slug', () => {
    const areas = service.getAll();

    expect(areas.length).toBeGreaterThan(0);

    const firstArea = areas[0];
    const result = service.getBySlug(firstArea.slug);

    expect(result).toEqual(firstArea);
  });

  it('should return undefined when the practice area slug does not exist', () => {
    const result = service.getBySlug('area-que-nao-existe');

    expect(result).toBeUndefined();
  });
});
