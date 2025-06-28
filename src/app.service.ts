import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Ejecutando la primera ruta tipo Get de la API Beca...!';
  }
}
