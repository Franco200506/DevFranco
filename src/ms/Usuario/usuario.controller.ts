import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Controller('Usuario')
export class UsuarioController {
  constructor(private readonly UsuarioService: UsuarioService) {}

  @Post('/add')
  create(@Body() dto: CreateUsuarioDto) {
    return this.UsuarioService.create(dto);
  }

  @Get()
  findAll() {
    return this.UsuarioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.UsuarioService.findOne(Number(id));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.UsuarioService.remove(Number(id));
  }
}
