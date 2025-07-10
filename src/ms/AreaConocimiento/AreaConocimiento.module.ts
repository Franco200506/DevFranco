import { Module } from '@nestjs/common';
import { AreaConocimientoController } from './AreaConocimiento.controller';
import { AreaConocimientoService } from './AreaConocimiento.service';
import { SqlService } from '../cnxjs/sql.service';

@Module({
  controllers: [AreaConocimientoController],
  providers: [AreaConocimientoService, SqlService]
})
export class AreaConocimientoModule {}
