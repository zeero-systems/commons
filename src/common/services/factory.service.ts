import type { PropertiesType } from '~/common/types.ts';
import DecoratorMetadata from '../../decorator/services/decorator-metadata.service.ts';
import isArray from '../guards/is-array.guard.ts';
import isObject from '../guards/is-object.guard.ts';

/**
 * Utility class providing common operations for class instantiation and function parameter inspection
 * 
 * @class Factory
 * 
 * @property {symbol} metadata - Unique symbol used for storing factory metadata
 * 
 * @method construct<T, C>
 * Creates an instance of a class with optional constructor arguments and property initialization
 * @template T - The type of the class instance to be created
 * @template C - Constructor function type
 * @param {new (...args: any) => T} target - The class constructor to instantiate
 * @param {Object} [options] - Configuration options for instantiation
 * @param {Object} [options.arguments] - Arguments to pass to constructor and properties
 * @param {Parameters<C>} [options.arguments.construct] - Constructor arguments as array
 * @param {PropertiesType<T>} [options.arguments.properties] - Object with named properties to set
 * @returns {T} The instantiated class instance
 * 
 * @method getParameterNames
 * Extracts parameter names from a function's definition
 * @param {*} target - The function or class to inspect
 * @param {string} [name] - Optional name to match in the function definition
 * @returns {string[]} Array of parameter names
 */
export class Factory {
  public static readonly metadata: unique symbol = Symbol('Factory.metadata');

  public static construct<T, C extends (...args: any) => T>(
    target: new (...args: any) => T,
    options?: {
      arguments?: Parameters<C> | PropertiesType<T>;
    },
  ): T {
    let indexedArguments: any[] = [];
    const namedArguments: any = {};

    if (options?.arguments) {
      if (isArray(options?.arguments)) {
        indexedArguments = [...options.arguments];
      }

      if (isObject(options?.arguments)) {
        Object.entries(options?.arguments).forEach(([key, value]) => {
          namedArguments[key] = value;
        });
      }
    }

    const canUpdateProperties = !DecoratorMetadata.findByAnnotationInteroperableName(target, 'singleton')
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

  public static getParameterNames(target: any, name?: string): string[] {
    if (target) {
      const regex = `${name != undefined ? name : target.prototype ? target.name : ''}\\((.+)\\)`;
      const match = target.toString().match(regex);
  
      if (match && match[1]) {
        return match[1].split(',').map((m: any) => String(m).trim());
      }
    }

    return [];
  }
}

export default Factory;
