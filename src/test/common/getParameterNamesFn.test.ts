import { expect, test } from "bun:test";
import getParameterNamesFn from "~/common/functions/getParameterNamesFn";

test("Normal function parameters", () => {
  
  function normalFunction(text: string) {}

  expect(getParameterNamesFn(normalFunction)).toEqual(['text']);

});

test("This function parameters", () => {
  
  function thisFunction(this: string) {}

  expect(getParameterNamesFn(thisFunction)).toEqual([]);

});

test("Arrow function parameters", () => {
  
  const arrowFunction = (id: number) => {}

  expect(getParameterNamesFn(arrowFunction)).toEqual(['id']);
  
});