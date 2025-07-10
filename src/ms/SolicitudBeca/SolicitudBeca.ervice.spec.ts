import { Test, TestingModule } from '@nestjs/testing';
import { SolicitudBecaService } from './SolicitudBeca.service';

describe('SolicitudBecaService', () => {
  let service: SolicitudBecaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SolicitudBecaService],
    }).compile();

    service = module.get<SolicitudBecaService>(SolicitudBecaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
