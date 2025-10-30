import { describe, it, beforeEach } from '@std/bdd';
import { expect } from '@std/expect';

import Entity from '~/entity/services/entity.service.ts';
import Factory from '~/common/services/factory.service.ts';
import Required from '~/validator/decorations/required.decoration.ts';
import Integer from '~/validator/decorations/integer.decoration.ts';
import ValidationEnum from '~/validator/enums/validation.enum.ts';

describe('entity', () => {
  class SubEntityExtended extends Entity {
    @Required()
    subField!: string;
  }

  class EntityExtended extends Entity {
    @Required()
    firstName!: string;
    lastName!: string;
    @Required()
    subField!: SubEntityExtended;
    created?: Date;
    @Required()
    birthDate?: Date;
    email!: Array<{ isMain: boolean; address: string }>;
  }

  let entityExtended: EntityExtended;

  beforeEach(() => {
    entityExtended = Factory.properties(EntityExtended, {
      firstName: 'eduardo',
      lastName: 'segura',
      email: [{ isMain: true, address: 'test@email.com' }],
      subField: Factory.properties(SubEntityExtended, {
        subField: 'value',
      }),
    });
  });

  it('toEntries method', () => {
    expect(entityExtended.toEntries()).toEqual([
      ['firstName', 'eduardo'],
      ['lastName', 'segura'],
      ['subField', { subField: 'value' }],
      ['created', undefined],
      ['birthDate', undefined],
      ['email', [{ 'isMain': true, 'address': 'test@email.com' }]],
    ]);
  });

  it('toJson method', () => {
    expect(entityExtended.toJson()).toEqual({
      firstName: 'eduardo',
      lastName: 'segura',
      created: undefined,
      birthDate: undefined,
      email: [{ 'isMain': true, 'address': 'test@email.com' }],
      subField: { subField: 'value' },
    });
  });

  it('toPlain method', () => {
    expect(entityExtended.toPlain()).toEqual(
      'firstName=eduardo\nlastName=segura\nsubField=[object Object]\ncreated=undefined\nbirthDate=undefined\nemail=[object Object]',
    );
  });

  it('getPropertyKeys method', () => {
    expect(entityExtended.getPropertyKeys()).toEqual(['firstName', 'lastName', 'subField', 'created', 'birthDate', 'email']);
  });

  it('getPropertyType method', () => {
    expect(entityExtended.getPropertyType('firstName')).toEqual('string');
    expect(entityExtended.getPropertyType('lastName')).toEqual('string');
    expect(entityExtended.getPropertyType('birthDate')).toEqual('undefined');
    expect(entityExtended.getPropertyType('subField')).toEqual('object');
  });

  it('validateProperties method', async () => {
    expect(await entityExtended.validateProperties()).toMatchObject({
      firstName: [{ key: 'VALID', name: 'Required' }],
      lastName: [{ key: 'UNDEFINED' }],
      created: [{ key: 'UNDEFINED' }],
      birthDate: [{ key: 'INVALID', name: 'Required' }],
      email: [{ key: 'UNDEFINED' }],
    });
  });

  it('validateProperties onlyWithInvalidResults method', async () => {
    expect(await entityExtended.validateProperties([ValidationEnum.INVALID])).toMatchObject({
      birthDate: [{ key: 'INVALID', name: 'Required' }],
    });
  });

  describe('nested entity validation', () => {
    class Address extends Entity {
      @Required()
      street!: string;

      @Required()
      city!: string;

      @Integer()
      zipCode?: number;
    }

    class User extends Entity {
      @Required()
      name!: string;

      @Integer()
      age!: number;

      address?: Address;
      previousAddresses?: Address[];
    }

    it('should validate nested entity', async () => {
      const user = Factory.properties(User, {
        name: 'John Doe',
        age: 30,
        address: Factory.properties(Address, {
          street: '123 Main St',
          city: 'NYC',
          zipCode: 10001,
        }),
      });

      const results = await user.validateProperties();
      
      expect(results).toBeDefined();
      expect(results?.name).toEqual([{ key: 'VALID', name: 'Required' }]);
      expect(results?.age).toEqual([{ key: 'VALID', name: 'Integer' }]);
      expect(results?.address).toBeDefined();
    });

    it('should validate nested entity with invalid data', async () => {
      const user = Factory.properties(User, {
        name: 'John Doe',
        age: 30,
        address: Factory.properties(Address, {
          street: '123 Main St',
          city: 'NYC',
        }),
      });

      const results = await user.validateProperties();
      
      expect(results).toBeDefined();
      expect(results?.address).toBeDefined();
      
      const addressValidation = results?.address as any;
      expect(addressValidation?.zipCode).toBeDefined();
    });

    it('should validate array of nested entities', async () => {
      const user = Factory.properties(User, {
        name: 'John Doe',
        age: 30,
        previousAddresses: [
          Factory.properties(Address, {
            street: '456 Old St',
            city: 'Boston',
            zipCode: 2101,
          }),
          Factory.properties(Address, {
            street: '789 Previous Ave',
            city: 'Chicago',
          }),
        ],
      });

      const results = await user.validateProperties();
      
      expect(results).toBeDefined();
      expect(results?.previousAddresses).toBeDefined();
      
      const arrayValidation = results?.previousAddresses as any;
      expect(Array.isArray(arrayValidation)).toBe(true);
      
      expect(arrayValidation[1]).toBeDefined();
      expect(arrayValidation[1]?.zipCode).toBeDefined();
    });

    it('should validate deeply nested entities', async () => {
      class Country extends Entity {
        @Required()
        name?: string;
      }

      class City extends Entity {
        @Required()
        name!: string;
        country?: Country;
      }

      class Person extends Entity {
        @Required()
        name!: string;
        city?: City;
      }

      const person = Factory.properties(Person, {
        name: 'Jane',
        city: Factory.properties(City, {
          name: 'Paris',
          country: Factory.properties(Country, {
          }),
        }),
      });

      const results = await person.validateProperties();
      
      expect(results).toBeDefined();
      expect(results?.city).toBeDefined();
      
      const cityValidation = results?.city as any;
      expect(cityValidation?.country).toBeDefined();
      
      const countryValidation = cityValidation?.country as any;
      expect(countryValidation?.name).toBeDefined();
    });
  });

  describe('validateProperty method', () => {
    it('should validate individual property', async () => {
      const results = await entityExtended.validateProperty('firstName');
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
      expect(results).toContainEqual({ key: 'VALID', name: 'Required' });
    });

    it('should validate nested entity property', async () => {
      const results = await entityExtended.validateProperty('subField');
      expect(results).toBeDefined();
      
      if (typeof results === 'object' && !Array.isArray(results)) {
        expect(results?.subField).toBeDefined();
      }
    });
  });

  describe('toEntries with nested objects', () => {
    it('should handle deeply nested objects', () => {
      class DeepEntity extends Entity {
        level1!: {
          level2: {
            level3: string;
          };
        };
      }

      const deep = Factory.properties(DeepEntity, {
        level1: {
          level2: {
            level3: 'deep value',
          },
        },
      });

      const entries = deep.toEntries();
      expect(entries).toBeDefined();
      expect(entries.length).toBeGreaterThan(0);
    });
  });

  describe('edge cases', () => {
    it('should handle entity with no validations', async () => {
      class SimpleEntity extends Entity {
        field!: string;
      }

      const simple = Factory.properties(SimpleEntity, {
        field: 'value',
      });

      const results = await simple.validateProperties();
      expect(results).toBeDefined();
      expect(results?.field).toEqual([{ key: 'UNDEFINED' }]);
    });

    it('should handle empty array of entities', async () => {
      class Container extends Entity {
        items?: SubEntityExtended[];
      }

      const container = Factory.properties(Container, {
        items: [],
      });

      const results = await container.validateProperties();
      expect(results).toBeDefined();
      expect(results?.items).toEqual([{ key: 'UNDEFINED' }]);
    });

    it('should handle null nested entity', async () => {
      const entity = Factory.properties(EntityExtended, {
        firstName: 'test',
        lastName: 'user',
        subField: null as any,
        email: [],
      });

      const results = await entity.validateProperties();
      expect(results).toBeDefined();
      expect(results?.subField).toBeDefined();
    });
  });
});
