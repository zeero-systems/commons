import { expect, test } from "bun:test";

import "~/common/prototype";
import toFirstLetterUppercaseFn from "~/common/functions/toFirstLetterUppercaseFn";

test("From the callback function", () => {
  expect(toFirstLetterUppercaseFn('eduardo')).toEqual('Eduardo');
});

test("From the extended prototype", () => {
    expect('eduardo'.toFirstLetterUppercase()).toEqual('Eduardo');
});
