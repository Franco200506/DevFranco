import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { RequisitoService } from './Requisito.service';
import { CreateRequisitoDto } from './dto/create-Requisito.dto';

@Controller('Requisito')
export class RequisitoController {
  constructor(private readonly RequisitoService: RequisitoService) {}

  @Post('/add')
  create(@Body() dto: CreateRequisitoDto) {
    return this.RequisitoService.create(dto);
  }

  @Get()
  findAll() {
    return this.RequisitoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.RequisitoService.findOne(Number(id));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.RequisitoService.remove(Number(id));
  }
}
