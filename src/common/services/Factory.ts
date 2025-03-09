import type { ConstructorArgType } from '~/common/types.ts';

import Common from '~/common/services/Common.ts';
import Metadata from '~/common/services/Metadata.ts';

import isNumberFn from '~/common/guards/isNumberFn.ts';

/**
 * Common operations for classes and functions
 *
 * @member {Function} construct - Instantiate a class with arguments
 * @member {Function} getParameterNames - Return a list with named parameters from a function
 */
export class Factory {
  public static construct<T>(
    target: new (...args: any[]) => T,
    options?: {
      arguments?: ConstructorArgType<T>;
    },
  ): T {
    const namedArguments: any = {};
    const indexedArguments: any[] = [];

    if (options?.arguments) {
      Object.entries(options?.arguments).forEach(([key, value]) => {
        if (isNumberFn(key)) {
          indexedArguments[Number(key)] = value;
        } else {
          namedArguments[key] = value;
        }
      });
    }

    const canUpdateProperties = !Metadata.getProperty(target, Common.singleton);
    const targetInstance = Reflect.construct(target, indexedArguments);

    if (canUpdateProperties) {
      Object.entries(namedArguments).reduce((t: any, [key]: any) => {
        if (Object.hasOwnProperty.call(t, key)) {
          t[key] = namedArguments[key];
        }
        return t;
      }, targetInstance);
    }

    return targetInstance;
  }

  public static getParameterNames(target: any, fnName?: string): string[] {
    const regex = `${fnName != undefined ? fnName : target.prototype ? target.name : ''}\\((.+)\\)`;
    const match = target.toString().match(regex);

    if (match && match[1]) {
      return match[1].split(',').map((m: any) => String(m).trim());
    }

    return [];
  }
}

export default Factory;
