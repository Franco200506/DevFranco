import { Test, TestingModule } from '@nestjs/testing';
import { TipoBecaService } from './TipoBeca.service';

describe('TipoBecaService', () => {
  let service: TipoBecaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipoBecaService],
    }).compile();

    service = module.get<TipoBecaService>(TipoBecaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
