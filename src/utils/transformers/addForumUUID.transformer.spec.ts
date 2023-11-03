import { addForumUUID } from './addForumUUID.transformer';

describe('addForumUUID', () => {
  it('should add forumUUID to an empty object', () => {
    const obj = {};
    const uuid = '12345678-1234-1234-1234-123456789012';
    const result = addForumUUID(obj, uuid);
    expect(result).toEqual({
      forumUUID: '12345678-1234-1234-1234-123456789012',
    });
  });

  it('should add forumUUID to an existing object without mutating the original object', () => {
    const obj = { name: 'Test', age: 25 };
    const uuid = '12345678-1234-1234-1234-123456789012';
    const result = addForumUUID(obj, uuid);
    expect(result).toEqual({
      name: 'Test',
      age: 25,
      forumUUID: '12345678-1234-1234-1234-123456789012',
    });
    expect(obj).not.toHaveProperty('forumUUID'); // ensure the original object isn't mutated
  });

  it('should overwrite existing forumUUID in the object', () => {
    const obj = { forumUUID: 'old-uuid-0000-0000-0000-000000000000' };
    const uuid = '12345678-1234-1234-1234-123456789012';
    const result = addForumUUID(obj, uuid);
    expect(result).toEqual({
      forumUUID: '12345678-1234-1234-1234-123456789012',
    });
  });

  it('should handle null objects', () => {
    const obj = null;
    const uuid = '12345678-1234-1234-1234-123456789012';
    const result = addForumUUID(obj, uuid);
    expect(result).toEqual({
      forumUUID: '12345678-1234-1234-1234-123456789012',
    });
  });

  // additional test cases as needed...
});
