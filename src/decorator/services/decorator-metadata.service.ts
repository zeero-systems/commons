import type { TargetPropertyType } from '~/common/types.ts';
import type { DecoratorType } from '~/decorator/types.ts';

import Decorator from '~/decorator/services/decorator.service.ts';
import Text from '~/common/services/text.service.ts';

export class DecoratorMetadata {

  public static get(target: any): Map<TargetPropertyType, DecoratorType[]> {
    const targetMetadata = target[Symbol.metadata] || target.constructor[Symbol.metadata]
    
    if (targetMetadata) return targetMetadata[Decorator.metadata]
    return new Map()
  }

  public static getDecoration(target: any, propertyKey: TargetPropertyType, annotation: string): DecoratorType | undefined {
    const decorations = DecoratorMetadata.filterDecorations(target, [propertyKey], [annotation])

    if (decorations) {
      return decorations[0]
    }

    return undefined
  }

  public static has(
    target: any,
    propertyKeys: Array<TargetPropertyType>,
    annotationNames: Array<string>,
  ): boolean {
    return DecoratorMetadata.filter(target, propertyKeys, annotationNames).size > 0
  }

  public static hasByPropertyKeys(
    target: any,
    propertyKeys: Array<TargetPropertyType>,
  ): boolean {
    return DecoratorMetadata.filterDecorationsByPropertyKeys(target, propertyKeys).length > 0
  }

  public static hasByAnnotationNames(
    target: any,
    annotationNames: Array<string>,
  ): boolean {
    return DecoratorMetadata.filterDecorationsByAnnotationNames(target, annotationNames).length > 0
  }

  public static filter(
    target: any,
    propertyKeys: Array<TargetPropertyType>,
    annotations: Array<string>,
  ): Map<TargetPropertyType, DecoratorType[]> {
    const decorators = new Map()
    const targetMetadata = target[Symbol.metadata] || target.constructor[Symbol.metadata]
    const metadata = targetMetadata && targetMetadata[Decorator.metadata]

    if (metadata) {
      for (const [key, decorations] of metadata) {
        if (propertyKeys[0] === "*" || propertyKeys.includes(key)) {
          const results = decorations
            .filter((decorator: DecoratorType) => {
              return annotations.some((annotation) => {
                return Text.toFirstLetterUppercase(decorator.annotation.target.constructor.name) == Text.toFirstLetterUppercase(annotation);
              })
            })
          
          if (results.length > 0) {
            decorators.set(key, results)
          }
        }
      }
    }
    
    return decorators;
  }

  public static filterDecorations<T>(
    target: T,
    propertyKeys: Array<TargetPropertyType>,
    annotations: Array<string>,
  ): Array<DecoratorType> {
    return DecoratorMetadata
      .filter(target, propertyKeys, annotations).values()
      .reduce((result, decorator) => {
        return [...result, ...decorator]
      }, [])
  }

  public static filterDecorationsByPropertyKeys(
    target: any,
    propertyKeys: Array<TargetPropertyType>,
  ): Array<DecoratorType> {
    const decorators = new Map()
    const targetMetadata = target[Symbol.metadata] || target.constructor[Symbol.metadata]
    const metadata = targetMetadata && targetMetadata[Decorator.metadata]

    if (metadata) {
      for (const [key, decorations] of metadata) {
        if (propertyKeys.includes(key)) {
          decorators.set(key, decorations)
        }
      }
    }
    
    return decorators.values().reduce((result, decorator) => {
      return [...result, ...decorator]
    }, [])
  }

  public static filterDecorationsByAnnotationNames(
    target: any,
    annotationNames: Array<string>,
  ): Array<DecoratorType> {
    const decorators = []
    const targetMetadata = target[Symbol.metadata] || target.constructor[Symbol.metadata]
    const metadata = targetMetadata && targetMetadata[Decorator.metadata]

    if (metadata) {
      for (const [_key, decorations] of metadata) {
          decorators.push(...decorations.filter((decorator: DecoratorType) => {
            return annotationNames.some((annotation) => {
              return Text.toFirstLetterUppercase(decorator.annotation.target.constructor.name) == Text.toFirstLetterUppercase(annotation);
            })
          }))
      }
    }
    
    return decorators;
  }
  
}

export default DecoratorMetadata