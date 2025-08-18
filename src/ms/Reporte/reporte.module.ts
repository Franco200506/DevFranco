import { Module } from '@nestjs/common';
import { ReportesController } from './reporte.controller';
import { ReporteService} from './reporte.service';
import { SqlService } from '../cnxjs/sql.service';

@Module({
  controllers: [ReportesController],
  providers: [ReporteService, SqlService]
})
export class reporteModule {}
