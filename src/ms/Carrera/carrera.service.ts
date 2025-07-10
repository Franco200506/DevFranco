import { Injectable } from '@nestjs/common';
import { SqlService } from '../../ms/cnxjs/sql.service';
import { CreatecarreraDto } from './dto/create-carrera.dto';

@Injectable()
export class carreraService {
  constructor(private readonly sqlService: SqlService) {}

  async create(obj: CreatecarreraDto) {
    try {
      const pool = await this.sqlService.getConnection();
      const request = pool.request();

      const id = obj.Id ?? 0;
      const AreaConocimientoId = Number(obj.AreaConocimientoId);

      request.input('Id', id);
      request.input('Nombre', obj.Nombre);
      request.input('AreaConocimientoId', AreaConocimientoId);

      const result: any = await request.execute('Beca.sp_Save_Carrera');

      const carreraId =
        result.recordset?.[0]?.NewId ||
        result.recordset?.[0]?.UpdatedId ||
        id;

      const areaResult = await pool
        .request()
        .input('Id', AreaConocimientoId)
        .execute('Beca.sp_Get_AreaConocimiento');

      const areanombre = areaResult.recordset?.[0]?.nombre ?? null;

      return {
        id: carreraId,
        Nombre: obj.Nombre,
        AreaConocimientoId,
        AreaConocimientonombre: areanombre,
      };
    } catch (e) {
      console.error('Error al ejecutar el SP:', JSON.stringify(e, null, 2));
      return {
        error: 'Error interno',
        detalle: e.message ?? e,
      };
    }
  }

  async findAll() {
    try {
      const pool = await this.sqlService.getConnection();

      const carreraResult: any = await pool
        .request()
        .input('Id', 0)
        .execute('Beca.sp_Get_Carrera');
      const carreras = carreraResult.recordset;

      const areaResult: any = await pool
        .request()
        .input('Id', 0)
        .execute('Beca.sp_Get_AreaConocimiento');
      const areas = areaResult.recordset;

      const carrerasConAreas = carreras.map(carrera => {
        const area = areas.find(a => a.Id === carrera.AreaConocimientoId);
        return {
          ...carrera,
          AreaConocimientonombre: area?.nombre ?? null
        };
      });

      return carrerasConAreas;
    } catch (e) {
      console.error('Error al obtener la carrera', JSON.stringify(e, null, 2));
      return { error: 'Error al obtener la carrera', detalle: e.message ?? e };
    }
  }

  async findOne(id: number) {
    try {
      const pool = await this.sqlService.getConnection();

      const carreraResult: any = await pool
        .request()
        .input('Id', id)
        .execute('Beca.sp_Get_Carrera');

      if (carreraResult.recordset.length === 0) {
        return { mensaje: `carrera con ID ${id} no encontrado` };
      }

      const carrera = carreraResult.recordset[0];

      const areaResult = await pool
        .request()
        .input('Id', carrera.AreaConocimientoId)
        .execute('Beca.sp_Get_AreaConocimiento');

      const areanombre = areaResult.recordset?.[0]?.nombre ?? null;

      return {
        ...carrera,
        AreaConocimientonombre: areanombre
      };
    } catch (e) {
      console.error('Error al buscar la carrera por ID:', JSON.stringify(e, null, 2));
      return { error: 'Error al buscar la carrera', detalle: e.message ?? e };
    }
  }

  async remove(id: number) {
    try {
      const pool = await this.sqlService.getConnection();

      const carreraResult: any = await pool
        .request()
        .input('Id', id)
        .execute('Beca.sp_Get_Carrera');

      if (carreraResult.recordset.length === 0) {
        return { mensaje: `Carrera con ID ${id} no encontrada` };
      }

      const carrera = carreraResult.recordset[0];

      const areaResult = await pool
        .request()
        .input('Id', carrera.AreaConocimientoId)
        .execute('Beca.sp_Get_AreaConocimiento');

      const areanombre = areaResult.recordset?.[0]?.nombre ?? null;

      await pool
        .request()
        .input('Id', id)
        .execute('Beca.sp_Delete_Carrera');

      return {
        mensaje: `Carrera con ID ${id} eliminada correctamente`,
        carrera: {
          ...carrera,
          AreaConocimientonombre: areanombre
        }
      };
    } catch (e) {
      console.error('Error al eliminar la carrera:', JSON.stringify(e, null, 2));
      return {
        error: 'Error al eliminar la carrera',
        detalle: e.message ?? e
      };
    }
  }
}
