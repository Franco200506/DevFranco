import { Injectable } from '@nestjs/common';
import * as sql from 'mssql';

@Injectable()
export class SqlService {
  private pool: sql.ConnectionPool;

  private readonly config: sql.config = {
    user: 'sa',
    password: '2005',
    server: 'JEANFRANCO\\JEANFRANCO', // Tu instancia nombrada
    database: 'DbBecas',
    options: {
      encrypt: true,               // <--- CAMBIAR A TRUE
      trustServerCertificate: true, // Mantener en true para certificados no confiables/autofirmados
      // Puedes añadir el puerto si tu instancia nombrada usa uno no estándar o si el SQL Browser no resuelve bien
      // port: 1433, // El puerto predeterminado para SQL Server
    },
  };

  async getConnection(): Promise<sql.ConnectionPool> {
    if (!this.pool || !this.pool.connected) { // Añadir !this.pool.connected para reconexión si se pierde
      try {
        this.pool = await sql.connect(this.config);
        console.log('Conectado a la base de datos SQL Server.');
      } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        throw error; // Relanzar el error para que NestJS lo maneje
      }
    }
    return this.pool;
  }

  // Opcional: Método para cerrar la conexión cuando la aplicación se apaga
  async closeConnection() {
    if (this.pool && this.pool.connected) {
      try {
        await this.pool.close();
        console.log('Conexión a la base de datos SQL Server cerrada.');
      } catch (error) {
        console.error('Error al cerrar la conexión de la base de datos:', error);
      }
    }
  }
}