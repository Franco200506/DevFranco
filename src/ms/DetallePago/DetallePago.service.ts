import { Injectable } from '@nestjs/common';
import { SqlService } from '../../ms/cnxjs/sql.service';
import { CreateDetallePagoDto } from './dto/create-DetallePago.dto';

@Injectable()
export class DetallePagoService {
  constructor(private readonly sqlService: SqlService) {}

  async create(obj: CreateDetallePagoDto) {
    try {
      console.log('📥 DTO recibido en create():', obj);

      const pool = await this.sqlService.getConnection();
      const request = pool.request();

      const id = obj.Id ?? 0;
      const EstadoId = Number(obj.EstadoId);
      const SolicitudBecaId = Number(obj.SolicitudBecaId);
      const TipoPagoId = Number(obj.TipoPagoId);

      request.input('Id', id);
      request.input('SolicitudBecaId', SolicitudBecaId);
      request.input('TipoPagoId', TipoPagoId);
      request.input('Monto', obj.Monto);
      request.input('FechaPago', obj.FechaPago);
      request.input('Referencia', obj.Referencia);
      request.input('EstadoId', EstadoId);

      const result: any = await request.execute('Beca.sp_Save_DetallePago');

      const DetallePagoId =
        result.recordset?.[0]?.NewId ||
        result.recordset?.[0]?.UpdatedId ||
        id;

      const estadoResult = await pool
        .request()
        .input('Id', EstadoId)
        .execute('Beca.sp_Get_Estado');
      const estadoNombre = estadoResult.recordset?.[0]?.Nombre ?? null;

      const tipoPagoIdResult = await pool
        .request()
        .input('Id', TipoPagoId)
        .execute('Beca.sp_Get_TipoPago');
      const tipopagoNombre = tipoPagoIdResult.recordset?.[0]?.Nombre ?? null;

      return {
        id: DetallePagoId,
        SolicitudBecaId,
        TipoPagoId,
        TipoPagoNombre: tipopagoNombre,
        Monto: obj.Monto,
        FechaPago: obj.FechaPago,
        Referencia: obj.Referencia,
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

      const detallePagoResult: any = await pool
        .request()
        .input('Id', 0)
        .execute('Beca.sp_Get_DetallePago');
      const detallePagos = detallePagoResult.recordset;

      const estadosResult: any = await pool
        .request()
        .input('Id', 0)
        .execute('Beca.sp_Get_Estado');
      const estados = estadosResult.recordset;

      const tipoPagoResult: any = await pool
        .request()
        .input('Id', 0)
        .execute('Beca.sp_Get_TipoPago');
      const tipoPagos = tipoPagoResult.recordset;

      const detallePagosConNombres = detallePagos.map(req => {
        const estado = estados.find(e => e.Id === Number(req.EstadoId));
        const tipoPago = tipoPagos.find(tp => tp.Id === Number(req.TipoPagoId));

        return {
          ...req,
          Estadonombre: estado?.Nombre ?? null,
          TipoPagoNombre: tipoPago?.Nombre ?? null,
        };
      });

      return detallePagosConNombres;
    } catch (e) {
      console.error('Error al obtener los DetallePagos', JSON.stringify(e, null, 2));
      return { error: 'Error al obtener los DetallePagos', detalle: e.message ?? e };
    }
  }

  async findOne(id: number) {
    try {
      const pool = await this.sqlService.getConnection();

      const detallePagoResult: any = await pool
        .request()
        .input('Id', id)
        .execute('Beca.sp_Get_DetallePago');

      if (detallePagoResult.recordset.length === 0) {
        return { mensaje: `DetallePago con ID ${id} no encontrado` };
      }

      const detallePago = detallePagoResult.recordset[0];

      const estadoResult = await pool
        .request()
        .input('Id', Number(detallePago.EstadoId))
        .execute('Beca.sp_Get_Estado');
      const estadoNombre = estadoResult.recordset?.[0]?.Nombre ?? null;

      const tipoPagoResult = await pool
        .request()
        .input('Id', Number(detallePago.TipoPagoId))
        .execute('Beca.sp_Get_TipoPago');
      const tipoPagoNombre = tipoPagoResult.recordset?.[0]?.Nombre ?? null;

      return {
        ...detallePago,
        Estadonombre: estadoNombre,
        TipoPagoNombre: tipoPagoNombre,
      };
    } catch (e) {
      console.error('Error al buscar el DetallePago por ID:', JSON.stringify(e, null, 2));
      return { error: 'Error al buscar el DetallePago', detalle: e.message ?? e };
    }
  }

  async remove(id: number) {
    try {
      const pool = await this.sqlService.getConnection();

      const detallePagoResult: any = await pool
        .request()
        .input('Id', id)
        .execute('Beca.sp_Get_DetallePago');

      if (detallePagoResult.recordset.length === 0) {
        return { mensaje: `DetallePago con ID ${id} no encontrado` };
      }

      const detallePago = detallePagoResult.recordset[0];

      await pool
        .request()
        .input('Id', id)
        .execute('Beca.sp_Delete_DetallePago');

      return {
        mensaje: `DetallePago con ID ${id} eliminado correctamente`,
        DetallePago: detallePago,
      };
    } catch (e) {
      console.error('Error al eliminar el DetallePago:', JSON.stringify(e, null, 2));
      return {
        error: 'Error al eliminar el DetallePago',
        detalle: e.message ?? e,
      };
    }
  }
}
