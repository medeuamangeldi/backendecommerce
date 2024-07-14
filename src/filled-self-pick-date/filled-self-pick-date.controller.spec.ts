import { Test, TestingModule } from '@nestjs/testing';
import { FilledSelfPickDateController } from './filled-self-pick-date.controller';

describe('FilledSelfPickDateController', () => {
  let controller: FilledSelfPickDateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilledSelfPickDateController],
    }).compile();

    controller = module.get<FilledSelfPickDateController>(FilledSelfPickDateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
