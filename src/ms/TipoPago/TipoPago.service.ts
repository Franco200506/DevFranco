import { Injectable } from '@nestjs/common';
import { SqlService } from '../../ms/cnxjs/sql.service';
import { CreateTipoPagoDto } from './dto/create-TipoPago.dto';

@Injectable()
export class TipoPagoService {
  constructor(private readonly sqlService: SqlService) {}

 async create(obj: CreateTipoPagoDto) {
  try {
    console.log('📥 DTO recibido en create():', obj);

    const pool = await this.sqlService.getConnection();
    const request = pool.request();

    const id = obj.Id ?? 0;
    const EstadoId = Number(obj.EstadoId);

    request.input('Id', id);
    request.input('Nombre', obj.Nombre);
    request.input('Descripcion', obj.Descripcion);
    request.input('EstadoId', EstadoId);

    const result: any = await request.execute('Beca.sp_Save_TipoPago');

    const TipoPagoId =
      result.recordset?.[0]?.NewId ||
      result.recordset?.[0]?.UpdatedId ||
      id;

    const estadoResult = await pool
      .request()
      .input('Id', EstadoId)
      .execute('Beca.sp_Get_Estado');
    const estadoNombre = estadoResult.recordset?.[0]?.Nombre ?? null;

    return {
      id: TipoPagoId,
      Nombre:obj.Nombre,
      Descripcion: obj.Descripcion,
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

      const TipoPagoResult: any = await pool
        .request()
        .input('Id', 0)
        .execute('Beca.sp_Get_TipoPago');
      const TipoPagos = TipoPagoResult.recordset;

      const estadosResult: any = await pool
        .request()
        .input('Id', 0)
        .execute('Beca.sp_Get_Estado');
      const estados = estadosResult.recordset;

      const TipoPagosConNombres = TipoPagos.map(req => {
        const estadoId = Number(req.EstadoId);

        const estado = estados.find(e => e.Id === estadoId);

        return {
          ...req,
          Estadonombre: estado?.Nombre ?? null,
        };
      });

      return TipoPagosConNombres;
    } catch (e) {
      console.error('Error al obtener los TipoPagos', JSON.stringify(e, null, 2));
      return { error: 'Error al obtener los TipoPagos', detalle: e.message ?? e };
    }
  }

  async findOne(id: number) {
    try {
      const pool = await this.sqlService.getConnection();

      const TipoPagoResult: any = await pool
        .request()
        .input('Id', id)
        .execute('Beca.sp_Get_TipoPago');

      if (TipoPagoResult.recordset.length === 0) {
        return { mensaje: `TipoPago con ID ${id} no encontrado` };
      }

      const TipoPago = TipoPagoResult.recordset[0];

      const estadoResult = await pool
        .request()
        .input('Id', Number(TipoPago.EstadoId))
        .execute('Beca.sp_Get_Estado');
      const estadoNombre = estadoResult.recordset?.[0]?.Nombre ?? null;

      return {
        ...TipoPago,
        Estadonombre: estadoNombre,
      };
    } catch (e) {
      console.error('Error al buscar el TipoPago por ID:', JSON.stringify(e, null, 2));
      return { error: 'Error al buscar el TipoPago', detalle: e.message ?? e };
    }
  }

  async remove(id: number) {
    try {
      const pool = await this.sqlService.getConnection();

      const TipoPagoResult: any = await pool
        .request()
        .input('Id', id)
        .execute('Beca.sp_Get_TipoPago');

      if (TipoPagoResult.recordset.length === 0) {
        return { mensaje: `TipoPago con ID ${id} no encontrado` };
      }

      const TipoPago = TipoPagoResult.recordset[0];

      const estadoResult = await pool
        .request()
        .input('Id', Number(TipoPago.EstadoId))
        .execute('Beca.sp_Get_Estado');
      const estadoNombre = estadoResult.recordset?.[0]?.Nombre ?? null;

      await pool
        .request()
        .input('Id', id)
        .execute('Beca.sp_Delete_TipoPago');

      return {
        mensaje: `TipoPago con ID ${id} eliminado correctamente`,
        TipoPago: {
          ...TipoPago,
          Estadonombre: estadoNombre,
        },
      };
    } catch (e) {
      console.error('Error al eliminar el TipoPago:', JSON.stringify(e, null, 2));
      return {
        error: 'Error al eliminar el TipoPago',
        detalle: e.message ?? e,
      };
    }
  }
}
