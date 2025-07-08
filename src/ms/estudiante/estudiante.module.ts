import { Module } from '@nestjs/common';
import { EstudianteController } from './estudiante.controller';
import { EstudianteService } from './estudiante.service';
import { SqlService } from '../cnxjs/sql.service';

@Module({
  controllers: [EstudianteController],
  providers: [EstudianteService, SqlService]
})
export class EstudianteModule {}
