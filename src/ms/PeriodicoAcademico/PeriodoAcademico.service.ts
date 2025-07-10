import { Injectable } from '@nestjs/common';
import { SqlService } from '../../ms/cnxjs/sql.service';
import { CreatePeriodoAcademicoDto } from './dto/create-PeriodoAcademico.dto';

@Injectable()
export class PeriodoAcademicoService {
  constructor(private readonly sqlService: SqlService) {}

 async create(obj: CreatePeriodoAcademicoDto) {
  try {
    console.log('📥 DTO recibido en create():', obj);

    const pool = await this.sqlService.getConnection();
    const request = pool.request();

    const id = obj.Id ?? 0;
    const EstadoId = Number(obj.EstadoId);

    request.input('Id', id);
    request.input('Nombre', obj.Nombre);
    request.input('AnioAcademico', obj.AnioAcademico);
    request.input('FechaInicio', obj.FechaInicio);
    request.input('FechaFin', obj.FechaFin);
    request.input('EstadoId', EstadoId);

    const result: any = await request.execute('Beca.sp_Save_PeriodoAcademico');

    const PeriodoAcademicoId =
      result.recordset?.[0]?.NewId ||
      result.recordset?.[0]?.UpdatedId ||
      id;

    const estadoResult = await pool
      .request()
      .input('Id', EstadoId)
      .execute('Beca.sp_Get_Estado');
    const estadoNombre = estadoResult.recordset?.[0]?.Nombre ?? null;

    return {
      id: PeriodoAcademicoId,
      Nombre:obj.Nombre,
      AnioAcademico: obj.AnioAcademico,
      FechaInicio: obj.FechaInicio,
      FechaFin: obj.FechaFin,
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

      const PeriodoAcademicoResult: any = await pool
        .request()
        .input('Id', 0)
        .execute('Beca.sp_Get_PeriodoAcademico');
      const PeriodoAcademicos = PeriodoAcademicoResult.recordset;

      const estadosResult: any = await pool
        .request()
        .input('Id', 0)
        .execute('Beca.sp_Get_Estado');
      const estados = estadosResult.recordset;

      const PeriodoAcademicosConNombres = PeriodoAcademicos.map(req => {
        const estadoId = Number(req.EstadoId);

        const estado = estados.find(e => e.Id === estadoId);

        return {
          ...req,
          Estadonombre: estado?.Nombre ?? null,
        };
      });

      return PeriodoAcademicosConNombres;
    } catch (e) {
      console.error('Error al obtener los PeriodoAcademicos', JSON.stringify(e, null, 2));
      return { error: 'Error al obtener los PeriodoAcademicos', detalle: e.message ?? e };
    }
  }

  async findOne(id: number) {
    try {
      const pool = await this.sqlService.getConnection();

      const PeriodoAcademicoResult: any = await pool
        .request()
        .input('Id', id)
        .execute('Beca.sp_Get_PeriodoAcademico');

      if (PeriodoAcademicoResult.recordset.length === 0) {
        return { mensaje: `PeriodoAcademico con ID ${id} no encontrado` };
      }

      const PeriodoAcademico = PeriodoAcademicoResult.recordset[0];

      const estadoResult = await pool
        .request()
        .input('Id', Number(PeriodoAcademico.EstadoId))
        .execute('Beca.sp_Get_Estado');
      const estadoNombre = estadoResult.recordset?.[0]?.Nombre ?? null;

      return {
        ...PeriodoAcademico,
        Estadonombre: estadoNombre,
      };
    } catch (e) {
      console.error('Error al buscar el PeriodoAcademico por ID:', JSON.stringify(e, null, 2));
      return { error: 'Error al buscar el PeriodoAcademico', detalle: e.message ?? e };
    }
  }

  async remove(id: number) {
    try {
      const pool = await this.sqlService.getConnection();

      const PeriodoAcademicoResult: any = await pool
        .request()
        .input('Id', id)
        .execute('Beca.sp_Get_PeriodoAcademico');

      if (PeriodoAcademicoResult.recordset.length === 0) {
        return { mensaje: `PeriodoAcademico con ID ${id} no encontrado` };
      }

      const PeriodoAcademico = PeriodoAcademicoResult.recordset[0];

      const estadoResult = await pool
        .request()
        .input('Id', Number(PeriodoAcademico.EstadoId))
        .execute('Beca.sp_Get_Estado');
      const estadoNombre = estadoResult.recordset?.[0]?.Nombre ?? null;

      await pool
        .request()
        .input('Id', id)
        .execute('Beca.sp_Delete_PeriodoAcademico');

      return {
        mensaje: `PeriodoAcademico con ID ${id} eliminado correctamente`,
        PeriodoAcademico: {
          ...PeriodoAcademico,
          Estadonombre: estadoNombre,
        },
      };
    } catch (e) {
      console.error('Error al eliminar el PeriodoAcademico:', JSON.stringify(e, null, 2));
      return {
        error: 'Error al eliminar el PeriodoAcademico',
        detalle: e.message ?? e,
      };
    }
  }
}
