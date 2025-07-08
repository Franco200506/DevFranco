import { Injectable } from '@nestjs/common';
import * as sql from 'mssql';

@Injectable()
export class SqlService {
  private pool: sql.ConnectionPool;

private readonly config: sql.config = {
  user: 'sa',
  password: '2005',
  server: 'JEANFRANCO\\JEANFRANCO',
  database: 'DbBecas',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};


  async getConnection(): Promise<sql.ConnectionPool> {
    if (!this.pool) {
      this.pool = await sql.connect(this.config);
    }
    return this.pool;
  }
}