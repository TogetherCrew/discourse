import { Test, TestingModule } from '@nestjs/testing';
import { BadgeTypesRepository } from './badge-types.repository';
import { Neo4jService } from 'nest-neo4j';
import { LoadBadgeTypeDto } from '../badges/dto/load-badges.dto';

jest.mock('nest-neo4j');

describe('BadgeTypesRepository', () => {
  let repository: BadgeTypesRepository;
  let neo4jService: jest.Mocked<Neo4jService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BadgeTypesRepository, Neo4jService],
    }).compile();

    repository = module.get<BadgeTypesRepository>(BadgeTypesRepository);
    neo4jService = module.get(Neo4jService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('insertMany', () => {
    it('should execute the Neo4j write command with expected cypher query and params', async () => {
      const mockBadgeTypes = [
        { name: 'test-badge-1', forumUUID: 'uuid-1' },
        { name: 'test-badge-2', forumUUID: 'uuid-2' },
      ] as LoadBadgeTypeDto[];

      await repository.insertMany(mockBadgeTypes);

      const cypher = [
        'UNWIND $badgeTypes AS badgeType',
        'MERGE (f:Forum {uuid: badgeType.forumUUID})',
        'CREATE (b:BadgeType) SET b = badgeType',
        // 'MERGE (f)-[:HAS_BADGE_TYPE]->(b)',
      ].join(' ');

      expect(neo4jService.write).toHaveBeenCalledWith(cypher, {
        badgeTypes: mockBadgeTypes,
      });
    });
  });
});
