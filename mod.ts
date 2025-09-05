import AnnotationException from '~/decorator/exceptions/annotation.exception.ts';
import Artifactor from '~/common/services/artifactor.service.ts';
import Decorator from '~/decorator/services/decoration.service.ts';
import Decoration from '~/decorator/services/decoration.service.ts';
import Entity from '~/entity/services/entity.service.ts';
import Exception from '~/common/services/exception.service.ts';
import Factory from '~/common/services/factory.service.ts';
import List from '~/common/services/list.service.ts';
import Metadata from '~/common/services/metadata.service.ts';
import Objector from '~/common/services/objector.service.ts';
import Text from '~/common/services/text.service.ts';
import Validator from '~/validator/services/validator.service.ts';

import isArtifact from '~/common/guards/is-artifact.guard.ts';
import isArray from '~/common/guards/is-array.guard.ts';
import isBigInt from '~/common/guards/is-big-int.guard.ts';
import isBoolean from '~/common/guards/is-boolean.guard.ts';
import isClass from '~/common/guards/is-class.guard.ts';
import isClassDecoratorContext from '~/decorator/guards/is-class-decorator-context.guard.ts';
import isClassMemberDecoratorContext from '~/decorator/guards/is-class-member-decorator-context.guard.ts';
import isDate from '~/common/guards/is-date.guard.ts';
import isDecoratorMetadata from '~/decorator/guards/is-decorator-metadata.guard.ts';
import isFunction from '~/common/guards/is-function.guard.ts';
import isMap from '~/common/guards/is-map.guard.ts';
import isNull from '~/common/guards/is-null.guard.ts';
import isNumber from '~/common/guards/is-number.guard.ts';
import isObject from '~/common/guards/is-object.guard.ts';
import isSet from '~/common/guards/is-set.guard.ts';
import isString from '~/common/guards/is-string.guard.ts';
import isSymbol from '~/common/guards/is-symbol.guard.ts';
import isUndefined from '~/common/guards/is-undefined.guard.ts';
import isWeakMap from '~/common/guards/is-weak-map.guard.ts';
import isWeakSet from '~/common/guards/is-weak-set.guard.ts';
import isValidation from '~/validator/guards/is-validation.guard.ts';

import DecoratorKindEnum from '~/decorator/enums/decorator-kind.enum.ts';
import ValidationEnum from '~/validator/enums/validation.enum.ts';

import Validations from '~/validator/validations.ts';

import Debug from '~/common/annotations/debug.annotation.ts';
import Equal from '~/validator/annotations/equal.annotation.ts';
import GreaterThan from '~/validator/annotations/greater-than.annotation.ts';
import GreaterThanEqual from '~/validator/annotations/greater-than-equal.annotation.ts';
import Float from '~/validator/annotations/float.annotation.ts';
import Integer from '~/validator/annotations/integer.annotation.ts';
import LessThanEqual from '~/validator/annotations/less-than-equal.annotation.ts';
import LessThan from '~/validator/annotations/less-than.annotation.ts';
import Mixin from '~/common/annotations/mixin.annotation.ts';
import Regex from '~/validator/annotations/regex.annotation.ts';
import Required from '~/validator/annotations/required.annotation.ts';
import Singleton from '~/common/annotations/singleton.annotation.ts';

export { Artifactor } from '~/common/services/artifactor.service.ts';
export { AnnotationException } from '~/decorator/exceptions/annotation.exception.ts';
export { Decorator } from '~/decorator/services/decorator.service.ts';
export { Decoration } from '~/decorator/services/decoration.service.ts';
export { Entity } from '~/entity/services/entity.service.ts';
export { Exception } from '~/common/services/exception.service.ts';
export { Factory } from '~/common/services/factory.service.ts';
export { List } from '~/common/services/list.service.ts';
export { Metadata } from '~/common/services/metadata.service.ts';
export { Objector } from '~/common/services/objector.service.ts';
export { Text } from '~/common/services/text.service.ts';
export { Validator } from '~/validator/services/validator.service.ts';

export { DecoratorKindEnum } from '~/decorator/enums/decorator-kind.enum.ts';
export { ValidationEnum } from '~/validator/enums/validation.enum.ts';

export { default as Debug } from '~/common/annotations/debug.annotation.ts';
export { default as Equal } from '~/validator/annotations/equal.annotation.ts';
export { default as GreaterThan } from '~/validator/annotations/greater-than.annotation.ts';
export { default as GreaterThanEqual } from '~/validator/annotations/greater-than-equal.annotation.ts';
export { default as Float } from '~/validator/annotations/float.annotation.ts';
export { default as Integer } from '~/validator/annotations/integer.annotation.ts';
export { default as LessThanEqual } from '~/validator/annotations/less-than-equal.annotation.ts';
export { default as LessThan } from '~/validator/annotations/less-than.annotation.ts';
export { default as Mixin } from '~/common/annotations/mixin.annotation.ts';
export { default as Regex } from '~/validator/annotations/regex.annotation.ts';
export { default as Required } from '~/validator/annotations/required.annotation.ts';
export { default as Singleton } from '~/common/annotations/singleton.annotation.ts';

import { Debug as DebugAnnotation } from '~/common/annotations/debug.annotation.ts';
import { Mixin as MixinAnnotation } from '~/common/annotations/mixin.annotation.ts';
import { Singleton as SingletonAnnotation } from '~/common/annotations/singleton.annotation.ts';

export * from '~/common/interfaces.ts';
export * from '~/common/types.ts';
export * from '~/decorator/interfaces.ts';
export * from '~/decorator/types.ts';
export * from '~/entity/interfaces.ts';
export * from '~/entity/types.ts';
export * from '~/validator/interfaces.ts';
export * from '~/validator/types.ts';

export const Guards = {
  isArtifact,
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
  Debug: DebugAnnotation,
  Mixin: MixinAnnotation,
  Singleton: SingletonAnnotation,
}

export default {
  Annotations,
  AnnotationException,
  Artifactor,
  Debug,
  Decorator,
  Decoration,
  DecoratorKindEnum,
  Entity,
  Exception,
  Equal,
  Factory,
  Guards,
  GreaterThan,
  GreaterThanEqual,
  Float,
  Integer,
  LessThan,
  LessThanEqual,
  List,
  Mixin,
  Metadata,
  Objector,
  Regex,
  Required,
  Singleton,
  Text,
  Validator,
  ValidationEnum,
  Validations
}
