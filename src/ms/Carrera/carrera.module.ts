import { Module } from '@nestjs/common';
import { carreraController } from './carrera.controller';
import { carreraService } from './carrera.service';
import { SqlService } from '../cnxjs/sql.service';

@Module({
  controllers: [carreraController],
  providers: [carreraService, SqlService]
})
export class carreraModule {}
