import { Test, TestingModule } from '@nestjs/testing';
import { TipoBecaController } from './TipoBeca.controller';

describe('TipoBecaController', () => {
  let controller: TipoBecaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TipoBecaController],
    }).compile();

    controller = module.get<TipoBecaController>(TipoBecaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
