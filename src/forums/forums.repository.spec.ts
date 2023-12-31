import { Test, TestingModule } from '@nestjs/testing';
import { CreateForumDto } from './dto/create-forum.dto';
import { ForumsRepository } from './forums.repository';
import { Neo4jService } from 'nest-neo4j/dist';
import { UpdateForumDto } from './dto/update-forum.dto';

describe('ForumsRepository', () => {
  let repository: ForumsRepository;
  const mockNeo4jService = {
    write: jest.fn(),
    read: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ForumsRepository,
        { provide: Neo4jService, useValue: mockNeo4jService },
      ],
    }).compile();

    repository = module.get<ForumsRepository>(ForumsRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('insertOne', () => {
    it('should successfully create a forum and return its properties', async () => {
      const dto: CreateForumDto = { endpoint: 'some-endpoint' };

      const mockResponse = {
        records: [
          {
            get: jest.fn().mockReturnValue({
              properties: { uuid: 'some-uuid', endpoint: 'some-endpoint' },
            }),
          },
        ],
      };

      mockNeo4jService.write.mockResolvedValueOnce(mockResponse);

      const result = await repository.insertOne(dto);
      expect(result).toEqual({ uuid: 'some-uuid', endpoint: 'some-endpoint' });
    });

    it('should throw an error if no record is returned from the database', async () => {
      const dto: CreateForumDto = { endpoint: 'some-endpoint' };

      const mockResponse = {
        records: [],
      };

      mockNeo4jService.write.mockResolvedValueOnce(mockResponse);

      await expect(repository.insertOne(dto)).rejects.toThrow(
        'Failed to create the forum: No record returned from the database',
      );
    });

    it('should throw an error if there is an exception during creation', async () => {
      const dto: CreateForumDto = { endpoint: 'some-endpoint' };

      mockNeo4jService.write.mockRejectedValueOnce(
        new Error('Database connection error'),
      );

      await expect(repository.insertOne(dto)).rejects.toThrow(
        'Database connection error',
      );
    });
  });

  describe('updateOne', () => {
    it('should successfully update a forum and return its properties', async () => {
      const uuid = 'some-uuid';
      const dto: UpdateForumDto = { endpoint: 'some-endpoint' };

      const mockResponse = {
        records: [
          {
            get: jest.fn().mockReturnValue({
              properties: { uuid: 'some-uuid', endpoint: 'some-endpoint' },
            }),
          },
        ],
      };

      mockNeo4jService.write.mockResolvedValueOnce(mockResponse);

      const result = await repository.updateOne(uuid, dto);
      expect(result).toEqual({ uuid: 'some-uuid', endpoint: 'some-endpoint' });
    });

    it('should throw an error if no record is returned from the database', async () => {
      const uuid = 'some-uuid';
      const dto: UpdateForumDto = { endpoint: 'some-endpoint' };

      const mockResponse = {
        records: [],
      };

      mockNeo4jService.write.mockResolvedValueOnce(mockResponse);

      await expect(repository.updateOne(uuid, dto)).rejects.toThrow(
        'Failed to update the forum: No record returned from the database',
      );
    });

    it('should throw an error if there is an exception during update', async () => {
      const uuid = 'some-uuid';
      const dto: UpdateForumDto = { endpoint: 'some-endpoint' };

      mockNeo4jService.write.mockRejectedValueOnce(
        new Error('Database connection error'),
      );

      await expect(repository.updateOne(uuid, dto)).rejects.toThrow(
        'Database connection error',
      );
    });
  });
});
