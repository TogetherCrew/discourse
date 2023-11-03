import { Test, TestingModule } from '@nestjs/testing';
import { ForumsController } from './forums.controller';
import { ForumsService } from './forums.service';
import { CreateForumDto } from './dto/create-forum.dto';

describe('ForumsController', () => {
  let controller: ForumsController;
  const mockForumsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ForumsController],
      providers: [{ provide: ForumsService, useValue: mockForumsService }],
    }).compile();

    controller = module.get<ForumsController>(ForumsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a forum', async () => {
      const dto: CreateForumDto = { endpoint: 'test-endpoint' };
      mockForumsService.create.mockResolvedValueOnce('some-forum');

      const result = await controller.create(dto);

      expect(result).toBe('some-forum');
      expect(mockForumsService.create).toHaveBeenCalledWith(dto);
    });
  });
});
