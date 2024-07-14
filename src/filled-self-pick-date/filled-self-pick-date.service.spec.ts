import { Test, TestingModule } from '@nestjs/testing';
import { FilledSelfPickDateService } from './filled-self-pick-date.service';

describe('FilledSelfPickDateService', () => {
  let service: FilledSelfPickDateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilledSelfPickDateService],
    }).compile();

    service = module.get<FilledSelfPickDateService>(FilledSelfPickDateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
