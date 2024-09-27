import { Injectable } from '@nestjs/common';

@Injectable()
export class TransformService {
  transform(obj: any, toMerge?: any): any {
    if (Array.isArray(obj)) {
      return JSON.stringify(
        obj.map((o) => this.camelize(this.merge(o, toMerge))),
      );
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
      return JSON.stringify(obj.map((v) => this.camelize(v)));
    } else if (this.isDictionary(obj)) {
      return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [
          this.toCamelCase(key),
          JSON.stringify(value),
          // this.camelize(value),
        ]),
      );
    }
    return obj;
  }

  private isDictionary(obj: any): boolean {
    return (
      obj !== null && typeof obj === 'object' && obj.constructor === Object
    );
  }
}
