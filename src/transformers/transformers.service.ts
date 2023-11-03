import { Injectable } from '@nestjs/common';

@Injectable()
export class TransformersService {
  transform(obj: any, merge: any): any {
    obj = this.merge(obj, merge);
    obj = this.camelize(obj);
    return obj;
  }

  private merge(obj: any, merge: any): any {
    return { ...obj, ...merge };
  }

  private toCamelCase(str: string): string {
    return str.replace(/([-_][a-z])/g, (group) =>
      group.toUpperCase().replace('-', '').replace('_', ''),
    );
  }

  private camelize(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((v) => this.camelize(v));
    } else if (obj !== null && obj.constructor === Object) {
      return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [
          this.toCamelCase(key),
          this.camelize(value),
        ]),
      );
    }
    return obj;
  }
}
