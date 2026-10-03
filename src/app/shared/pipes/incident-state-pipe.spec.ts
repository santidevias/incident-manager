import { IncidentStatePipe } from './incident-state-pipe';

describe('IncidentStatePipe', () => {
  let pipe: IncidentStatePipe;

  beforeEach(() => {
    pipe = new IncidentStatePipe();
  });

  it('debe crear la instancia', () => {
    expect(pipe).toBeTruthy();
  });

  it('debe traducir "OPEN" a "Abierto"', () => {
    expect(pipe.transform('OPEN')).toBe('Abierto');
  });

  it('debe traducir "IN_PROGRESS" a "En proceso"', () => {
    expect(pipe.transform('IN_PROGRESS')).toBe('En proceso');
  });

  it('debe traducir "CLOSED" a "Resuelto"', () => {
    expect(pipe.transform('CLOSED')).toBe('Resuelto');
  });

  it('debe retornar el mismo código si el estado no está mapeado', () => {
    expect(pipe.transform('PENDING')).toBe('PENDING');
    expect(pipe.transform('CANCELED')).toBe('CANCELED');
  });

  it('debe manejar strings vacíos retornando el mismo string vacío', () => {
    expect(pipe.transform('')).toBe('');
  });
});
