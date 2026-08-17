import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AdminDashboard } from './admin-dashboard';

describe('AdminDashboard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdminDashboard],
      providers: [provideRouter([])],
    });
  });

  it('deve criar o componente', () => {
    const fixture = TestBed.createComponent(AdminDashboard);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('deve retornar os rótulos corretos dos status', () => {
    const fixture = TestBed.createComponent(AdminDashboard);
    const component = fixture.componentInstance;

    expect(component.getStatusLabel('pending')).toBe('Pendente');
    expect(component.getStatusLabel('confirmed')).toBe('Confirmado');
    expect(component.getStatusLabel('cancelled')).toBe('Cancelado');
  });
});
