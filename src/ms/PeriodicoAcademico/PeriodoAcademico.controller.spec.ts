import { Test, TestingModule } from '@nestjs/testing';
import { PeriodoAcademicoController } from './PeriodoAcademico.controller';

describe('PeriodoAcademicoController', () => {
  let controller: PeriodoAcademicoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PeriodoAcademicoController],
    }).compile();

    controller = module.get<PeriodoAcademicoController>(PeriodoAcademicoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
