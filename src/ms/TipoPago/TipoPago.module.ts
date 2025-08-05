import { Module } from '@nestjs/common';
import {TipoPagoController } from './TipoPago.controller';
import { TipoPagoService } from './TipoPago.service';
import { SqlService } from '../cnxjs/sql.service';

@Module({
  controllers: [TipoPagoController],
  providers: [TipoPagoService, SqlService]
})
export class TipoPagoModule {}
