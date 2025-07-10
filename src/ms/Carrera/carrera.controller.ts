import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { carreraService } from './carrera.service';
import { CreatecarreraDto } from './dto/create-carrera.dto';

@Controller('carrera')
export class carreraController {
  constructor(private readonly carreraService: carreraService) {}

  @Post('/add')
  create(@Body() dto: CreatecarreraDto) {
    return this.carreraService.create(dto);
  }

  @Get()
  findAll() {
    return this.carreraService.findAll();
  }

 @Get(':id')
findOne(@Param('id') id: string) {
  const idNum = Number(id);
  
  return this.carreraService.findOne(idNum);
}


  @Delete(':id')
  Remove(@Param('id') id: string) {
    return this.carreraService.remove(Number(id));
  }
}

