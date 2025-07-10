import { Module } from '@nestjs/common';
import { EstadoController } from './Estado.controller';
import { EstadoService } from './Estado.service';
import { SqlService } from '../cnxjs/sql.service';

@Module({
  controllers: [EstadoController],
  providers: [EstadoService, SqlService]
})
export class EstadoModule {}
