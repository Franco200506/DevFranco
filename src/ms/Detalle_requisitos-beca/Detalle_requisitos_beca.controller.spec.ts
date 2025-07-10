import { Test, TestingModule } from '@nestjs/testing';
import { Detalle_requisitos_becaController } from './Detalle_requisitos_beca.controller';

describe('Detalle_requisitos_becaController', () => {
  let controller: Detalle_requisitos_becaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Detalle_requisitos_becaController],
    }).compile();

    controller = module.get<Detalle_requisitos_becaController>(Detalle_requisitos_becaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
