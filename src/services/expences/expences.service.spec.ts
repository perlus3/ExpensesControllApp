import { Test, TestingModule } from '@nestjs/testing';
import { ExpencesService } from './expences.service';

describe('ExpencesService', () => {
  let service: ExpencesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExpencesService],
    }).compile();

    service = module.get<ExpencesService>(ExpencesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
