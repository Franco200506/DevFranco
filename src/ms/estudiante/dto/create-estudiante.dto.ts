export class CreateEstudianteDto {
  Id?: number;
  Nombre: string;
  Apellido: string;
  Edad: number;
  Correo: string;

  EstadoId?: number;   // Nuevo campo opcional
  CarreraId?: number;  // Nuevo campo opcional
  
}
