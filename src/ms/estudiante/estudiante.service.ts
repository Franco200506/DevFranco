import { Injectable } from '@nestjs/common';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';

@Injectable()
export class EstudianteService {
  private estudiantes: any[] = [];

  create(dto: CreateEstudianteDto) {
    const nuevo = { id: Date.now(), ...dto };
    this.estudiantes.push(nuevo);
    return nuevo;
  }

  findAll() {
    return this.estudiantes;
  }

  findOne(id: number) {
    return this.estudiantes.find(e => e.id === id);
  }
}