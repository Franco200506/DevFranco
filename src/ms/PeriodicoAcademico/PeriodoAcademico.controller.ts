import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { PeriodoAcademicoService } from './PeriodoAcademico.service';
import { CreatePeriodoAcademicoDto } from './dto/create-PeriodoAcademico.dto';

@Controller('PeriodoAcademico')
export class PeriodoAcademicoController {
  constructor(private readonly PeriodoAcademicoService: PeriodoAcademicoService) {}

  @Post('/add')
  create(@Body() dto: CreatePeriodoAcademicoDto) {
    return this.PeriodoAcademicoService.create(dto);
  }

  @Get()
  findAll() {
    return this.PeriodoAcademicoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.PeriodoAcademicoService.findOne(Number(id));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.PeriodoAcademicoService.remove(Number(id));
  }
}
