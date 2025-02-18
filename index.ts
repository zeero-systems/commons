import Debug from '~/common/decorations/Debug.ts';
import Exception from '~/common/services/Exception.ts';
import MetadataTagEnum from '~/common/enums/MetadataTagEnum.ts';
import Singleton from '~/common/decorations/Singleton.ts';
import constructFn from '~/common/functions/constructFn.ts';
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
import getObjectEntriesFn from '~/common/functions/objectEntriesFn.ts';
import getParameterNamesFn from '~/common/functions/parameterNamesFn.ts';
import toFirstLetterToUppercaseFn from '~/common/functions/firstLetterUppercaseFn.ts';

import DecoratorException from '~/decorator/exceptions/DecoratorException.ts';
import DecoratorGroupEnum from '~/decorator/enums/DecoratorGroupEnum.ts';
import DecoratorKindEnum from '~/decorator/enums/DecoratorKindEnum.ts';
import Metadata from '~/decorator/services/Metadata.ts';
import decorateFn from '~/decorator/functions/decorateFn.ts';
import isClassDecoratorContextFn from '~/decorator/guards/isClassDecoratorContextFn.ts';
import isClassMemberDecoratorContextFn from '~/decorator/guards/isClassMemberDecoratorContextFn.ts';

import Entity from '~/entity/services/Entity.ts';

import Module from '~/module/decorations/Module.ts';
import Modulator from '~/module/services/Modulator.ts';

import Consumer from '~/provider/decorations/Consumer.ts';
import Provider from '~/provider/decorations/Provider.ts';
import Injector from '~/provider/services/Injector.ts';

import ArrayMap from '~/structure/services/ArrayMap.ts';

import ValidationEnum from '~/validator/enums/ValidationEnum.ts';
import isValidationFn from '~/validator/guards/isValidationFn.ts';
import validateObjectFn from '~/validator/functions/validateObjectFn.ts';
import validateValueFn from '~/validator/functions/validateValueFn.ts';

export * from '~/common/interfaces.ts';
export * from '~/common/types.ts';
export * from '~/decorator/interfaces.ts';
export * from '~/entity/interfaces.ts';
export * from '~/module/types.ts';
export * from '~/provider/types.ts';
export * from '~/structure/interfaces.ts';
export * from '~/validator/interfaces.ts';
export * from '~/validator/types.ts';

export default {
  ArrayMap,
  Entity,
  Exception,
  DecoratorException,
  enums: {
    DecoratorGroupEnum,
    DecoratorKindEnum,
    MetadataTagEnum,
    ValidationEnum,
  },
  decorators: {
    Debug,
    Singleton,
    Module,
    Consumer,
    Provider
  },
  functions: {
    decorateFn,
    constructFn,
    getObjectEntriesFn,
    getParameterNamesFn,
    toFirstLetterToUppercaseFn,
    validateObjectFn,
    validateValueFn,
  },
  guards: {
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
  },

  Injector,
  Modulator,
  Metadata,
}