import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { ReporteService } from './reporte.service';
import { CreatereporteDto } from './dto/create-reporte.dto';

@Controller('reportes')
export class ReportesController {
  constructor(private readonly ReportesService: ReporteService) {}

  @Get('totales')
  getTotales() {
    return this.ReportesService.getTotales();
  }

  @Get('solicitudes')
  getSolicitudes() {
    return this.ReportesService.getSolicitudesPorEstado();
  }
}

