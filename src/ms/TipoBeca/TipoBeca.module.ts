import { Module } from '@nestjs/common';
import {TipoBecaController } from './TipoBeca.controller';
import { TipoBecaService } from './TipoBeca.service';
import { SqlService } from '../cnxjs/sql.service';

@Module({
  controllers: [TipoBecaController],
  providers: [TipoBecaService, SqlService]
})
export class TipoBecaModule {}
