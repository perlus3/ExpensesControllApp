import { Test, TestingModule } from '@nestjs/testing';
import { ExpencesController } from './expences.controller';

describe('ExpencesController', () => {
  let controller: ExpencesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpencesController],
    }).compile();

    controller = module.get<ExpencesController>(ExpencesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
