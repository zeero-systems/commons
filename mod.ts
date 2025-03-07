import AnnotationException from '~/decorator/exceptions/AnnotationException.ts';
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

export * from '~/common/interfaces.ts';
export * from '~/common/types.ts';
export * from '~/container/types.ts';
export * from '~/decorator/interfaces.ts';
export * from '~/decorator/types.ts';
export * from '~/entity/interfaces.ts';
export * from '~/entity/types.ts';
export * from '~/validator/interfaces.ts';
export * from '~/validator/types.ts';

export const Annotations ={
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
}

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
  Annotations,
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