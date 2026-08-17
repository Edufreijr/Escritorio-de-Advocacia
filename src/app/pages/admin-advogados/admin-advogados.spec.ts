import { TestBed } from '@angular/core/testing';

import { AdminAdvogados } from './admin-advogados';

describe('AdminAdvogados', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdminAdvogados],
    });
  });

  it('deve criar o componente', () => {
    const fixture = TestBed.createComponent(AdminAdvogados);

    expect(fixture.componentInstance).toBeTruthy();
  });
});
