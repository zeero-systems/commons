import type { TargetPropertyType } from '~/common/types.ts';
import type { DecoratorMetadataType, DecoratorType } from '~/decorator/types.ts';

import Decorator from '~/decorator/services/decorator.service.ts';
import Text from '~/common/services/text.service.ts';

export class DecoratorMetadata {

  public static get(target: any): DecoratorMetadataType {
    const targetMetadata = target[Symbol.metadata] || target.constructor[Symbol.metadata]
    
    if (targetMetadata) return targetMetadata[Decorator.metadata]
    return new Map()
  }

  public static find(target: any, predicate: (targetPropertyKey: TargetPropertyType, decorator: DecoratorType, index: number, array: any[]) => any): DecoratorType | undefined {
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
    targetPropertyKey?: TargetPropertyType
  ): Array<DecoratorType> {
    return DecoratorMetadata.filter(target, (currentTargetPropertyKey: TargetPropertyType, decorator: DecoratorType) => {
      return (
        !targetPropertyKey || targetPropertyKey == currentTargetPropertyKey
      ) && Text.toFirstLetterUppercase(decorator.annotation.target.name) == Text.toFirstLetterUppercase(interoperableName);
    })
  }

  public static findByAnnotationClassName(
    target: any,
    annotationName: string,
    targetPropertyKey?: TargetPropertyType
  ): Array<DecoratorType> {
    return DecoratorMetadata.filter(target, (currentTargetPropertyKey: TargetPropertyType, decorator: DecoratorType) => {
      return (
        !targetPropertyKey || targetPropertyKey == currentTargetPropertyKey
      ) && Text.toFirstLetterUppercase(decorator.annotation.target.constructor.name) == Text.toFirstLetterUppercase(annotationName);
    })
  }

  public static filterByAnnotationClassName(
    target: any,
    annotationName: string,
    targetPropertyKey?: TargetPropertyType
  ): Array<DecoratorType> {
    return DecoratorMetadata.filter(target, (currentTargetPropertyKey: TargetPropertyType, decorator: DecoratorType) => {
      return (
        !targetPropertyKey || targetPropertyKey == currentTargetPropertyKey
      ) && Text.toFirstLetterUppercase(decorator.annotation.target.constructor.name) == Text.toFirstLetterUppercase(annotationName);
    })
  }

  public static filter(target: any, predicate: (targetPropertyKey: TargetPropertyType, decorator: DecoratorType, index: number, array: any[]) => any): Array<DecoratorType> {
    const decorators = []
    const metadata = DecoratorMetadata.get(target)

    if (metadata) {
      for (const [targetPropertyKey, decorations] of metadata) {
        decorators.push(...decorations.filter((decorator: DecoratorType, index: number, array: DecoratorType[]) => predicate(targetPropertyKey, decorator, index, array)))
      }
    }

    return decorators;  
  }

  public static filterByAnnotationInteroperableNames(
    target: any,
    interoperableNames: Array<string>,
  ): Array<DecoratorType> {
    return DecoratorMetadata.filter(target, (_targetPropertyKey: TargetPropertyType, decorator: DecoratorType) => {
      return interoperableNames.some((annotation: string) => {
        return Text.toFirstLetterUppercase(decorator.annotation.target.name) == Text.toFirstLetterUppercase(annotation);
      })
    })
  }

  public static filterByAnnotationClassNames(
    target: any,
    annotationNames: Array<string>,
  ): Array<DecoratorType> {
    return DecoratorMetadata.filter(target, (_targetPropertyKey: TargetPropertyType, decorator: DecoratorType) => {
      return annotationNames.some((annotation: string) => {
        return Text.toFirstLetterUppercase(decorator.annotation.target.constructor.name) == Text.toFirstLetterUppercase(annotation);
      })
    })
  }
  
  public static filterByTargetPropertyKeys(
    target: any,
    targetPropertyKeys: Array<TargetPropertyType>,
  ): Array<DecoratorType> {
    return DecoratorMetadata.filter(target, (targetPropertyKey: TargetPropertyType) => {
      return targetPropertyKeys.includes(targetPropertyKey)
    })
  }

  public static getByAnnotationInteroperableName(
    target: any,
    interoperableName: string,
  ): DecoratorType | undefined {
    return DecoratorMetadata.findByAnnotationInteroperableName(target, interoperableName)[0]
  }

  public static getByAnnotationClassName(
    target: any,
    annotationName: string,
  ): DecoratorType | undefined {
    return DecoratorMetadata.findByAnnotationInteroperableName(target, annotationName)[0]
  }
  
  public static getByTargetPropertyKey(
    target: any,
    targetPropertyKey: TargetPropertyType,
  ): DecoratorType | undefined {
    return DecoratorMetadata.filterByTargetPropertyKeys(target, [targetPropertyKey])[0]
  }

}

export default DecoratorMetadata