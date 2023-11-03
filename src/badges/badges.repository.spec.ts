import { Test, TestingModule } from '@nestjs/testing';
import { BadgesRepository } from './badges.repository';
import { Neo4jService } from 'nest-neo4j';
import { LoadBadgeDto } from './dto/load-badges.dto';

jest.mock('nest-neo4j');

describe('BadgesRepository', () => {
  let repository: BadgesRepository;
  let neo4jService: jest.Mocked<Neo4jService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BadgesRepository, Neo4jService],
    }).compile();

    repository = module.get<BadgesRepository>(BadgesRepository);
    neo4jService = module.get(Neo4jService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('insertMany', () => {
    it('should execute the Neo4j write command with expected cypher query and params', async () => {
      const mockBadges = [
        { name: 'test-badge-1', forumUUID: 'uuid-1' },
        { name: 'test-badge-2', forumUUID: 'uuid-2' },
      ] as LoadBadgeDto[];

      await repository.insertMany(mockBadges);

      const cypher = [
        'UNWIND $badges AS badge',
        'MERGE (f:Forum {uuid: badge.forumUUID})',
        'CREATE (b:Badge) SET b = badge',
        'MERGE (f)-[:HAS_BADGE]->(b)',
      ].join(' ');

      expect(neo4jService.write).toHaveBeenCalledWith(cypher, {
        badges: mockBadges,
      });
    });
  });
});
