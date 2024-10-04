import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type PlatformDocument = HydratedDocument<Platform>;

@Schema({ strict: false, timestamps: true }) // strict: false allows storing unstructured data
export class Platform {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Object })
  metadata: any;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
  })
  community: any;

  @Prop({ type: Date, default: null })
  disconnectedAt: Date;

  @Prop({ type: Date, default: () => new Date() })
  connectedAt: Date;
}

export const PlatformSchema = SchemaFactory.createForClass(Platform);
