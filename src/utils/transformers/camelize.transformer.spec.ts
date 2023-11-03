import { toCamelCase, camelize } from './camelize.transformer';

describe('toCamelCase', () => {
  it('should convert snake_case to camelCase', () => {
    expect(toCamelCase('some_key')).toBe('someKey');
  });

  it('should convert kebab-case to camelCase', () => {
    expect(toCamelCase('some-key')).toBe('someKey');
  });

  it('should handle strings without dashes or underscores', () => {
    expect(toCamelCase('somekey')).toBe('somekey');
  });

  it('should handle empty strings', () => {
    expect(toCamelCase('')).toBe('');
  });
});

describe('camelize', () => {
  it('should handle arrays', () => {
    const arr = ['some_key', 'another_key'];
    const result = camelize(arr);
    expect(result).toEqual(['some_key', 'another_key']); // array elements are not object keys, so should remain unchanged
  });

  it('should handle nested arrays', () => {
    const arr = ['some_key', ['nested_key']];
    const result = camelize(arr);
    expect(result).toEqual(['some_key', ['nested_key']]);
  });

  it('should handle objects', () => {
    const obj = { some_key: 'value', another_key: 'value2' };
    const result = camelize(obj);
    expect(result).toEqual({ someKey: 'value', anotherKey: 'value2' });
  });

  it('should handle nested objects', () => {
    const obj = { some_key: { nested_key: 'value' } };
    const result = camelize(obj);
    expect(result).toEqual({ someKey: { nestedKey: 'value' } });
  });

  it('should handle arrays inside objects', () => {
    const obj = { some_key: ['item1', 'item2'] };
    const result = camelize(obj);
    expect(result).toEqual({ someKey: ['item1', 'item2'] });
  });

  it('should handle null values', () => {
    const obj = null;
    const result = camelize(obj);
    expect(result).toBe(null);
  });

  it('should handle other data types', () => {
    const str = 'some_key';
    const result = camelize(str);
    expect(result).toBe('some_key'); // strings that aren't object keys should remain unchanged
  });
});
