import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { Detalle_requisitos_becaService } from './Detalle_requisitos_beca.service';
import { CreateDetalle_requisitos_becaDto } from './dto/create-Detalle-requisitos_beca.dto';

@Controller('Detalle_requisitos_becas')
export class Detalle_requisitos_becaController {
  constructor(private readonly Detalle_requisitos_becaService: Detalle_requisitos_becaService) {}

  @Post('/add')
  create(@Body() dto: CreateDetalle_requisitos_becaDto) {
    return this.Detalle_requisitos_becaService.create(dto);
  }

  @Get()
  findAll() {
    return this.Detalle_requisitos_becaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.Detalle_requisitos_becaService.findOne(Number(id));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.Detalle_requisitos_becaService.remove(Number(id));
  }
}
