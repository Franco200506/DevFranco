import { Test, TestingModule } from '@nestjs/testing';
import { TipoPagoController } from './TipoPago.controller';

describe('TipoPagoController', () => {
  let controller: TipoPagoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TipoPagoController],
    }).compile();

    controller = module.get<TipoPagoController>(TipoPagoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
