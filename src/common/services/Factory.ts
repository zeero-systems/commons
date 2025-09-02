import type { ArtifactType, KeyType, PropertiesType } from '~/common/types.ts';
import type { DecorationType } from '~/decorator/types.ts';

import { Singleton } from '~/common/annotations/Singleton.ts';

import Decorator from '~/decorator/services/Decorator.ts';

import Metadata from '~/common/services/Metadata.ts';
import DecoratorKindEnum from '~/decorator/enums/DecoratorKindEnum.ts';

/**
 * Common operations for classes and functions
 *
 * @member {Function} construct - Instantiate a class with arguments
 * @member {Function} getParameterNames - Return a list with named parameters from a function
 */
export class Factory {
  public static readonly metadata: unique symbol = Symbol('Factory.metadata');

  public static applyMetadata<P>(decoration: DecorationType<P>, artifact: ArtifactType): void {
    if (decoration.property) {
      if (artifact.parameters && artifact.parameters.length > 0) {
        if (!decoration.context.metadata[Factory.metadata]) {
          decoration.context.metadata[Factory.metadata] = new Map();
        }
        
        if (!decoration.context.metadata[Factory.metadata].get(decoration.property)) {
          decoration.context.metadata[Factory.metadata].set(decoration.property, new Map());
        }

        if (decoration.context.kind == DecoratorKindEnum.CLASS) {
          if (!decoration.context.metadata[Factory.metadata].get(decoration.property).has('parameters')) {
            decoration.context.metadata[Factory.metadata].get(decoration.property).set(
              'parameters',
              artifact.parameters,
            );
          }
        }
      }
    }
  }

  public static construct<T, C extends (...args: any) => T>(
    target: new (...args: any) => T,
    options?: {
      arguments?: {
        construct?: Parameters<C>;
        properties?: PropertiesType<T>;
      };
    },
  ): T {
    let indexedArguments: any[] = [];
    const namedArguments: any = {};

    if (options?.arguments) {
      if (options?.arguments.properties) {
        Object.entries(options?.arguments.properties).forEach(([key, value]) => {
          namedArguments[key] = value;
        });
      }
      if (options?.arguments.construct) {
        indexedArguments = [...options.arguments.construct];
      }
    }

    const canUpdateProperties = !Decorator.hasAnnotation(target, Singleton);
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

  public static getParameters(target: any, propertyKey: KeyType = 'construct'): Array<string> {
    let parameters = [];
    const metadata = Metadata.getProperty(target, Factory.metadata);

    if (metadata && metadata.has(propertyKey)) {
      parameters = metadata.get(propertyKey).get('parameters');
    }

    return parameters;
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
