import { BaseTransformerService } from './base-transformer.service';

describe('BaseTransformerService', () => {
  let service: BaseTransformerService;

  beforeEach(() => {
    service = new BaseTransformerService();
  });

  it('should camelize and merge objects correctly', () => {
    const snakeCaseObject = {
      first_name: 'John',
      last_name: 'Doe',
    };

    const toMergeObject = {
      'phone-number': '1234567890',
      address_line_1: '123 Main St',
    };

    const expectedResult = {
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '1234567890',
      addressLine1: '123 Main St',
    };

    expect(service.transform(snakeCaseObject, toMergeObject)).toEqual(
      expectedResult,
    );
  });

  it('should handle arrays of objects', () => {
    const arrayOfObjects = [{ first_name: 'John' }, { last_name: 'Doe' }];
    const toMergeObject = { 'age-number': 30 };

    const expectedResult = [
      { firstName: 'John', ageNumber: 30 },
      { lastName: 'Doe', ageNumber: 30 },
    ];

    expect(service.transform(arrayOfObjects, toMergeObject)).toEqual(
      expectedResult,
    );
  });

  it('should handle nested objects', () => {
    const nestedObject = {
      'user-data': {
        first_name: 'John',
        last_name: 'Doe',
      },
    };

    const expectedResult = {
      userData: {
        firstName: 'John',
        lastName: 'Doe',
      },
    };

    expect(service.transform(nestedObject)).toEqual(expectedResult);
  });

  it('should return the object as is if there is nothing to camelize', () => {
    const simpleObject = { name: 'John' };

    expect(service.transform(simpleObject)).toEqual(simpleObject);
  });

  it('should only merge toMerge object and not alter the original object keys if they are already camelCased', () => {
    const originalObject = { firstName: 'Jane', lastName: 'Doe' };
    const toMergeObject = { 'favorite-color': 'blue' };

    const expectedResult = {
      firstName: 'Jane',
      lastName: 'Doe',
      favoriteColor: 'blue',
    };

    expect(service.transform(originalObject, toMergeObject)).toEqual(
      expectedResult,
    );
  });

  it('should handle null and undefined correctly', () => {
    expect(service.transform(null)).toEqual({});
    expect(service.transform(undefined)).toEqual({});
    expect(service.transform({}, null)).toEqual({});
    expect(service.transform({}, undefined)).toEqual({});
  });
});
