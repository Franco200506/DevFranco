import { Test, TestingModule } from '@nestjs/testing';
import { Detalles_requisitos_becaService } from './Detalles_requisitos_beca.service';

describe('Detalles_requisitos_becaService', () => {
  let service: Detalles_requisitos_becaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Detalles_requisitos_becaService],
    }).compile();

    service = module.get<Detalles_requisitos_becaService>(Detalles_requisitos_becaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
