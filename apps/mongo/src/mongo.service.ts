import { Injectable } from '@nestjs/common';

@Injectable()
export class MongoService {
  getHello(): string {
    return 'Hello World!';
  }
}
