import { Test, TestingModule } from '@nestjs/testing';
import { PeriodoAcademicoService } from './PeriodoAcademico.service';

describe('PeriodoAcademicoService', () => {
  let service: PeriodoAcademicoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PeriodoAcademicoService],
    }).compile();

    service = module.get<PeriodoAcademicoService>(PeriodoAcademicoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
