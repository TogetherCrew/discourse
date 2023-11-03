import { Test } from '@nestjs/testing';
import { TransformersService } from './transformers.service';

describe('TransformersService', () => {
  let service: TransformersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [TransformersService],
    }).compile();

    service = module.get<TransformersService>(TransformersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('transform', () => {
    it('should add a UUID and camelize the object keys', () => {
      const obj = {
        id_number: 1,
        user_name: 'jdoe',
      };
      const merge = { forumUUID: '1234-uuid' };

      const result = service.transform(obj, merge);
      expect(result).toEqual({
        idNumber: 1,
        userName: 'jdoe',
        forumUUID: merge.forumUUID,
      });
    });
  });

  // While we do not typically test private methods, if you want to ensure they work as expected, you can use any to access them for testing
  describe('merge', () => {
    it('should merge the objects', () => {
      const obj = { name: 'test' };
      const merge = { forumUUID: '1234-uuid' };
      const result = (service as any).merge(obj, merge);
      expect(result).toHaveProperty('forumUUID', merge.forumUUID);
    });
  });

  describe('toCamelCase', () => {
    it('should convert snake_case and kebab-case to camelCase', () => {
      const snakeCase = 'snake_case_string';
      const kebabCase = 'kebab-case-string';
      expect((service as any).toCamelCase(snakeCase)).toBe('snakeCaseString');
      expect((service as any).toCamelCase(kebabCase)).toBe('kebabCaseString');
    });
  });

  describe('camelize', () => {
    it('should camelize all object keys', () => {
      const obj = {
        first_name: 'John',
        last_name: 'Doe',
        address: {
          home_town: 'Sampleville',
        },
        hobbies: ['table_tennis', 'mini-golf'],
      };
      const result = (service as any).camelize(obj);
      expect(result).toEqual({
        firstName: 'John',
        lastName: 'Doe',
        address: {
          homeTown: 'Sampleville',
        },
        hobbies: ['table_tennis', 'mini-golf'],
      });
    });

    it('should camelize keys in an array of objects', () => {
      const arr = [{ first_name: 'John' }, { last_name: 'Doe' }];
      const result = (service as any).camelize(arr);
      expect(result).toEqual([{ firstName: 'John' }, { lastName: 'Doe' }]);
    });
  });
});
