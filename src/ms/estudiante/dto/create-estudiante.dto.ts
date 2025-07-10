export class CreateEstudianteDto {
  Id?: number;
  nombre: string;
  apellido: string;
  edad: number;
  correo: string;

  EstadoId?: number;   // Nuevo campo opcional
  carreraId?: number;  // Nuevo campo opcional
  
}
