import { IncidentPriorityPipe } from './incident-priority-pipe';

describe('IncidentPriorityPipe', () => {
  let pipe: IncidentPriorityPipe;

  beforeEach(() => {
    pipe = new IncidentPriorityPipe();
  });

  it('debe crear la instancia', () => {
    expect(pipe).toBeTruthy();
  });

  it('debe traducir "CRITICAL" a "Critica"', () => {
    expect(pipe.transform('CRITICAL')).toBe('Critica');
  });

  it('debe traducir "HIGH" a "Alta"', () => {
    expect(pipe.transform('HIGH')).toBe('Alta');
  });

  it('debe traducir "MEDIUM" a "Media"', () => {
    expect(pipe.transform('MEDIUM')).toBe('Media');
  });

  it('debe traducir "LOW" a "Baja"', () => {
    expect(pipe.transform('LOW')).toBe('Baja');
  });

  it('debe retornar el mismo código si la prioridad no está mapeada', () => {
    expect(pipe.transform('URGENT')).toBe('URGENT');
    expect(pipe.transform('NONE')).toBe('NONE');
  });

  it('debe manejar strings vacíos retornando el mismo string vacío', () => {
    expect(pipe.transform('')).toBe('');
  });
});
