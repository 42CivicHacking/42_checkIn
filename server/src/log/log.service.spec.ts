import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Log } from './entities/log.entity';
import { LogService } from './log.service';

const mockRepository = {
  find: jest.fn(),
};

describe('LogService', () => {
  let service: LogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogService,
        {
          provide: getRepositoryToken(Log),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<LogService>(LogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('getUserLog', () => {
    it('should return a log', async () => {
      const log = await service.getUserLog('ryukim');
      expect(log).toBeInstanceOf(Log);
    });
  });
});
