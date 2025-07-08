import { Injectable } from '@nestjs/common';
import { SqlService } from '../../ms/cnxjs/sql.service';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';

@Injectable()
export class EstudianteService {
  constructor(private readonly sqlService: SqlService) {}

  async create(obj: CreateEstudianteDto) {
    try {
      const pool = await this.sqlService.getConnection();
      const request = pool.request();

      const id = obj.Id ?? 0;

      request.input('Id', id);
      request.input('Nombre', obj.nombre);
      request.input('Apellido', obj.apellido);
      request.input('Edad', obj.edad);
      request.input('Correo', obj.correo);

      // Nuevos parámetros obligatorios del SP
      request.input('EstadoId', 1); // Puedes cambiarlo por obj.estadoId si lo agregás al DTO
      request.input('CarreraId', 1); // Igual acá
      request.input('Estado', 1); // O el usuario actual si lo tenés

      const result: any = await request.execute('Beca.sp_Save_Estudiante');

      console.log('Resultado del SP:', result);

      if (result.recordset && result.recordset.length > 0) {
        const resp = result.recordset[0].NewId || result.recordset[0].UpdatedId || result.recordset[0].Id;
        return { id: resp };
      } else {
        return { id };
      }
    } catch (e) {
      console.error('Error al ejecutar el SP:', JSON.stringify(e, null, 2));
      return { error: 'Error interno', detalle: e.message ?? e };
    }
  }

  async findAll() {
    try {
      const pool = await this.sqlService.getConnection();
      const request = pool.request();

      request.input('Id', 0);
      const result: any = await request.execute('Beca.sp_Get_Estudiante');

      return result.recordset;
    } catch (e) {
      console.error('Error al obtener estudiantes', JSON.stringify(e, null, 2));
      return { error: 'Error al obtener los estudiantes', detalle: e.message ?? e };
    }
  }

  async findOne(id: number) {
    try {
      const pool = await this.sqlService.getConnection();
      const request = pool.request();

      request.input('Id', id);
      const result: any = await request.execute('Beca.sp_Get_Estudiante');

      if (result.recordset.length === 0) {
        return { mensaje: `Estudiante con ID ${id} no encontrado` };
      }

      return result.recordset[0];
    } catch (e) {
      console.error('Error al buscar estudiante por ID:', JSON.stringify(e, null, 2));
      return { error: 'Error al buscar el estudiante', detalle: e.message ?? e };
    }
  }

  async remove(id: number) {
    try {
      const pool = await this.sqlService.getConnection();
      const request = pool.request();

      request.input('Id', id);
      await request.execute('Beca.sp_Delete_Estudiante');

      return { mensaje: `Estudiante con ID ${id} eliminado correctamente` };
    } catch (e) {
      console.error('Error al eliminar estudiante:', JSON.stringify(e, null, 2));
      return { error: 'Error al eliminar el estudiante', detalle: e.message ?? e };
    }
  }
}
