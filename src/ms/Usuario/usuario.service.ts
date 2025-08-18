import { Injectable } from '@nestjs/common';
import { SqlService } from '../../ms/cnxjs/sql.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(private readonly sqlService: SqlService) {}

  async create(obj: CreateUsuarioDto) {
    try {
      const pool = await this.sqlService.getConnection();
      const request = pool.request();

      const id = obj.Id ?? 0;
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(obj.Contrasena, saltRounds);

      request.input('Id', id);
      request.input('Nombre', obj.Nombre);
      request.input('Contrasena', hashedPassword); // The hashed password is used here
      request.input('Apellidos', obj.Apellidos || '');
      request.input('Email', obj.Email || '');
      request.input('Role', obj.Role || 'user');

      const result: any = await request.execute('Beca.sp_Save_Usuario');

      console.log('Resultado del SP:', result);

      if (result.recordset && result.recordset.length > 0) {
        const resp = result.recordset[0].NewId || result.recordset[0].UpdatedId || result.recordset[0].Id;
        return { id: resp };
      } else {
        return { id };
      }
    } catch (e) {
      console.error('Error al ejecutar el SP:', JSON.stringify(e, null, 2));
      return { error: 'Error interno', detalle: e.message ?? e };
    }
  }

  async findAll() {
    try {
      const pool = await this.sqlService.getConnection();
      const request = pool.request();

      request.input('Id', 0);
      const result: any = await request.execute('Beca.sp_Get_Usuario');

      return result.recordset;
    } catch (e) {
      console.error('Error al obtener el Usuario', JSON.stringify(e, null, 2));
      return { error: 'Error al obtener el Usuario', detalle: e.message ?? e };
    }
  }

  async findOne(id: number) {
    try {
      const pool = await this.sqlService.getConnection();
      const request = pool.request();

      request.input('Id', id);
      const result: any = await request.execute('Beca.sp_Get_Usuario');

      if (result.recordset.length === 0) {
        return { mensaje: `Usuario con ID ${id} no encontrado` };
      }

      return result.recordset[0];
    } catch (e) {
      console.error('Error al buscar el Usuario por ID:', JSON.stringify(e, null, 2));
      return { error: 'Error al buscar el Usuario', detalle: e.message ?? e };
    }
  }

  async remove(id: number) {
    try {
      const pool = await this.sqlService.getConnection();
      const request = pool.request();

      request.input('Id', id);
      await request.execute('Beca.sp_Delete_Usuario');

      return { mensaje: `Usuario con ID ${id} eliminado correctamente` };
    } catch (e) {
      console.error('Error al eliminar el Usuario:', JSON.stringify(e, null, 2));
      return { error: 'Error al eliminar el Usuario', detalle: e.message ?? e };
    }
  }
}