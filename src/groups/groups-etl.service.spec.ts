// groups-etl.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { Job } from 'bullmq';
import { EtlDto } from '../base-etl/dto/etl.dto';
import { DiscourseService } from '@app/discourse';
import { GroupsEtlService } from './groups-etl.service';
import { Neo4jService } from 'nest-neo4j/dist';
import { BaseTransformerService } from '../base-transformer/base-transformer.service';
import { BaseEtlService } from '../base-etl/base-etl.service';

describe('GroupsEtlService', () => {
  let service: GroupsEtlService;
  let mockDiscourseService: any;
  let mockBaseTransformerService: any;
  let mockNeo4jService: any;

  beforeEach(async () => {
    mockDiscourseService = {
      getGroups: jest.fn(),
    };

    mockBaseTransformerService = {};
    mockNeo4jService = {};

    const module: TestingModule = await Test.createTestingModule({
      // imports: [BaseEtlModule],
      providers: [
        BaseEtlService,
        GroupsEtlService,
        {
          provide: DiscourseService,
          useValue: mockDiscourseService,
        },
        {
          provide: BaseTransformerService,
          useValue: mockBaseTransformerService,
        },
        {
          provide: Neo4jService,
          useValue: mockNeo4jService,
        },
      ],
    }).compile();

    service = module.get<GroupsEtlService>(GroupsEtlService);
  });

  describe('extract', () => {
    it('should extract all groups from the given forum', async () => {
      // Arrange
      const etlDto: EtlDto = {
        forum: {
          endpoint: 'some-endpoint',
          uuid: 'test-uuid',
        },
        cypher: '',
      };
      const job: Job<EtlDto> = { data: etlDto } as Job<EtlDto>;
      const groups: Partial<Group>[] = [{ id: 1, name: 'Test Group' }];

      // Assume the total_rows_groups is 1 for simplicity
      mockDiscourseService.getGroups.mockResolvedValue({
        data: { groups, total_rows_groups: 1 },
      });

      // Act
      const result = await service.extract(job);

      // Assert
      expect(mockDiscourseService.getGroups).toHaveBeenCalledWith(
        'some-endpoint',
        0,
      );
      expect(result).toEqual(groups);
    });
    it('should concatenate group data across multiple pages', async () => {
      const etlDto: EtlDto = {
        forum: {
          endpoint: 'group-endpoint',
          uuid: 'test-uuid',
        },
        cypher: '',
      };
      const job: Job<EtlDto> = { data: etlDto } as unknown as Job<EtlDto>;

      const groupsPage1: Partial<Group>[] = [{ id: 1, name: 'Group 1' }];
      const groupsPage2: Partial<Group>[] = [{ id: 2, name: 'Group 2' }];
      const groupsPage3: Partial<Group>[] = [{ id: 3, name: 'Group 3' }];

      mockDiscourseService.getGroups.mockImplementation(
        async (endpoint, page) => {
          if (page === 0) {
            return { data: { groups: groupsPage1, total_rows_groups: 3 } }; // Indicate more groups are present
          } else if (page === 1) {
            return { data: { groups: groupsPage2, total_rows_groups: 3 } }; // Last page
          } else {
            return { data: { groups: groupsPage3, total_rows_groups: 3 } }; // No more groups
          }
        },
      );

      const result = await service.extract(job);

      expect(mockDiscourseService.getGroups).toHaveBeenCalledTimes(3);
      expect(mockDiscourseService.getGroups).toHaveBeenCalledWith(
        'group-endpoint',
        0,
      );
      expect(mockDiscourseService.getGroups).toHaveBeenCalledWith(
        'group-endpoint',
        1,
      );
      expect(mockDiscourseService.getGroups).toHaveBeenCalledWith(
        'group-endpoint',
        2,
      );
      expect(result.length).toBe(3); // total_rows_groups is 3, so we expect an array of 3 groups
      expect(result).toEqual([...groupsPage1, ...groupsPage2, ...groupsPage3]); // Expect the concatenated result
    });
  });
});
