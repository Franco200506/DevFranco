import { Test, TestingModule } from '@nestjs/testing';
import { SolicitudBecaController } from './SolicitudBeca.controller';

describe('SolicitudBecaController', () => {
  let controller: SolicitudBecaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SolicitudBecaController],
    }).compile();

    controller = module.get<SolicitudBecaController>(SolicitudBecaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
