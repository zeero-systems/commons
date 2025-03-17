import AnnotationException from '~/decorator/exceptions/AnnotationException.ts';
import Artifact from '~/entity/services/Artifact.ts';
import Common from '~/common/services/Common.ts';
import Container from '~/container/services/Container.ts';
import Decorator from '~/decorator/services/Decorator.ts';
import Entity from '~/entity/services/Entity.ts';
import Exception from '~/common/services/Exception.ts';
import Factory from '~/common/services/Factory.ts';
import List from '~/common/services/List.ts';
import Metadata from '~/common/services/Metadata.ts';
import Objector from '~/common/services/Objector.ts';
import Text from '~/common/services/Text.ts';
import Validator from '~/validator/services/Validator.ts';

import isClass from '~/common/guards/isClass.ts';
import isDate from '~/common/guards/isDate.ts';
import isArray from '~/common/guards/isArray.ts';
import isBigInt from '~/common/guards/isBigInt.ts';
import isBoolean from '~/common/guards/isBoolean.ts';
import isClassDecoratorContext from '~/decorator/guards/isClassDecoratorContext.ts';
import isClassMemberDecoratorContext from '~/decorator/guards/isClassMemberDecoratorContext.ts';
import isDecoratorMetadata from '~/decorator/guards/isDecoratorMetadata.ts';
import isFunction from '~/common/guards/isFunction.ts';
import isMap from '~/common/guards/isMap.ts';
import isNull from '~/common/guards/isNull.ts';
import isNumber from '~/common/guards/isNumber.ts';
import isObject from '~/common/guards/isObject.ts';
import isSet from '~/common/guards/isSet.ts';
import isString from '~/common/guards/isString.ts';
import isSymbol from '~/common/guards/isSymbol.ts';
import isUndefined from '~/common/guards/isUndefined.ts';
import isWeakMap from '~/common/guards/isWeakMap.ts';
import isWeakSet from '~/common/guards/isWeakSet.ts';
import isValidation from '~/validator/guards/isValidation.ts';

import DecoratorKindEnum from '~/decorator/enums/DecoratorKindEnum.ts';
import ValidationEnum from '~/validator/enums/ValidationEnum.ts';

import Validations from '~/validator/validations.ts';

import Consumer from '~/container/annotations/Consumer.ts';
import Debug from '~/common/annotations/Debug.ts';
import Equal from '~/validator/annotations/Equal.ts';
import GreaterThan from '~/validator/annotations/GreaterThan.ts';
import GreaterThanEqual from '~/validator/annotations/GreaterThanEqual.ts';
import Integer from '~/validator/annotations/Integer.ts';
import LessThanEqual from '~/validator/annotations/LessThanEqual.ts';
import LessThan from '~/validator/annotations/LessThan.ts';
import Mixin from '~/common/annotations/Mixin.ts';
import Provider from '~/container/annotations/Provider.ts';
import Regex from '~/validator/annotations/Regex.ts';
import Required from '~/validator/annotations/Required.ts';
import Singleton from '~/common/annotations/Singleton.ts';

export { Artifact } from '~/entity/services/Artifact.ts';
export { AnnotationException } from '~/decorator/exceptions/AnnotationException.ts';
export { Common } from '~/common/services/Common.ts';
export { Container } from '~/container/services/Container.ts';
export { Decorator } from '~/decorator/services/Decorator.ts';
export { Entity } from '~/entity/services/Entity.ts';
export { Exception } from '~/common/services/Exception.ts';
export { Factory } from '~/common/services/Factory.ts';
export { List } from '~/common/services/List.ts';
export { Metadata } from '~/common/services/Metadata.ts';
export { Objector } from '~/common/services/Objector.ts';
export { Text } from '~/common/services/Text.ts';
export { Validator } from '~/validator/services/Validator.ts';

export { DecoratorKindEnum } from '~/decorator/enums/DecoratorKindEnum.ts';
export { ValidationEnum } from '~/validator/enums/ValidationEnum.ts';

export { default as Consumer } from '~/container/annotations/Consumer.ts';
export { default as Debug } from '~/common/annotations/Debug.ts';
export { default as Equal } from '~/validator/annotations/Equal.ts';
export { default as GreaterThan } from '~/validator/annotations/GreaterThan.ts';
export { default as GreaterThanEqual } from '~/validator/annotations/GreaterThanEqual.ts';
export { default as Integer } from '~/validator/annotations/Integer.ts';
export { default as LessThanEqual } from '~/validator/annotations/LessThanEqual.ts';
export { default as LessThan } from '~/validator/annotations/LessThan.ts';
export { default as Mixin } from '~/common/annotations/Mixin.ts';
export { default as Provider } from '~/container/annotations/Provider.ts';
export { default as Regex } from '~/validator/annotations/Regex.ts';
export { default as Required } from '~/validator/annotations/Required.ts';
export { default as Singleton } from '~/common/annotations/Singleton.ts';

import { Consumer as ConsumerAnnotation } from '~/container/annotations/Consumer.ts';
import { Debug as DebugAnnotation } from '~/common/annotations/Debug.ts';
import { Mixin as MixinAnnotation } from '~/common/annotations/Mixin.ts';
import { Provider as ProviderAnnotation } from '~/container/annotations/Provider.ts';
import { Singleton as SingletonAnnotation } from '~/common/annotations/Singleton.ts';

export * from '~/common/interfaces.ts';
export * from '~/common/types.ts';
export * from '~/container/types.ts';
export * from '~/decorator/interfaces.ts';
export * from '~/decorator/types.ts';
export * from '~/entity/interfaces.ts';
export * from '~/entity/types.ts';
export * from '~/validator/interfaces.ts';
export * from '~/validator/types.ts';

export const Guards = {
  isArray,
  isBigInt,
  isBoolean,
  isClass,
  isClassDecoratorContext,
  isClassMemberDecoratorContext,
  isDecoratorMetadata,
  isDate,
  isFunction,
  isMap,
  isNull,
  isNumber,
  isObject,
  isSet,
  isString,
  isSymbol,
  isUndefined,
  isWeakMap,
  isWeakSet,
  isValidation,
}

export const Annotations = {
  Consumer: ConsumerAnnotation,
  Debug: DebugAnnotation,
  Mixin: MixinAnnotation,
  Provider: ProviderAnnotation,
  Singleton: SingletonAnnotation,
}

export default {
  Annotations,
  AnnotationException,
  Consumer,
  Debug,
  Equal,
  GreaterThan,
  GreaterThanEqual,
  Integer,
  LessThan,
  LessThanEqual,
  List,
  Mixin,
  Provider,
  Regex,
  Required,
  Singleton,
  Artifact,
  Common,
  Container,
  Decorator,
  DecoratorKindEnum,
  Entity,
  Exception,
  Factory,
  Guards,
  Metadata,
  Objector,
  Text,
  Validator,
  ValidationEnum,
  Validations
}