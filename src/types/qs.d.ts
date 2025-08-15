declare module 'qs' {
  interface IStringifyOptions {
    delimiter?: string;
    strictNullHandling?: boolean;
    skipNulls?: boolean;
    encode?: boolean;
    encoder?: (str: string, defaultEncoder: any, charset: string, type: 'key' | 'value') => string;
    filter?: Array<string | number> | ((prefix: string, value: any) => any);
    arrayFormat?: 'indices' | 'brackets' | 'repeat' | 'comma';
    indices?: boolean;
    sort?: (a: any, b: any) => number;
    serializeDate?: (d: Date) => string;
    format?: 'RFC1738' | 'RFC3986';
    encodeValuesOnly?: boolean;
    addQueryPrefix?: boolean;
    allowDots?: boolean;
    charset?: string;
    charsetSentinel?: boolean;
  }

  interface IParseOptions {
    delimiter?: string | RegExp;
    depth?: number;
    decoder?: (str: string, defaultDecoder: any, charset: string, type: 'key' | 'value') => any;
    arrayLimit?: number;
    parseArrays?: boolean;
    allowDots?: boolean;
    plainObjects?: boolean;
    allowPrototypes?: boolean;
    parameterLimit?: number;
    strictNullHandling?: boolean;
    ignoreQueryPrefix?: boolean;
    charset?: string;
    charsetSentinel?: boolean;
    interpretNumericEntities?: boolean;
    returnBuffers?: boolean;
  }

  function stringify(obj: any, options?: IStringifyOptions): string;
  function parse(str: string, options?: IParseOptions): any;

  export = {
    stringify,
    parse,
  };
} 