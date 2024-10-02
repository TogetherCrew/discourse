import { Injectable, Logger } from '@nestjs/common';
import { Platform, PlatformSchema } from './schemas/platform.schema';
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

  async start(endpoint: string) {
    await this.db
      .model(this.platformModel.collection.name)
      .updateMany(
        { name: 'discourse', metadata: { id: endpoint } },
        { $set: { 'metadata.extraction.startedAt': new Date() } },
      );
    this.logger.log(`Updated startedAt for ${endpoint}.`);
  }
  async complete(endpoint: string) {
    this.logger.debug(`endpoint: ${endpoint}`);
    await this.db
      .model(this.platformModel.collection.name)
      .updateMany(
        { name: 'discourse', metadata: { id: endpoint } },
        { $set: { 'metadata.extraction.completedAt': new Date() } },
      );
    this.logger.log(`Updated completedAt for ${endpoint}.`);
  }
}
