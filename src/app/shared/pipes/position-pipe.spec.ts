import { PositionPipe } from './position-pipe';

describe('PositionPipe', () => {
  let pipe: PositionPipe;

  beforeEach(() => {
    pipe = new PositionPipe();
  });

  it('debe crear la instancia', () => {
    expect(pipe).toBeTruthy();
  });

  it('debe retornar el mismo valor si es falsy (null, undefined, "")', () => {
    expect(pipe.transform(null)).toBeNull();
    expect(pipe.transform(undefined)).toBeUndefined();
    expect(pipe.transform('')).toBe('');
  });

  it('debe traducir "development" a "Desarrollador"', () => {
    expect(pipe.transform('development')).toBe('Desarrollador');
  });

  it('debe traducir "disign" a "Diseñador"', () => {
    expect(pipe.transform('disign')).toBe('Diseñador');
  });

  it('debe traducir "architect" a "Arquitecto"', () => {
    expect(pipe.transform('architect')).toBe('Arquitecto');
  });

  it('debe retornar "No encontrado" para cualquier otro valor no mapeado', () => {
    expect(pipe.transform('manager')).toBe('No encontrado');
    expect(pipe.transform('unknown')).toBe('No encontrado');
  });
});
