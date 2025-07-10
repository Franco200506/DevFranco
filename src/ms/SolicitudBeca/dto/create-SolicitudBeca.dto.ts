export class CreateSolicitudBecaDto {
  
  Id?: number;
  EstudianteId: number;
  TipoBecaId: number;
  EstadoId: number;
  FechaSolicitud: string;
  PeriodoAcademicoId: number;
  Observaciones: string;
  Fecha_resultado: string;
}
