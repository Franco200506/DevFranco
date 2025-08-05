import { Test, TestingModule } from '@nestjs/testing';
import { DetallePagoController } from './DetallePago.controller';

describe('DetallePagoController', () => {
  let controller: DetallePagoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DetallePagoController],
    }).compile();

    controller = module.get<DetallePagoController>(DetallePagoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
