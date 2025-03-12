// deno-lint-ignore-file ban-types
import type { EntryType, MappedKeyType, OmitType } from '~/common/types.ts';
import { ValidationResultType } from '~/validator/types.ts';
import { MappedEntityPropertyType } from '~/entity/types.ts';
import ValidationEnum from '~/validator/enums/ValidationEnum.ts';

/**
 * Shared common methods
 * 
 * Adds to's representation about properties
 * Adds get's about the properties metadata
 * Integrates validations from decorators
 *
 * @interface AnnotationInterface
 *
 * @member {Function} toJson - Return properties as a json object
 * @member {Function} toPlain - Return properties as a plain string 
 * @member {Function} toEntries - Return properties as a set of entries
 * @member {Function} getPropertyKeys - Return a list of property keys
 * @member {Function} getPropertyType - Return a string type of a property
 * @member {Function} validateProperty - Return a validation result of a property
 * @member {Function} validateProperties - Return a list of validation results of all properties
 */
export interface EntityInterface {
  toJson(): MappedKeyType<OmitType<this, Function>>;
  toPlain(): string;
  toEntries(): ReadonlyArray<EntryType<OmitType<this, Function>>>;

  getPropertyKeys<K extends keyof OmitType<this, Function>>(): K[];
  getPropertyType<K extends keyof OmitType<this, Function>>(propertyKey: K): string;

  validateProperty<K extends keyof OmitType<this, Function>>(propertyKey: K): ValidationResultType[];
  validateProperties(onlyResultWithKeys?: Array<ValidationEnum>): Promise<MappedEntityPropertyType<this, ValidationResultType[]> | undefined>
}

export default {};