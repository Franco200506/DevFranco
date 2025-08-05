import { Test, TestingModule } from '@nestjs/testing';
import { DetallePagoService } from './DetallePago.service';

describe('DetallePagoService', () => {
  let service: DetallePagoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetallePagoService],
    }).compile();

    service = module.get<DetallePagoService>(DetallePagoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
