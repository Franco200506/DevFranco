import { Module } from '@nestjs/common';
import {PeriodoAcademicoController } from './PeriodoAcademico.controller';
import { PeriodoAcademicoService } from './PeriodoAcademico.service';
import { SqlService } from '../cnxjs/sql.service';

@Module({
  controllers: [PeriodoAcademicoController],
  providers: [PeriodoAcademicoService, SqlService]
})
export class PeriodoAcademicoModule {}
