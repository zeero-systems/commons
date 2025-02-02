import { expect, test } from "bun:test";
import getFunctionParametersFn from "~/common/functions/getFunctionParametersFn";

test("Normal function parameters", () => {
  
  function normalFunction(text: string) {}

  expect(getFunctionParametersFn(normalFunction)).toEqual(['text']);

});

test("This function parameters", () => {
  
  function thisFunction(this: string) {}

  expect(getFunctionParametersFn(thisFunction)).toEqual([]);

});

test("Arrow function parameters", () => {
  
  const arrowFunction = (id: number) => {}

  expect(getFunctionParametersFn(arrowFunction)).toEqual(['id']);
  
});