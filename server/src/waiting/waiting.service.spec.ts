import { Test, TestingModule } from '@nestjs/testing';
import { WaitingService } from './waiting.service';

describe('WaitingService', () => {
  let service: WaitingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WaitingService],
    }).compile();

    service = module.get<WaitingService>(WaitingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
