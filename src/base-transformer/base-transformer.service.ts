import { Injectable } from '@nestjs/common';

@Injectable()
export class BaseTransformerService {
  transform(obj: any, toMerge?: any): any {
    if (Array.isArray(obj)) {
      return obj.map((o) => this.camelize(this.merge(o, toMerge)));
    } else {
      return this.camelize(this.merge(obj, toMerge));
    }
  }

  private merge(obj: any, toMerge?: any): any {
    return { ...obj, ...toMerge };
  }

  private toCamelCase(str: string): string {
    return str.replace(/([-_]\w)/g, (group) =>
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
