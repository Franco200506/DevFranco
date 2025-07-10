import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { TipoBecaService } from './TipoBeca.service';
import { CreateTipoBecaDto } from './dto/create-TipoBeca.dto';

@Controller('TipoBeca')
export class TipoBecaController {
  constructor(private readonly TipoBecaService: TipoBecaService) {}

  @Post('/add')
  create(@Body() dto: CreateTipoBecaDto) {
    return this.TipoBecaService.create(dto);
  }

  @Get()
  findAll() {
    return this.TipoBecaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.TipoBecaService.findOne(Number(id));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.TipoBecaService.remove(Number(id));
  }
}
