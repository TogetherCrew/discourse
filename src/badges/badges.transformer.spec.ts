import { Test, TestingModule } from '@nestjs/testing';
import { BadgesTransformer } from './badges.transformer';
import { addForumUUID } from '../utils/transformers/addForumUUID.transformer';
import { camelize } from '../utils/transformers/camelize.transformer';

jest.mock('../utils/transformers/addForumUUID.transformer');
jest.mock('../utils/transformers/camelize.transformer');

describe('BadgesTransformer', () => {
  let transformer: BadgesTransformer;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BadgesTransformer],
    }).compile();

    transformer = module.get<BadgesTransformer>(BadgesTransformer);
  });

  it('should be defined', () => {
    expect(transformer).toBeDefined();
  });

  describe('transform', () => {
    it('should call addForumUUID and camelize utilities and return the transformed badge', () => {
      const mockBadge = { id: 1, name: 'test-badge', grant_count: 1 } as Badge;
      const mockForum = { uuid: 'some-uuid' };

      const mockOutputAfterUUID = { ...mockBadge, forumUUID: mockForum.uuid };
      const mockOutputAfterCamelize = {
        ...mockOutputAfterUUID,
        grantCount: 1,
      };
      delete mockOutputAfterCamelize.grant_count;

      (addForumUUID as jest.Mock).mockReturnValue(mockOutputAfterUUID);
      (camelize as jest.Mock).mockReturnValue(mockOutputAfterCamelize);

      const result = transformer.transform(mockBadge, mockForum);

      expect(addForumUUID).toHaveBeenCalledWith(mockBadge, mockForum.uuid);
      expect(camelize).toHaveBeenCalledWith(mockOutputAfterUUID);
      expect(result).toEqual(mockOutputAfterCamelize);
    });
  });
});
