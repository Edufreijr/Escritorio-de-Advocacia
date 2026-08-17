import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { PainelAdvogado } from './painel-advogado';

describe('PainelAdvogado', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PainelAdvogado],
      providers: [provideRouter([])],
    });
  });

  it('deve criar o componente', () => {
    const fixture = TestBed.createComponent(PainelAdvogado);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('deve retornar listas vazias quando não existe advogado autenticado', () => {
    const fixture = TestBed.createComponent(PainelAdvogado);
    const component = fixture.componentInstance;

    expect(component.assignedAppointments).toEqual([]);
    expect(component.unassignedAppointments).toEqual([]);
  });

  it('deve retornar os rótulos corretos dos status', () => {
    const fixture = TestBed.createComponent(PainelAdvogado);
    const component = fixture.componentInstance;

    expect(component.getStatusLabel('pending')).toBe('Pendente');
    expect(component.getStatusLabel('confirmed')).toBe('Confirmado');
    expect(component.getStatusLabel('cancelled')).toBe('Cancelado');
  });
});
