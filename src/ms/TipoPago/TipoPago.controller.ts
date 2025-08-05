import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { TipoPagoService } from './TipoPago.service';
import { CreateTipoPagoDto } from './dto/create-TipoPago.dto';

@Controller('tipopago')
export class TipoPagoController {
  constructor(private readonly tipopagoService: TipoPagoService) {}

  @Post('/add')
  create(@Body() dto: CreateTipoPagoDto) {
    return this.tipopagoService.create(dto);
  }

  @Get()
  findAll() {
    return this.tipopagoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipopagoService.findOne(Number(id));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipopagoService.remove(Number(id));
  }
}
