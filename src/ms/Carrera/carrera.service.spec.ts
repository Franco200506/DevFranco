import { Test, TestingModule } from '@nestjs/testing';
import { carreraService } from './carrera.service';

describe('carreraService', () => {
  let service: carreraService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [carreraService],
    }).compile();

    service = module.get<carreraService>(carreraService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
