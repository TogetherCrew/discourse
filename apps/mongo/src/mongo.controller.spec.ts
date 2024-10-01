import { Test, TestingModule } from '@nestjs/testing';
import { MongoController } from './mongo.controller';
import { MongoService } from './mongo.service';

describe('MongoController', () => {
  let mongoController: MongoController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MongoController],
      providers: [MongoService],
    }).compile();

    mongoController = app.get<MongoController>(MongoController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(mongoController.getHello()).toBe('Hello World!');
    });
  });
});
