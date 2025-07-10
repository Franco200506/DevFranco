import { Module } from '@nestjs/common';
import { Detalle_requisitos_becaController } from './Detalle_requisitos_beca.controller';
import { Detalle_requisitos_becaService } from './Detalle_requisitos_beca.service';
import { SqlService } from '../cnxjs/sql.service';

@Module({
  controllers: [Detalle_requisitos_becaController],
  providers: [Detalle_requisitos_becaService, SqlService]
})
export class Detalle_requisitos_becaModule {}
