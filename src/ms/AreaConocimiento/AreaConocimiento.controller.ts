import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { AreaConocimientoService } from './AreaConocimiento.service';
import { CreateAreaConocimientoDto } from './dto/create-AreaConocimiento.dto';

@Controller('AreaConocimiento')
export class AreaConocimientoController {
  constructor(private readonly AreaConocimientoService: AreaConocimientoService) {}

  @Post('/add')
  create(@Body() dto: CreateAreaConocimientoDto) {
    return this.AreaConocimientoService.create(dto);
  }

  @Get()
  findAll() {
    return this.AreaConocimientoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.AreaConocimientoService.findOne(Number(id));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.AreaConocimientoService.remove(Number(id));
  }
}
