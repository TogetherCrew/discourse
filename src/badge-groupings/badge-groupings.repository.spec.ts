import { Test, TestingModule } from '@nestjs/testing';
import { BadgeGroupingsRepository } from './badge-groupings.repository';
import { Neo4jService } from 'nest-neo4j';
import { LoadBadgeGroupingDto } from './dto/load-badge-grouping.dto';

jest.mock('nest-neo4j');

describe('BadgeGroupingsRepository', () => {
  let repository: BadgeGroupingsRepository;
  let neo4jService: jest.Mocked<Neo4jService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BadgeGroupingsRepository, Neo4jService],
    }).compile();

    repository = module.get<BadgeGroupingsRepository>(BadgeGroupingsRepository);
    neo4jService = module.get(Neo4jService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('insertMany', () => {
    it('should execute the Neo4j write command with expected cypher query and params', async () => {
      const mockBadgeGroupings = [
        { name: 'test-badge-1', forumUUID: 'uuid-1' },
        { name: 'test-badge-2', forumUUID: 'uuid-2' },
      ] as LoadBadgeGroupingDto[];

      await repository.insertMany(mockBadgeGroupings);

      const cypher = [
        'UNWIND $badgeGroupings AS badgeGrouping',
        'MERGE (f:Forum {uuid: badgeGrouping.forumUUID})',
        'CREATE (b:BadgeGrouping) SET b = badgeGrouping',
        // 'MERGE (f)-[:HAS_BADGE_GROUPING]->(b)',
      ].join(' ');

      expect(neo4jService.write).toHaveBeenCalledWith(cypher, {
        badgeGroupings: mockBadgeGroupings,
      });
    });
  });
});
