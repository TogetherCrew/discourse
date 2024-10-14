import { Injectable, Logger } from '@nestjs/common';
import {
  Platform,
  PlatformDocument,
  PlatformSchema,
} from './schemas/platform.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

@Injectable()
export class MongoService {
  private readonly logger = new Logger(MongoService.name);
  private readonly db = this.connection.useDb('Core', { useCache: true });

  constructor(
    @InjectModel(Platform.name) private readonly platformModel: Model<Platform>,
    @InjectConnection() private readonly connection: Connection,
  ) {
    if (!this.db.models[this.platformModel.collection.name]) {
      this.db.model(this.platformModel.collection.name, PlatformSchema);
    }
  }

  async updateOne(filter: any, update: any) {
    try {
      await this.db
        .model(this.platformModel.collection.name)
        .updateOne(filter, update);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async findById(id: string): Promise<PlatformDocument> {
    this.logger.debug({ id });
    const result = await this.db
      .model(this.platformModel.collection.name)
      .findById(id);
    this.logger.debug({ result });
    return result;
  }

  async find(filter: any, projection: any, options: any): Promise<any | void> {
    try {
      const result = await this.db
        .model(this.platformModel.collection.name)
        .find(filter, projection, options);
      this.logger.debug({ result });
      return result;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
