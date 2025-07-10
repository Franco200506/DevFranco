import { Module } from '@nestjs/common';
import {RequisitoController } from './Requisito.controller';
import { RequisitoService } from './Requisito.service';
import { SqlService } from '../cnxjs/sql.service';

@Module({
  controllers: [RequisitoController],
  providers: [RequisitoService, SqlService]
})
export class RequisitoModule {}
