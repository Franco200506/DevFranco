import { Test, TestingModule } from '@nestjs/testing';
import { carreraController } from './carrera.controller';

describe('carreraController', () => {
  let controller: carreraController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [carreraController],
    }).compile();

    controller = module.get<carreraController>(carreraController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
