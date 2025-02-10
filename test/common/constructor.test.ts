import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';
import { UserMock } from '../../test-mock/userMocks.ts';
import { UserEntityMock } from '-/test-mock/userEntityMocks.ts';

import constructFn from '~/common/functions/constructFn.ts';

describe('Function Constructor', () => {
	describe('Construct', () => {
		it('from simple class', () => {
			const userMock = constructFn(UserMock, { arguments: { firstName: 'eduardo', lastName: 'segura' } });

			expect(userMock.firstName).toBe('eduardo');
			expect(userMock.lastName).toBe('segura');
		});

		it('from a entity class', () => {
			const userEntityMock = constructFn(UserEntityMock, { arguments: { firstName: 'jaime', lastName: 'castro' } });

			expect(userEntityMock.firstName).toBe('jaime');
			expect(userEntityMock.lastName).toBe('castro');
		});
	});
});
