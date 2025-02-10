import { describe, it } from "@std/bdd";
import { expect } from "@std/expect";

import { UserEntityMock } from '../../test-mock/userEntityMocks.ts';
import Required from '~/validator/validations/Required.ts';

import validateValueFn from '../../src/validator/functions/validateValueFn.ts';
import ValidationEnum from '~/validator/enums/ValidationEnum.ts';
import validateObjectFn from '~/validator/functions/validateObjectFn.ts';
import constructFn from '~/common/functions/constructFn.ts';
import { SingletonUserEntityMock } from '-/test-mock/userEntityMocks.ts';

describe("Validator", () => {

  describe("test validations", () => {
    it("on single property", () => {

      const userEntity = new UserEntityMock()

      const validations = [ { validation: new Required() } ]

      const result = validateValueFn(userEntity.firstName, validations)

      expect(result[0].key).toBe(ValidationEnum.INVALID);
    })

    it("on object properties", () => {

      const userEntity = new UserEntityMock()

      userEntity.firstName = "Eduardo"

      const validations = { 
        firstName: [ { validation: new Required() } ]
      }

      const result = validateObjectFn(userEntity, validations)

      expect(result).toEqual({
         birthDate: [{ key: ValidationEnum.UNDEFINED }],
         created: [{ key: ValidationEnum.UNDEFINED }],
         email: [{ key: ValidationEnum.UNDEFINED }],
         firstName: [{ key: ValidationEnum.UNGUARDED, name: "Required" } ],
         lastName: [{ key: ValidationEnum.UNDEFINED } ]
      });
    })

    it("on entity properties decorators", () => {

      const userEntity = constructFn(SingletonUserEntityMock, { 
        arguments: {
          firstName: "eduardo", 
          lastName: "segura", 
          email: [ { isMain: true, address: "eduardo@zxxxro.com" } ] 
        }
      })
      
      expect(userEntity.validateProperties()).toEqual({
        firstName: [],
        lastName: [],
        created: [],
        birthDate: [ { key: "INVALID", name: "Required" } ],
        email: []
      })
    })

  })

})