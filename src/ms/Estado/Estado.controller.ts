import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { EstadoService } from './Estado.service';
import { CreateEstadoDto } from './dto/create-Estado.dto';

@Controller('Estado')
export class EstadoController {
  constructor(private readonly EstadoService: EstadoService) {}

  @Post('/add')
  create(@Body() dto: CreateEstadoDto) {
    return this.EstadoService.create(dto);
  }

  @Get()
  findAll() {
    return this.EstadoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.EstadoService.findOne(Number(id));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.EstadoService.remove(Number(id));
  }
}
