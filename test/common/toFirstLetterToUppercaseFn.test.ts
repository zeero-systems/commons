import '~/common/polyfills.ts';

import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';

import toFirstLetterUppercaseFn from '~/common/functions/toFirstLetterUppercaseFn.ts';

describe('Function toFirstLetterUpercaseFn', () => {
  it('From the callback function', () => {
    expect(toFirstLetterUppercaseFn('eduardo')).toEqual('Eduardo');
  });

  it('From the extended prototype', () => {
    expect('eduardo'.toFirstLetterUppercase()).toEqual('Eduardo');
  });
});
