import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { SolicitudBecaService } from './SolicitudBeca.service';
import { CreateSolicitudBecaDto } from './dto/create-SolicitudBeca.dto';

@Controller('SolicitudBeca')
export class SolicitudBecaController {
  constructor(private readonly SolicitudBecaService: SolicitudBecaService) {}

  @Post('/add')
  create(@Body() dto: CreateSolicitudBecaDto) {
    return this.SolicitudBecaService.create(dto);
  }

  @Get()
  findAll() {
    return this.SolicitudBecaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.SolicitudBecaService.findOne(Number(id));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.SolicitudBecaService.remove(Number(id));
  }
}
