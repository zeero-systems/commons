import { describe, it } from '@std/bdd';
import { expect } from '@std/expect';

import getParameterNamesFn from '~/common/functions/getParameterNamesFn.ts';

describe('Function getParameterNamesFn', () => {
  it('Normal function parameters', () => {
    function normalFunctionName(_text: string) {}

    expect(getParameterNamesFn(normalFunctionName)).toEqual(['_text']);
  });

  it('This function parameters', () => {
    function functionWithThis(this: string) {}

    expect(getParameterNamesFn(functionWithThis)).toEqual([]);
  });

  it('Arrow function parameters', () => {
    const arrowFunctionWithoutName = (_id: number) => {};

    expect(getParameterNamesFn(arrowFunctionWithoutName)).toEqual(['_id']);
  });
});
