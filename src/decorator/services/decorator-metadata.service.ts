import type { PropertyType } from '~/common/types.ts';
import type { DecoratorMetadataType, DecoratorType } from '~/decorator/types.ts';

import Decorator from '~/decorator/services/decorator.service.ts';
import Text from '~/common/services/text.service.ts';

export class DecoratorMetadata {

  public static get(target: any): DecoratorMetadataType {
    const targetMetadata = target[Symbol.metadata] || target.constructor[Symbol.metadata]
    
    if (targetMetadata) return targetMetadata[Decorator.metadata]
    return new Map()
  }

  public static find(target: any, predicate: (targetPropertyKey: PropertyType, decorator: DecoratorType, index: number, array: any[]) => any): DecoratorType | undefined {
    const metadata = DecoratorMetadata.get(target)
    
    if (metadata) {
      for (const [targetPropertyKey, decorations] of metadata) {
        const found = decorations.find((decorator: DecoratorType, index: number, array: DecoratorType[]) => predicate(targetPropertyKey, decorator, index, array))
        if (found) return found
      }
    }

    return undefined
  }

  public static findByAnnotationInteroperableName(
    target: any,
    interoperableName: string,
    targetPropertyKey?: PropertyType
  ): DecoratorType | undefined {
    return DecoratorMetadata.find(target, (currentTargetPropertyKey: PropertyType, decorator: DecoratorType) => {
      return (
        !targetPropertyKey || targetPropertyKey == currentTargetPropertyKey
      ) && Text.toFirstLetterUppercase(decorator.annotation.target.name) == Text.toFirstLetterUppercase(interoperableName);
    })
  }

  public static findByAnnotationClassName(
    target: any,
    annotationName: string,
    targetPropertyKey?: PropertyType
  ): DecoratorType | undefined {
    return DecoratorMetadata.find(target, (currentTargetPropertyKey: PropertyType, decorator: DecoratorType) => {
      return (
        !targetPropertyKey || targetPropertyKey == currentTargetPropertyKey
      ) && Text.toFirstLetterUppercase(decorator.annotation.target.constructor.name) == Text.toFirstLetterUppercase(annotationName);
    })
  }

  public static findByTargetPropertyKey(
    target: any,
    targetPropertyKey: PropertyType,
    annotationName?: string,
  ): DecoratorType | undefined {
    return DecoratorMetadata.find(target, (currentTargetPropertyKey: PropertyType, decorator: DecoratorType) => {
      return (
        !annotationName || Text.toFirstLetterUppercase(decorator.annotation.target.constructor.name) == Text.toFirstLetterUppercase(annotationName)
      ) && targetPropertyKey == currentTargetPropertyKey
    })
  }

  public static filter(target: any, predicate: (targetPropertyKey: PropertyType, decorator: DecoratorType, index: number, array: any[]) => any): Array<DecoratorType> {
    const decorators = []
    const metadata = DecoratorMetadata.get(target)

    if (metadata) {
      for (const [targetPropertyKey, decorations] of metadata) {
        decorators.push(...decorations.filter((decorator: DecoratorType, index: number, array: DecoratorType[]) => predicate(targetPropertyKey, decorator, index, array)))
      }
    }

    return decorators;  
  }

  public static filterByAnnotationInteroperableName(
    target: any,
    interoperableName: string,
    targetPropertyKey?: PropertyType
  ): Array<DecoratorType> {
    return DecoratorMetadata.filter(target, (currentTargetPropertyKey: PropertyType, decorator: DecoratorType) => {
      return (
        !targetPropertyKey || targetPropertyKey == currentTargetPropertyKey
      ) && Text.toFirstLetterUppercase(decorator.annotation.target.name) == Text.toFirstLetterUppercase(interoperableName);
    })
  }

  public static filterByAnnotationInteroperableNames(
    target: any,
    interoperableNames: Array<string>,
  ): Array<DecoratorType> {
    return DecoratorMetadata.filter(target, (_targetPropertyKey: PropertyType, decorator: DecoratorType) => {
      return interoperableNames.some((annotation: string) => {
        return Text.toFirstLetterUppercase(decorator.annotation.target.name) == Text.toFirstLetterUppercase(annotation);
      })
    })
  }

  public static filterByAnnotationClassName(
    target: any,
    annotationName: string,
    targetPropertyKey?: PropertyType
  ): Array<DecoratorType> {
    return DecoratorMetadata.filter(target, (currentTargetPropertyKey: PropertyType, decorator: DecoratorType) => {
      return (
        !targetPropertyKey || targetPropertyKey == currentTargetPropertyKey
      ) && Text.toFirstLetterUppercase(decorator.annotation.target.constructor.name) == Text.toFirstLetterUppercase(annotationName);
    })
  }

  public static filterByAnnotationClassNames(
    target: any,
    annotationNames: Array<string>,
  ): Array<DecoratorType> {
    return DecoratorMetadata.filter(target, (_targetPropertyKey: PropertyType, decorator: DecoratorType) => {
      return annotationNames.some((annotation: string) => {
        return Text.toFirstLetterUppercase(decorator.annotation.target.constructor.name) == Text.toFirstLetterUppercase(annotation);
      })
    })
  }
  
  public static filterByTargetPropertyKeys(
    target: any,
    targetPropertyKeys: Array<PropertyType>,
  ): Array<DecoratorType> {
    return DecoratorMetadata.filter(target, (targetPropertyKey: PropertyType) => {
      return targetPropertyKeys.includes(targetPropertyKey)
    })
  }

}

export default DecoratorMetadata