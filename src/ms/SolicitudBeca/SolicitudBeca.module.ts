import { Module } from '@nestjs/common';
import {SolicitudBecaController } from './SolicitudBeca.controller';
import { SolicitudBecaService } from './SolicitudBeca.service';
import { SqlService } from '../cnxjs/sql.service';

@Module({
  controllers: [SolicitudBecaController],
  providers: [SolicitudBecaService, SqlService]
})
export class SolicitudBecaModule {}
