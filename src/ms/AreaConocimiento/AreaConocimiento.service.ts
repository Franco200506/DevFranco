import { Injectable } from '@nestjs/common';
import { SqlService } from '../../ms/cnxjs/sql.service';
import { CreateAreaConocimientoDto } from './dto/create-AreaConocimiento.dto';

@Injectable()
export class AreaConocimientoService {
  constructor(private readonly sqlService: SqlService) {}

  async create(obj: CreateAreaConocimientoDto) {
    try {
      const pool = await this.sqlService.getConnection();
      const request = pool.request();

      const id = obj.Id ?? 0;

      request.input('Id', id);
      request.input('nombre', obj.nombre);
     
      const result: any = await request.execute('Beca.sp_Save_AreaConocimiento');

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
      const result: any = await request.execute('Beca.sp_Get_AreaConocimiento');

      return result.recordset;
    } catch (e) {
      console.error('Error al obtener el Area De Conocimiento', JSON.stringify(e, null, 2));
      return { error: 'Error al obtener el Area de Conocimiento', detalle: e.message ?? e };
    }
  }

  async findOne(id: number) {
    try {
      const pool = await this.sqlService.getConnection();
      const request = pool.request();

      request.input('Id', id);
      const result: any = await request.execute('Beca.sp_Get_AreaConocimiento');

      if (result.recordset.length === 0) {
        return { mensaje: `AreaConocimiento con ID ${id} no encontrado` };
      }

      return result.recordset[0];
    } catch (e) {
      console.error('Error al buscar el Area de Conocimiento por ID:', JSON.stringify(e, null, 2));
      return { error: 'Error al buscar el Area de Conocimiento', detalle: e.message ?? e };
    }
  }

  async remove(id: number) {
    try {
      const pool = await this.sqlService.getConnection();
      const request = pool.request();

      request.input('Id', id);
      await request.execute('Beca.sp_Delete_AreaConocimiento');

      return { mensaje: `AreaConocimiento con ID ${id} eliminado correctamente` };
    } catch (e) {
      console.error('Error al eliminar el Area de Conocimiento:', JSON.stringify(e, null, 2));
      return { error: 'Error al eliminar el Area de Conocimiento', detalle: e.message ?? e };
    }
  }
}
