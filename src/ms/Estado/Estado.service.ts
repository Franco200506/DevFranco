import { Injectable } from '@nestjs/common';
import { SqlService } from '../../ms/cnxjs/sql.service';
import { CreateEstadoDto } from './dto/create-Estado.dto';

@Injectable()
export class EstadoService {
  constructor(private readonly sqlService: SqlService) {}

  async create(obj: CreateEstadoDto) {
    try {
      const pool = await this.sqlService.getConnection();
      const request = pool.request();

      const id = obj.Id ?? 0;

      request.input('Id', id);
      request.input('Nombre', obj.Nombre);
      request.input('FechaRegistro', obj.FechaRegistro);

      const result: any = await request.execute('Beca.sp_Save_Estado');

      console.log('Resultado del SP:', result);

      if (result.recordset && result.recordset.length > 0) {
        const resp = result.recordset[0].NewId || result.recordset[0].UpdatedId || result.recordset[0].Id;
        return { id: resp };
      } else {
        return { id };
      }
    } catch (e) {
      console.error('❌ Error al ejecutar el SP:', JSON.stringify(e, null, 2));
      return {
        error: 'Error interno',
        detalle: e instanceof Error ? e.message : JSON.stringify(e, null, 2),
      };
    }
  }

  async findAll() {
    try {
      const pool = await this.sqlService.getConnection();
      const request = pool.request();

      request.input('Id', 0);
      const result: any = await request.execute('Beca.sp_Get_Estado');

      return result.recordset;
    } catch (e) {
      console.error('Error al obtener el Estado', JSON.stringify(e, null, 2));
      return { error: 'Error al obtener el Estado', detalle: e.message ?? e };
    }
  }

  async findOne(id: number) {
    try {
      const pool = await this.sqlService.getConnection();
      const request = pool.request();

      request.input('Id', id);
      const result: any = await request.execute('Beca.sp_Get_Estado');

      if (result.recordset.length === 0) {
        return { mensaje: `Estado con ID ${id} no encontrado` };
      }

      return result.recordset[0];
    } catch (e) {
      console.error('Error al buscar el Estado por ID:', JSON.stringify(e, null, 2));
      return { error: 'Error al buscar el Estado', detalle: e.message ?? e };
    }
  }

  async remove(id: number) {
    try {
      const pool = await this.sqlService.getConnection();

      // Verificar si hay estudiantes usando este EstadoId
      const refCheck = await pool
        .request()
        .input('EstadoId', id)
        .query('SELECT COUNT(*) as Total FROM Beca.Estudiante WHERE EstadoId = @EstadoId');

      const total = refCheck.recordset[0]?.Total ?? 0;

      if (total > 0) {
        return {
          error: `No se puede eliminar el Estado con ID ${id} porque está siendo usado por ${total} estudiante(s).`,
        };
      }

      // Si no hay referencia, proceder a eliminar
      await pool.request().input('Id', id).execute('Beca.sp_Delete_Estado');

      return { mensaje: `Estado con ID ${id} eliminado correctamente` };
    } catch (e) {
      console.error('Error al eliminar el Estado:', JSON.stringify(e, null, 2));
      return { error: 'Error al eliminar el Estado', detalle: e.message ?? e };
    }
  }
}
