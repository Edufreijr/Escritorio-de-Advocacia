import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Cadastro } from './cadastro';

describe('Cadastro', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Cadastro],
      providers: [provideRouter([])],
    });
  });

  it('deve criar o componente', () => {
    const fixture = TestBed.createComponent(Cadastro);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('deve iniciar o formulário como inválido', () => {
    const fixture = TestBed.createComponent(Cadastro);
    const component = fixture.componentInstance;

    expect(component.cadastroForm.invalid).toBe(true);
  });

  it('deve identificar campo inválido', () => {
    const fixture = TestBed.createComponent(Cadastro);
    const component = fixture.componentInstance;

    component.submitted = true;

    expect(component.isInvalid('name')).toBe(true);
  });
});
