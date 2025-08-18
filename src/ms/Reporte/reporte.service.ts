import { Injectable } from '@nestjs/common';
import { SqlService } from '../cnxjs/sql.service';

@Injectable()
export class ReporteService {
  constructor(private readonly sqlService: SqlService) {}

  /**
   * Obtener resumen total de solicitudes
   * @param periodoAcademicoId Opcional: filtra por periodo académico
   * @param estadoId Opcional: filtra por estado específico
   */
  async getTotales(periodoAcademicoId?: number, estadoId?: number) {
    const query = `
      EXEC Beca.sp_ResumenTotales 
        @PeriodoAcademicoId = ${periodoAcademicoId ?? 'NULL'}, 
        @EstadoId = ${estadoId ?? 'NULL'}
    `;
    const result = await this.sqlService.query(query);
    return result;
  }

  /**
   * Obtener cantidad de solicitudes por estado
   * @param periodoAcademicoId Opcional: filtra por periodo académico
   */
  async getSolicitudesPorEstado(periodoAcademicoId?: number) {
    const query = `
      EXEC Beca.sp_SolicitudesPorEstado 
        @PeriodoAcademicoId = ${periodoAcademicoId ?? 'NULL'}
    `;
    const result = await this.sqlService.query(query);
    return result;
  }
}
