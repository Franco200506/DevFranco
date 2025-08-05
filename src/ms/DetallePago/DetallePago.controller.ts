import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { DetallePagoService } from './DetallePago.service';
import { CreateDetallePagoDto } from './dto/create-DetallePago.dto';

@Controller('DetallePago')
export class DetallePagoController {
  constructor(private readonly DetallePagoService: DetallePagoService) {}

  @Post('/add')
  create(@Body() dto: CreateDetallePagoDto) {
    return this.DetallePagoService.create(dto);
  }

  @Get()
  findAll() {
    return this.DetallePagoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.DetallePagoService.findOne(Number(id));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.DetallePagoService.remove(Number(id));
  }
}
