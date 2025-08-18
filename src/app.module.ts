import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { EstudianteModule } from './ms/estudiante/estudiante.module';
import {AreaConocimientoModule} from './ms/AreaConocimiento/AreaConocimiento.module';
import {carreraModule} from './ms/Carrera/carrera.module'
import {RequisitoModule} from './ms/Requisito/Requisito.module'
import {TipoBecaModule} from './ms/TipoBeca/TipoBeca.module'
import {PeriodoAcademicoModule} from './ms/PeriodicoAcademico/PeriodoAcademico.module'
import {SolicitudBecaModule} from './ms/SolicitudBeca/SolicitudBeca.module'
import {EstadoModule} from './ms/Estado/Estado.module'
import {Detalle_requisitos_becaModule} from './ms/Detalle_requisitos-beca/Detalle_requisitos_beca.module'
import {UsuarioModule} from './ms/Usuario/usuario.module'
import {TipoPagoModule} from './ms/TipoPago/TipoPago.module'
import {DetallePagoModule} from './ms/DetallePago/DetallePago.module'
import {reporteModule} from './ms/Reporte/reporte.module'

@Module({
  imports: [EstudianteModule,AreaConocimientoModule,carreraModule,RequisitoModule,TipoBecaModule,PeriodoAcademicoModule,SolicitudBecaModule,EstadoModule,Detalle_requisitos_becaModule,UsuarioModule,TipoPagoModule,DetallePagoModule,AuthModule,reporteModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}