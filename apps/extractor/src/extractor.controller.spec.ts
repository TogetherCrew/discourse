import { Test, TestingModule } from '@nestjs/testing';
import { ExtractorController } from './extractor.controller';
import { ExtractorService } from './extractor.service';

describe('ExtractorController', () => {
  let extractorController: ExtractorController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ExtractorController],
      providers: [ExtractorService],
    }).compile();

    extractorController = app.get<ExtractorController>(ExtractorController);
  });

  // describe('root', () => {
  //   it('should return "Hello World!"', () => {
  //     // expect(extractorController.extract('discourse.org')).toBe('Hello !');
  //   });
  // });
});
