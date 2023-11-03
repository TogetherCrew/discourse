export function toCamelCase(str: string): string {
  return str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace('-', '').replace('_', ''),
  );
}

export function camelize(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((v) => camelize(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        toCamelCase(key),
        camelize(value),
      ]),
    );
  }
  return obj;
}
