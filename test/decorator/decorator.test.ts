import { describe, it } from "@std/bdd";
import { expect } from "@std/expect";

import { SingletonUserMock } from '../../test-mock/userMocks.ts';
import constructFn from '~/common/functions/constructFn.ts';

describe("Decorator", () => {
  
  const userSingletonMockFirst = constructFn(SingletonUserMock, { arguments: { firstName: "eduardo", lastName: "segura" } })
  const userSingletonMockSecond = constructFn(SingletonUserMock, { arguments: { firstName: "jaime", lastName: "castro" } })

  describe("Singleton", () => {
    it("has same instance", () => {
      expect(userSingletonMockFirst === userSingletonMockSecond).toBe(true);
    })

    it("has same values", () => {
      expect(userSingletonMockFirst.firstName === userSingletonMockSecond.firstName).toBe(true);
    })
  })

})