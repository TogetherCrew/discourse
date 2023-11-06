import { Test, TestingModule } from '@nestjs/testing';
import { ForumsService } from './forums.service';
import { CreateForumDto } from './dto/create-forum.dto';
import { ForumsRepository } from './forums.repository';
import { OrchestrationService } from '../orchestration/orchestration.service';

describe('ForumsService', () => {
  let service: ForumsService;
  const mockForumsRepository = {
    insertOne: jest.fn(),
  };
  const mockOrchestrationService = {
    run: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ForumsService,
        { provide: ForumsRepository, useValue: mockForumsRepository },
        { provide: OrchestrationService, useValue: mockOrchestrationService },
      ],
    }).compile();

    service = module.get<ForumsService>(ForumsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should return the data that was generated from repository', async () => {
      const createForumDto: CreateForumDto = { endpoint: 'some-endpoint' };
      mockForumsRepository.insertOne.mockResolvedValueOnce({
        ...createForumDto,
        uuid: 'some-uuid',
      });

      const result = await service.create(createForumDto);
      expect(mockForumsRepository.insertOne).toHaveBeenCalledWith(
        createForumDto,
      );
      expect(result).toEqual({ endpoint: 'some-endpoint', uuid: 'some-uuid' });
    });
  });
});
