import { Test, TestingModule } from '@nestjs/testing';
import { AreaConocimientoController } from './AreaConocimiento.controller';

describe('AreaConocimientoController', () => {
  let controller: AreaConocimientoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AreaConocimientoController],
    }).compile();

    controller = module.get<AreaConocimientoController>(AreaConocimientoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
