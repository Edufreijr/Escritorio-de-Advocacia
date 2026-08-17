import { TestBed } from '@angular/core/testing';

import { AdminUsuarios } from './admin-usuarios';

describe('AdminUsuarios', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdminUsuarios],
    });
  });

  it('deve criar o componente', () => {
    const fixture = TestBed.createComponent(AdminUsuarios);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('deve retornar os rótulos corretos dos usuários', () => {
    const fixture = TestBed.createComponent(AdminUsuarios);
    const component = fixture.componentInstance;

    expect(component.getRoleLabel('admin')).toBe('Administrador');
    expect(component.getRoleLabel('lawyer')).toBe('Advogado');
    expect(component.getRoleLabel('user')).toBe('Cliente');
  });
});
