import type { ConstructorArgType } from '~/common/types.ts';

import { Singleton } from '~/common/annotations/Singleton.ts';

import Decorator from '~/decorator/services/Decorator.ts';

import isNumber from '~/common/guards/isNumber.ts';


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
        if (isNumber(key)) {
          indexedArguments[Number(key)] = value;
        } else {
          namedArguments[key] = value;
        }
      });
    }

    const canUpdateProperties = !Decorator.hasAnnotation(target, Singleton);
    const targetInstance = new target(...indexedArguments);

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

  public static getParameterNames(target: any, Name?: string): string[] {
    const regex = `${Name != undefined ? Name : target.prototype ? target.name : ''}\\((.+)\\)`;
    const match = target.toString().match(regex);

    if (match && match[1]) {
      return match[1].split(',').map((m: any) => String(m).trim());
    }

    return [];
  }
}

export default Factory;
