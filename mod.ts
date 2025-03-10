import AnnotationException from '~/decorator/exceptions/AnnotationException.ts';
import Artifact from '~/entity/services/Artifact.ts';
import Common from '~/common/services/Common.ts';
import Container from '~/container/services/Container.ts';
import Decorator from '~/decorator/services/Decorator.ts';
import Entity from '~/entity/services/Entity.ts';
import Exception from '~/common/services/Exception.ts';
import Factory from '~/common/services/Factory.ts';
import Metadata from '~/common/services/Metadata.ts';
import Objector from '~/common/services/Objector.ts';
import Text from '~/common/services/Text.ts';
import Validator from '~/validator/services/Validator.ts';

import isClassFn from '~/common/guards/isClassFn.ts';
import isDateFn from '~/common/guards/isDateFn.ts';
import isArrayFn from '~/common/guards/isArrayFn.ts';
import isBigIntFn from '~/common/guards/isBigIntFn.ts';
import isBooleanFn from '~/common/guards/isBooleanFn.ts';
import isFunctionFn from '~/common/guards/isFunctionFn.ts';
import isMapFn from '~/common/guards/isMapFn.ts';
import isNullFn from '~/common/guards/isNullFn.ts';
import isNumberFn from '~/common/guards/isNumberFn.ts';
import isObjectFn from '~/common/guards/isObjectFn.ts';
import isSetFn from '~/common/guards/isSetFn.ts';
import isStringFn from '~/common/guards/isStringFn.ts';
import isSymbolFn from '~/common/guards/isSymbolFn.ts';
import isUndefinedFn from '~/common/guards/isUndefinedFn.ts';
import isWeakMapFn from '~/common/guards/isWeakMapFn.ts';
import isWeakSetFn from '~/common/guards/isWeakSetFn.ts';
import isClassDecoratorContextFn from '~/decorator/guards/isClassDecoratorContextFn.ts';
import isClassMemberDecoratorContextFn from '~/decorator/guards/isClassMemberDecoratorContextFn.ts';
import isValidationFn from '~/validator/guards/isValidationFn.ts';

import DecoratorKindEnum from '~/decorator/enums/DecoratorKindEnum.ts';
import ValidationEnum from '~/validator/enums/ValidationEnum.ts';

import Validations from '~/validator/validations.ts';

import Consumer from '~/container/annotations/Consumer.ts';
import Debug from '~/common/annotations/Debug.ts';
import Equal from '~/validator/annotations/Equal.ts';
import GreaterThan from '~/validator/annotations/GreaterThan.ts';
import GreaterThanEqual from '~/validator/annotations/GreaterThanEqual.ts';
import LessThanEqual from '~/validator/annotations/LessThanEqual.ts';
import LessThan from '~/validator/annotations/LessThan.ts';
import Mixin from '~/common/annotations/Mixin.ts';
import Module from '~/container/annotations/Module.ts';
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
export { default as LessThanEqual } from '~/validator/annotations/LessThanEqual.ts';
export { default as LessThan } from '~/validator/annotations/LessThan.ts';
export { default as Mixin } from '~/common/annotations/Mixin.ts';
export { default as Module } from '~/container/annotations/Module.ts';
export { default as Provider } from '~/container/annotations/Provider.ts';
export { default as Regex } from '~/validator/annotations/Regex.ts';
export { default as Required } from '~/validator/annotations/Required.ts';
export { default as Singleton } from '~/common/annotations/Singleton.ts';

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
  isArrayFn,
  isBigIntFn,
  isBooleanFn,
  isClassFn,
  isClassDecoratorContextFn,
  isClassMemberDecoratorContextFn,
  isDateFn,
  isFunctionFn,
  isMapFn,
  isNullFn,
  isNumberFn,
  isObjectFn,
  isSetFn,
  isStringFn,
  isSymbolFn,
  isUndefinedFn,
  isWeakMapFn,
  isWeakSetFn,
  isValidationFn,
}

export default {
  AnnotationException,
  Consumer,
  Debug,
  Equal,
  GreaterThan,
  GreaterThanEqual,
  LessThan,
  LessThanEqual,
  Mixin,
  Module,
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