export class CreateDetallePagoDto {
  
  Id?: number;
  SolicitudBecaId : number;
  TipoPagoId : number;
  Nombre: string;
  Descripcion: string;
  Monto: number;
  FechaPago:  string;
  Referencia: string;
  EstadoId: number;
  
}
