import { Injectable } from '@nestjs/common';
import { SqlService } from '../../ms/cnxjs/sql.service';
import { CreateTipoBecaDto } from './dto/create-TipoBeca.dto';

@Injectable()
export class TipoBecaService {
  constructor(private readonly sqlService: SqlService) {}

 async create(obj: CreateTipoBecaDto) {
  try {
    console.log('📥 DTO recibido en create():', obj);

    const pool = await this.sqlService.getConnection();
    const request = pool.request();

    const id = obj.Id ?? 0;
    const EstadoId = Number(obj.EstadoId);

    request.input('Id', id);
    request.input('Nombre', obj.Nombre);
    request.input('Descripcion', obj.Descripcion);
    request.input('Monto', obj.Monto);
    request.input('EstadoId', EstadoId);

    const result: any = await request.execute('Beca.sp_Save_TipoBeca');

    const TipoBecaId =
      result.recordset?.[0]?.NewId ||
      result.recordset?.[0]?.UpdatedId ||
      id;

    const estadoResult = await pool
      .request()
      .input('Id', EstadoId)
      .execute('Beca.sp_Get_Estado');
    const estadoNombre = estadoResult.recordset?.[0]?.Nombre ?? null;

    return {
      id: TipoBecaId,
      Nombre:obj.Nombre,
      Descripcion: obj.Descripcion,
      Monto:obj.Monto,
      EstadoId,
      Estadonombre: estadoNombre,
    };
  } catch (e) {
    console.error('Error al ejecutar el SP:', JSON.stringify(e, null, 2));
    return { error: 'Error interno', detalle: e.message ?? e };
  }
}

  async findAll() {
    try {
      const pool = await this.sqlService.getConnection();

      const TipoBecaResult: any = await pool
        .request()
        .input('Id', 0)
        .execute('Beca.sp_Get_TipoBeca');
      const TipoBecas = TipoBecaResult.recordset;

      const estadosResult: any = await pool
        .request()
        .input('Id', 0)
        .execute('Beca.sp_Get_Estado');
      const estados = estadosResult.recordset;

      const TipoBecasConNombres = TipoBecas.map(req => {
        const estadoId = Number(req.EstadoId);

        const estado = estados.find(e => e.Id === estadoId);

        return {
          ...req,
          Estadonombre: estado?.Nombre ?? null,
        };
      });

      return TipoBecasConNombres;
    } catch (e) {
      console.error('Error al obtener los TipoBecas', JSON.stringify(e, null, 2));
      return { error: 'Error al obtener los TipoBecas', detalle: e.message ?? e };
    }
  }

  async findOne(id: number) {
    try {
      const pool = await this.sqlService.getConnection();

      const TipoBecaResult: any = await pool
        .request()
        .input('Id', id)
        .execute('Beca.sp_Get_TipoBeca');

      if (TipoBecaResult.recordset.length === 0) {
        return { mensaje: `TipoBeca con ID ${id} no encontrado` };
      }

      const TipoBeca = TipoBecaResult.recordset[0];

      const estadoResult = await pool
        .request()
        .input('Id', Number(TipoBeca.EstadoId))
        .execute('Beca.sp_Get_Estado');
      const estadoNombre = estadoResult.recordset?.[0]?.Nombre ?? null;

      return {
        ...TipoBeca,
        Estadonombre: estadoNombre,
      };
    } catch (e) {
      console.error('Error al buscar el TipoBeca por ID:', JSON.stringify(e, null, 2));
      return { error: 'Error al buscar el TipoBeca', detalle: e.message ?? e };
    }
  }

  async remove(id: number) {
    try {
      const pool = await this.sqlService.getConnection();

      const TipoBecaResult: any = await pool
        .request()
        .input('Id', id)
        .execute('Beca.sp_Get_TipoBeca');

      if (TipoBecaResult.recordset.length === 0) {
        return { mensaje: `TipoBeca con ID ${id} no encontrado` };
      }

      const TipoBeca = TipoBecaResult.recordset[0];

      const estadoResult = await pool
        .request()
        .input('Id', Number(TipoBeca.EstadoId))
        .execute('Beca.sp_Get_Estado');
      const estadoNombre = estadoResult.recordset?.[0]?.Nombre ?? null;

      await pool
        .request()
        .input('Id', id)
        .execute('Beca.sp_Delete_TipoBeca');

      return {
        mensaje: `TipoBeca con ID ${id} eliminado correctamente`,
        TipoBeca: {
          ...TipoBeca,
          Estadonombre: estadoNombre,
        },
      };
    } catch (e) {
      console.error('Error al eliminar el TipoBeca:', JSON.stringify(e, null, 2));
      return {
        error: 'Error al eliminar el TipoBeca',
        detalle: e.message ?? e,
      };
    }
  }
}
