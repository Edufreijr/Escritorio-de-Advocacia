import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { MinhaConta } from './minha-conta';

describe('MinhaConta', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MinhaConta],
      providers: [provideRouter([])],
    });
  });

  it('deve criar o componente', () => {
    const fixture = TestBed.createComponent(MinhaConta);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('deve retornar uma lista vazia quando não existe usuário autenticado', () => {
    const fixture = TestBed.createComponent(MinhaConta);
    const component = fixture.componentInstance;

    expect(component.myAppointments).toEqual([]);
  });

  it('deve retornar os rótulos corretos dos status', () => {
    const fixture = TestBed.createComponent(MinhaConta);
    const component = fixture.componentInstance;

    expect(component.getStatusLabel('pending')).toBe('Pendente');
    expect(component.getStatusLabel('confirmed')).toBe('Confirmado');
    expect(component.getStatusLabel('cancelled')).toBe('Cancelado');
  });
});
