import { Module } from '@nestjs/common';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';
import { SqlService } from '../cnxjs/sql.service';

@Module({
  controllers: [UsuarioController],
  providers: [UsuarioService, SqlService],
  exports: [UsuarioService]
})
export class UsuarioModule {}
