import { TestBed } from '@angular/core/testing';

import { AdminAgendamentos } from './admin-agendamentos';

describe('AdminAgendamentos', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdminAgendamentos],
    });
  });

  it('deve criar o componente', () => {
    const fixture = TestBed.createComponent(AdminAgendamentos);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('deve iniciar com contadores numéricos', () => {
    const fixture = TestBed.createComponent(AdminAgendamentos);
    const component = fixture.componentInstance;

    expect(component.totalAppointments).toBeGreaterThanOrEqual(0);
    expect(component.pendingAppointments).toBeGreaterThanOrEqual(0);
    expect(component.confirmedAppointments).toBeGreaterThanOrEqual(0);
    expect(component.cancelledAppointments).toBeGreaterThanOrEqual(0);
  });
});
