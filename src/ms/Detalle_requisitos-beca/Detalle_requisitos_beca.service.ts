import { Injectable } from '@nestjs/common';
import { SqlService } from '../../ms/cnxjs/sql.service';
import { CreateDetalle_requisitos_becaDto } from './dto/create-Detalle-requisitos_beca.dto';

@Injectable()
export class Detalle_requisitos_becaService {
  constructor(private readonly sqlService: SqlService) {}

  // Función reutilizable que permite elegir qué campo extraer
  private async getCampoById(spName: string, id: number, campo: string): Promise<string | null> {
    const pool = await this.sqlService.getConnection();
    const result = await pool.request().input('Id', id).execute(spName);
    return result.recordset?.[0]?.[campo] ?? null;
  }

  async create(obj: CreateDetalle_requisitos_becaDto) {
    try {
      const pool = await this.sqlService.getConnection();
      const request = pool.request();

      const id_Detalle = obj.Id_Detalle ?? 0;
      const TipoBecaId = Number(obj.TipoBecaId);
      const RequisitoId = Number(obj.RequisitoId);

      request.input('Id_Detalle', id_Detalle);
      request.input('TipoBecaId', TipoBecaId);
      request.input('RequisitoId', RequisitoId);

      const result: any = await request.execute('Beca.sp_Save_Detalle_requisitos_beca');

      const Detalle_requisitos_becaId =
        result.recordset?.[0]?.NewId ||
        result.recordset?.[0]?.UpdatedId ||
        id_Detalle;

      const TipoBecaNombre = await this.getCampoById('Beca.sp_Get_TipoBeca', TipoBecaId, 'Nombre');
      const RequisitosNombre = await this.getCampoById('Beca.sp_Get_Requisito', RequisitoId, 'Descripcion');

      return {
        id: Detalle_requisitos_becaId,
        TipoBecaId,
        TipoBecaNombre,
        RequisitoId,
        RequisitosNombre,
      };
    } catch (e: any) {
      console.error('❌ Error:', e);
      return {
        error: 'Error interno',
        detalle: e?.message || e?.originalError?.info?.message || JSON.stringify(e),
      };
    }
  }

  async findAll() {
    try {
      const pool = await this.sqlService.getConnection();

      // ❌ NO SE ENVÍA .input('Id') porque el SP no lo acepta
      const Detalle_requisitos_becasResult = await pool.request().execute('Beca.sp_Get_Detalle_requisitos_beca');
      const Detalle_requisitos_becas = Detalle_requisitos_becasResult.recordset;

      const [RequisitossResult, TipoBecasResult] = await Promise.all([
        pool.request().input('Id', 0).execute('Beca.sp_Get_Requisito'),
        pool.request().input('Id', 0).execute('Beca.sp_Get_TipoBeca'),
      ]);

      const Requisitoss = RequisitossResult.recordset;
      const TipoBecas = TipoBecasResult.recordset;

      const Detalle_requisitos_becasConNombres = Detalle_requisitos_becas.map(est => {
        const Requisitos = Requisitoss.find(c => c.Id === est.RequisitoId);
        const TipoBeca = TipoBecas.find(e => e.Id === est.TipoBecaId);

        return {
          ...est,
          RequisitosNombre: Requisitos?.Descripcion ?? null,
          TipoBecaNombre: TipoBeca?.Nombre ?? null,
        };
      });

      return Detalle_requisitos_becasConNombres;
    } catch (e) {
      console.error('Error al obtener Detalle_requisitos_becas', JSON.stringify(e, null, 2));
      return { error: 'Error al obtener los Detalle_requisitos_becas', detalle: e.message ?? e };
    }
  }

  async findOne(id: number) {
    try {
      const pool = await this.sqlService.getConnection();

      // ✅ Usa 'Id_detalle' como parámetro
      const result = await pool.request().input('Id_detalle', id).execute('Beca.sp_Get_Detalle_requisitos_beca');
      if (result.recordset.length === 0) {
        return { mensaje: `Detalle_requisitos_beca con ID ${id} no encontrado` };
      }

      const item = result.recordset[0];

      const [TipoBecaNombre, RequisitosNombre] = await Promise.all([
        this.getCampoById('Beca.sp_Get_TipoBeca', item.TipoBecaId, 'Nombre'),
        this.getCampoById('Beca.sp_Get_Requisito', item.RequisitoId, 'Descripcion'),
      ]);

      return {
        ...item,
        TipoBecaNombre,
        RequisitosNombre,
      };
    } catch (e) {
      console.error('Error al buscar Detalle_requisitos_beca por ID:', JSON.stringify(e, null, 2));
      return { error: 'Error al buscar el Detalle_requisitos_beca', detalle: e.message ?? e };
    }
  }

  async remove(id: number) {
    try {
      const pool = await this.sqlService.getConnection();

      // ✅ Usa 'Id_detalle' como parámetro
      const result = await pool.request().input('Id_detalle', id).execute('Beca.sp_Get_Detalle_requisitos_beca');
      if (result.recordset.length === 0) {
        return { mensaje: `Detalle_requisitos_beca con ID ${id} no encontrado` };
      }

      const item = result.recordset[0];

      const [TipoBecaNombre, RequisitosNombre] = await Promise.all([
        this.getCampoById('Beca.sp_Get_TipoBeca', item.TipoBecaId, 'Nombre'),
        this.getCampoById('Beca.sp_Get_Requisito', item.RequisitoId, 'Descripcion'),
      ]);

      // ✅ Usa 'Id_detalle' en el delete
      await pool.request().input('Id_detalle', id).execute('Beca.sp_Delete_Detalle_requisitos_beca');

      return {
        mensaje: `Detalle_requisitos_beca con ID ${id} eliminado correctamente`,
        Detalle_requisitos_beca: {
          ...item,
          TipoBecaNombre,
          RequisitosNombre,
        },
      };
    } catch (e) {
      console.error('Error al eliminar Detalle_requisitos_beca:', JSON.stringify(e, null, 2));
      return { error: 'Error al eliminar el Detalle_requisitos_beca', detalle: e.message ?? e };
    }
  }
}
