import { Injectable } from '@nestjs/common';
import { SqlService } from '../../ms/cnxjs/sql.service';
import { CreateRequisitoDto } from './dto/create-Requisito.dto';

@Injectable()
export class RequisitoService {
  constructor(private readonly sqlService: SqlService) {}

 

  async create(obj: CreateRequisitoDto) {
  try {
    console.log('📥 DTO recibido en create():', obj);

    // Validar que EstudianteId sea estrictamente un número válido (no booleano ni otro tipo)
    if (typeof obj.EstudianteId !== 'number' || isNaN(obj.EstudianteId)) {
      return { error: 'EstudianteId debe ser un número válido, no booleano u otro tipo.' };
    }

    const pool = await this.sqlService.getConnection();
    const request = pool.request();

    const id = obj.Id ?? 0;
    const EstudianteId = Number(obj.EstudianteId);  // Ya validado como número
    const EstadoId = Number(obj.EstadoId);

    request.input('Id', id);
    request.input('Descripcion', obj.Descripcion);
    request.input('EstudianteId', EstudianteId);
    request.input('EstadoId', EstadoId);

    const result: any = await request.execute('Beca.sp_Save_Requisito');

    const requisitoId =
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

    const estadoResult = await pool
      .request()
      .input('Id', EstadoId)
      .execute('Beca.sp_Get_Estado');
    const estadoNombre = estadoResult.recordset?.[0]?.Nombre ?? null;

    return {
      id: requisitoId,
      Descripcion: obj.Descripcion,
      EstudianteId,
      Estudiantenombre: estudianteNombre,
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

      const requisitoResult: any = await pool
        .request()
        .input('Id', 0)
        .execute('Beca.sp_Get_Requisito');
      const requisitos = requisitoResult.recordset;

      const estudiantesResult: any = await pool
        .request()
        .input('Id', 0)
        .execute('Beca.sp_Get_Estudiante');
      const estudiantes = estudiantesResult.recordset;
      console.log('Estudiante Result:', estudiantesResult.recordset);

      const estadosResult: any = await pool
        .request()
        .input('Id', 0)
        .execute('Beca.sp_Get_Estado');
      const estados = estadosResult.recordset;

      const requisitosConNombres = requisitos.map(req => {
        const estudianteId = Number(req.EstudianteId);
        const estadoId = Number(req.EstadoId);

        const estudiante = estudiantes.find(e => e.Id === estudianteId);
        const estado = estados.find(e => e.Id === estadoId);

        return {
          ...req,
          Estudiantenombre: estudiante?.Nombre ?? null,
          Estadonombre: estado?.Nombre ?? null,
        };
      });

      return requisitosConNombres;
    } catch (e) {
      console.error('Error al obtener los requisitos', JSON.stringify(e, null, 2));
      return { error: 'Error al obtener los requisitos', detalle: e.message ?? e };
    }
  }

  async findOne(id: number) {
    try {
      const pool = await this.sqlService.getConnection();

      const requisitoResult: any = await pool
        .request()
        .input('Id', id)
        .execute('Beca.sp_Get_Requisito');

      if (requisitoResult.recordset.length === 0) {
        return { mensaje: `Requisito con ID ${id} no encontrado` };
      }

      const requisito = requisitoResult.recordset[0];

      const estudianteResult = await pool
        .request()
        .input('Id', Number(requisito.EstudianteId))
        .execute('Beca.sp_Get_Estudiante');
      const estudianteNombre = estudianteResult.recordset?.[0]
        ? `${estudianteResult.recordset[0].Nombre} ${estudianteResult.recordset[0].Apellido}`
        : null;

      const estadoResult = await pool
        .request()
        .input('Id', Number(requisito.EstadoId))
        .execute('Beca.sp_Get_Estado');
      const estadoNombre = estadoResult.recordset?.[0]?.Nombre ?? null;

      return {
        ...requisito,
        Estudiantenombre: estudianteNombre,
        Estadonombre: estadoNombre,
      };
    } catch (e) {
      console.error('Error al buscar el requisito por ID:', JSON.stringify(e, null, 2));
      return { error: 'Error al buscar el requisito', detalle: e.message ?? e };
    }
  }

  async remove(id: number) {
    try {
      const pool = await this.sqlService.getConnection();

      const requisitoResult: any = await pool
        .request()
        .input('Id', id)
        .execute('Beca.sp_Get_Requisito');

      if (requisitoResult.recordset.length === 0) {
        return { mensaje: `Requisito con ID ${id} no encontrado` };
      }

      const requisito = requisitoResult.recordset[0];

      const estudianteResult = await pool
        .request()
        .input('Id', Number(requisito.EstudianteId))
        .execute('Beca.sp_Get_Estudiante');
      const estudianteNombre = estudianteResult.recordset?.[0]
        ? `${estudianteResult.recordset[0].Nombre} ${estudianteResult.recordset[0].Apellido}`
        : null;

      const estadoResult = await pool
        .request()
        .input('Id', Number(requisito.EstadoId))
        .execute('Beca.sp_Get_Estado');
      const estadoNombre = estadoResult.recordset?.[0]?.Nombre ?? null;

      await pool
        .request()
        .input('Id', id)
        .execute('Beca.sp_Delete_Requisito');

      return {
        mensaje: `Requisito con ID ${id} eliminado correctamente`,
        requisito: {
          ...requisito,
          Estudiantenombre: estudianteNombre,
          Estadonombre: estadoNombre,
        },
      };
    } catch (e) {
      console.error('Error al eliminar el requisito:', JSON.stringify(e, null, 2));
      return {
        error: 'Error al eliminar el requisito',
        detalle: e.message ?? e,
      };
    }
  }
}
