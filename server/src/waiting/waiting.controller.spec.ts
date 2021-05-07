import { Test, TestingModule } from '@nestjs/testing';
import { WaitingController } from './waiting.controller';

describe('WaitingController', () => {
  let controller: WaitingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WaitingController],
    }).compile();

    controller = module.get<WaitingController>(WaitingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
