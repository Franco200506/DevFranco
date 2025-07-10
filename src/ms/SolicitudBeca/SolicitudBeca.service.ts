import { Injectable } from '@nestjs/common';
import { SqlService } from '../../ms/cnxjs/sql.service';
import { CreateSolicitudBecaDto } from './dto/create-SolicitudBeca.dto';

@Injectable()
export class SolicitudBecaService {
  constructor(private readonly sqlService: SqlService) {}

  async create(obj: CreateSolicitudBecaDto) {
    try {
      console.log('📥 DTO recibido en create():', obj);

      if (typeof obj.EstudianteId !== 'number' || isNaN(obj.EstudianteId)) {
        return { error: 'EstudianteId debe ser un número válido, no booleano u otro tipo.' };
      }

      const pool = await this.sqlService.getConnection();
      const request = pool.request();

      const id = obj.Id ?? 0;
      const EstudianteId = Number(obj.EstudianteId);
      const EstadoId = Number(obj.EstadoId);
      const TipoBecaId = Number(obj.TipoBecaId);
      const PeriodoAcademicoId = Number(obj.PeriodoAcademicoId);

      request.input('Id', id);
      request.input('EstudianteId', EstudianteId);
      request.input('TipoBecaId', TipoBecaId);
      request.input('EstadoId', EstadoId);
      request.input('FechaSolicitud', obj.FechaSolicitud);
      request.input('PeriodoAcademicoId', PeriodoAcademicoId);
      request.input('Observaciones', obj.Observaciones);
      request.input('Fecha_resultado', obj.Fecha_resultado);

      const result: any = await request.execute('Beca.sp_Save_SolicitudBeca');

      const SolicitudBecaId =
        result.recordset?.[0]?.NewId ||
        result.recordset?.[0]?.UpdatedId ||
        id;

      const estudianteResult = await pool
        .request()
        .input('Id', EstudianteId)
        .execute('Beca.sp_Get_Estudiante');
      const estudianteNombre = estudianteResult.recordset?.[0]
        ? `${estudianteResult.recordset[0].Nombre} ${estudianteResult.recordset[0].Apellido}`
        : null;

      const tipobecaResult = await pool
        .request()
        .input('Id', TipoBecaId)
        .execute('Beca.sp_Get_TipoBeca');
      const tipobecaNombre = tipobecaResult.recordset?.[0]?.Nombre ?? null;

      const estadoResult = await pool
        .request()
        .input('Id', EstadoId)
        .execute('Beca.sp_Get_Estado');
      const estadoNombre = estadoResult.recordset?.[0]?.Nombre ?? null;

      const periodoacademicoResult = await pool
        .request()
        .input('Id', PeriodoAcademicoId)
        .execute('Beca.sp_Get_PeriodoAcademico');
      const periodoacademicoNombre = periodoacademicoResult.recordset?.[0]?.Nombre ?? null;

      return {
        id: SolicitudBecaId,
        EstudianteId,
        Estudiantenombre: estudianteNombre,
        TipoBecaId,
        TipoBecanombre: tipobecaNombre,
        EstadoId,
        Estadonombre: estadoNombre,
        FechaSolicitud: obj.FechaSolicitud,
        PeriodoAcademicoId,
        PeriodoAcademiconombre: periodoacademicoNombre,
        Observaciones: obj.Observaciones,
        Fecha_resultado: obj.Fecha_resultado,
      };
    } catch (e) {
      console.error('Error al ejecutar el SP:', JSON.stringify(e, null, 2));
      return { error: 'Error interno', detalle: e.message ?? e };
    }
  }

  async findAll() {
    try {
      const pool = await this.sqlService.getConnection();

      const [solicitudesResult, estudiantesResult, estadosResult, tiposBecaResult, periodosResult] = await Promise.all([
        pool.request().input('Id', 0).execute('Beca.sp_Get_SolicitudBeca'),
        pool.request().input('Id', 0).execute('Beca.sp_Get_Estudiante'),
        pool.request().input('Id', 0).execute('Beca.sp_Get_Estado'),
        pool.request().input('Id', 0).execute('Beca.sp_Get_TipoBeca'),
        pool.request().input('Id', 0).execute('Beca.sp_Get_PeriodoAcademico'),
      ]);

      const solicitudes = solicitudesResult.recordset;
      const estudiantes = estudiantesResult.recordset;
      const estados = estadosResult.recordset;
      const tiposBeca = tiposBecaResult.recordset;
      const periodos = periodosResult.recordset;

      const solicitudesConNombres = solicitudes.map(s => {
        const estudiante = estudiantes.find(e => e.Id === s.EstudianteId);
        const estado = estados.find(e => e.Id === s.EstadoId);
        const tipoBeca = tiposBeca.find(t => t.Id === s.TipoBecaId);
        const periodo = periodos.find(p => p.Id === s.PeriodoAcademicoId);

        return {
          ...s,
          Estudiantenombre: estudiante ? `${estudiante.Nombre} ${estudiante.Apellido}` : null,
          TipoBecanombre: tipoBeca?.Nombre ?? null,
          Estadonombre: estado?.Nombre ?? null,
          PeriodoAcademiconombre: periodo?.Nombre ?? null,
        };
      });

      return solicitudesConNombres;
    } catch (e) {
      console.error('Error al obtener los SolicitudBecas', JSON.stringify(e, null, 2));
      return { error: 'Error al obtener los SolicitudBecas', detalle: e.message ?? e };
    }
  }

  async findOne(id: number) {
    try {
      const pool = await this.sqlService.getConnection();

      const SolicitudBecaResult: any = await pool
        .request()
        .input('Id', id)
        .execute('Beca.sp_Get_SolicitudBeca');

      if (SolicitudBecaResult.recordset.length === 0) {
        return { mensaje: `SolicitudBeca con ID ${id} no encontrado` };
      }

      const solicitud = SolicitudBecaResult.recordset[0];

      const [
        estudianteResult,
        estadoResult,
        tipoBecaResult,
        periodoResult
      ] = await Promise.all([
        pool.request().input('Id', solicitud.EstudianteId).execute('Beca.sp_Get_Estudiante'),
        pool.request().input('Id', solicitud.EstadoId).execute('Beca.sp_Get_Estado'),
        pool.request().input('Id', solicitud.TipoBecaId).execute('Beca.sp_Get_TipoBeca'),
        pool.request().input('Id', solicitud.PeriodoAcademicoId).execute('Beca.sp_Get_PeriodoAcademico'),
      ]);

      return {
        ...solicitud,
        Estudiantenombre: estudianteResult.recordset?.[0]
          ? `${estudianteResult.recordset[0].Nombre} ${estudianteResult.recordset[0].Apellido}` : null,
        TipoBecanombre: tipoBecaResult.recordset?.[0]?.Nombre ?? null,
        Estadonombre: estadoResult.recordset?.[0]?.Nombre ?? null,
        PeriodoAcademiconombre: periodoResult.recordset?.[0]?.Nombre ?? null,
      };
    } catch (e) {
      console.error('Error al buscar el SolicitudBeca por ID:', JSON.stringify(e, null, 2));
      return { error: 'Error al buscar el SolicitudBeca', detalle: e.message ?? e };
    }
  }

  async remove(id: number) {
    try {
      const pool = await this.sqlService.getConnection();

      const SolicitudBecaResult: any = await pool
        .request()
        .input('Id', id)
        .execute('Beca.sp_Get_SolicitudBeca');

      if (SolicitudBecaResult.recordset.length === 0) {
        return { mensaje: `SolicitudBeca con ID ${id} no encontrado` };
      }

      const solicitud = SolicitudBecaResult.recordset[0];

      const [estudianteResult, estadoResult, tipoBecaResult, periodoResult] = await Promise.all([
        pool.request().input('Id', solicitud.EstudianteId).execute('Beca.sp_Get_Estudiante'),
        pool.request().input('Id', solicitud.EstadoId).execute('Beca.sp_Get_Estado'),
        pool.request().input('Id', solicitud.TipoBecaId).execute('Beca.sp_Get_TipoBeca'),
        pool.request().input('Id', solicitud.PeriodoAcademicoId).execute('Beca.sp_Get_PeriodoAcademico'),
      ]);

      await pool
        .request()
        .input('Id', id)
        .execute('Beca.sp_Delete_SolicitudBeca');

      return {
        mensaje: `SolicitudBeca con ID ${id} eliminado correctamente`,
        SolicitudBeca: {
          ...solicitud,
          Estudiantenombre: estudianteResult.recordset?.[0]
            ? `${estudianteResult.recordset[0].Nombre} ${estudianteResult.recordset[0].Apellido}` : null,
          TipoBecanombre: tipoBecaResult.recordset?.[0]?.Nombre ?? null,
          Estadonombre: estadoResult.recordset?.[0]?.Nombre ?? null,
          PeriodoAcademiconombre: periodoResult.recordset?.[0]?.Nombre ?? null,
        },
      };
    } catch (e) {
      console.error('Error al eliminar el SolicitudBeca:', JSON.stringify(e, null, 2));
      return {
        error: 'Error al eliminar el SolicitudBeca',
        detalle: e.message ?? e,
      };
    }
  }
}
