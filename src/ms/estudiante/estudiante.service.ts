import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { SqlService } from '../../ms/cnxjs/sql.service';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';

@Injectable()
export class EstudianteService {
  constructor(private readonly sqlService: SqlService) {}

  // 🔁 Función reutilizable para obtener un nombre desde un SP por ID
  private async getNombreById(spName: string, id: number): Promise<string | null> {
    const pool = await this.sqlService.getConnection();
    const result = await pool.request().input('Id', id).execute(spName);
    return result.recordset?.[0]?.Nombre ?? null;
  }

  async create(obj: CreateEstudianteDto) {
    try {
      const pool = await this.sqlService.getConnection();
      const request = pool.request();

      const id = obj.Id ?? 0;
      const EstadoId = Number(obj.EstadoId);
      const CarreraId = Number(obj.CarreraId);
      // Asumiendo que UsuarioId es parte del DTO de creación
      const UsuarioId = Number(obj.UsuarioId); 


      request.input('Id', id);
      request.input('Nombre', obj.Nombre);
      request.input('Apellido', obj.Apellido);
      request.input('Edad', obj.Edad);
      request.input('Correo', obj.Correo);
      request.input('EstadoId', EstadoId);
      request.input('CarreraId', CarreraId);
      request.input('UsuarioId', UsuarioId);

      const result: any = await request.execute('Beca.sp_Save_Estudiante');

      const estudianteId =
        result.recordset?.[0]?.NewId ||
        result.recordset?.[0]?.UpdatedId ||
        id;

      const [estadoNombre, carreraNombre, usuarioNombre] = await Promise.all([
          this.getNombreById('Beca.sp_Get_Estado', EstadoId),
          this.getNombreById('Beca.sp_Get_Carrera', CarreraId),
          this.getNombreById('Beca.sp_Get_Usuario', UsuarioId),
      ]);

      return {
        id: estudianteId,
        Nombre: obj.Nombre,
        Apellido: obj.Apellido,
        Edad: obj.Edad,
        Correo: obj.Correo,
        EstadoId,
        estadoNombre,
        CarreraId,
        carreraNombre,
        UsuarioId,
        usuarioNombre,
      };
    } catch (e: any) {
      console.error('❌ Error:', e);
      return {
        error: 'Error interno',
        detalle: e?.message || e?.originalError?.info?.message || JSON.stringify(e),
      };
    }
  }

  async findAll() {
    try {
      const pool = await this.sqlService.getConnection();

      const estudiantesResult = await pool.request().input('Id', 0).execute('Beca.sp_Get_Estudiante');
      const estudiantes = estudiantesResult.recordset;

      const [carrerasResult, estadosResult, usuariosResult] = await Promise.all([
        pool.request().input('Id', 0).execute('Beca.sp_Get_Carrera'),
        pool.request().input('Id', 0).execute('Beca.sp_Get_Estado'),
        pool.request().input('Id', 0).execute('Beca.sp_Get_Usuario'),
      ]);

      const carreras = carrerasResult.recordset;
      const estados = estadosResult.recordset;
      const usuarios = usuariosResult.recordset;

      const estudiantesConNombres = estudiantes.map(est => {
        const carrera = carreras.find(c => c.Id === est.CarreraId);
        const estado = estados.find(e => e.Id === est.EstadoId);
        const usuario = usuarios.find(u => u.Id === est.UsuarioId);

        return {
          ...est,
          carreraNombre: carrera?.Nombre ?? null,
          estadoNombre: estado?.Nombre ?? null,
          usuarioNombre: usuario?.Nombre ?? null,
        };
      });

      return estudiantesConNombres;
    } catch (e) {
      console.error('Error al obtener estudiantes', JSON.stringify(e, null, 2));
      return { error: 'Error al obtener los estudiantes', detalle: e.message ?? e };
    }
  }

  async findOne(id: number) {
    try {
      const pool = await this.sqlService.getConnection();

      const estudianteResult = await pool.request().input('Id', id).execute('Beca.sp_Get_Estudiante');
      if (estudianteResult.recordset.length === 0) {
        return { mensaje: `Estudiante con ID ${id} no encontrado` };
      }

      const estudiante = estudianteResult.recordset[0];

      const [estadoNombre, carreraNombre, usuarioNombre] = await Promise.all([
          this.getNombreById('Beca.sp_Get_Estado', estudiante.EstadoId),
          this.getNombreById('Beca.sp_Get_Carrera', estudiante.CarreraId),
          this.getNombreById('Beca.sp_Get_Usuario', estudiante.UsuarioId),
      ]);

      return {
        ...estudiante,
        estadoNombre,
        carreraNombre,
        usuarioNombre,
      };
    } catch (e) {
      console.error('Error al buscar estudiante por ID:', JSON.stringify(e, null, 2));
      return { error: 'Error al buscar el estudiante', detalle: e.message ?? e };
    }
  }

  async remove(id: number) {
    try {
      const pool = await this.sqlService.getConnection();

      const estudianteResult = await pool.request().input('Id', id).execute('Beca.sp_Get_Estudiante');
      if (estudianteResult.recordset.length === 0) {
        return { mensaje: `Estudiante con ID ${id} no encontrado` };
      }

      const estudiante = estudianteResult.recordset[0];

      const [estadoNombre, carreraNombre, usuarioNombre] = await Promise.all([
          this.getNombreById('Beca.sp_Get_Estado', estudiante.EstadoId),
          this.getNombreById('Beca.sp_Get_Carrera', estudiante.CarreraId),
          this.getNombreById('Beca.sp_Get_Usuario', estudiante.UsuarioId),
      ]);

      await pool.request().input('Id', id).execute('Beca.sp_Delete_Estudiante');

      return {
        mensaje: `Estudiante con ID ${id} eliminado correctamente`,
        estudiante: {
          ...estudiante,
          estadoNombre,
          carreraNombre,
          usuarioNombre,
        },
      };
    } catch (e) {
      console.error('Error al eliminar estudiante:', JSON.stringify(e, null, 2));
      return { error: 'Error al eliminar el estudiante', detalle: e.message ?? e };
    }
  }
}
