import { TestBed } from '@angular/core/testing';

import { AdminMensagens } from './admin-mensagens';

describe('AdminMensagens', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdminMensagens],
    });
  });

  it('deve criar o componente', () => {
    const fixture = TestBed.createComponent(AdminMensagens);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('deve iniciar com contadores válidos', () => {
    const fixture = TestBed.createComponent(AdminMensagens);
    const component = fixture.componentInstance;

    expect(component.totalContacts).toBeGreaterThanOrEqual(0);
    expect(component.newContacts).toBeGreaterThanOrEqual(0);
    expect(component.readContacts).toBeGreaterThanOrEqual(0);
    expect(component.answeredContacts).toBeGreaterThanOrEqual(0);
  });
});
