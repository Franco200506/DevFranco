import { Test, TestingModule } from '@nestjs/testing';
import { RequisitoController } from './Requisito.controller';

describe('RequisitoController', () => {
  let controller: RequisitoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequisitoController],
    }).compile();

    controller = module.get<RequisitoController>(RequisitoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
