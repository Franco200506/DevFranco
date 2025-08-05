import { Module } from '@nestjs/common';
import {DetallePagoController } from './DetallePago.controller';
import { DetallePagoService } from './DetallePago.service';
import { SqlService } from '../cnxjs/sql.service';

@Module({
  controllers: [DetallePagoController],
  providers: [DetallePagoService, SqlService]
})
export class DetallePagoModule {}
