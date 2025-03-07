import LessThan from '~/validator/validations/LessThan.ts';
import LessThanEqual from '~/validator/validations/LessThanEqual.ts';
import Regex from '~/validator/validations/Regex.ts';
import Required from '~/validator/validations/Required.ts';
import GreaterThan from '~/validator/validations/GreaterThan.ts';
import GreaterThanEqual from '~/validator/validations/GreaterThanEqual.ts';
import Equal from '~/validator/validations/Equal.ts';

export { LessThan } from '~/validator/validations/LessThan.ts';
export { LessThanEqual } from '~/validator/validations/LessThanEqual.ts';
export { Regex } from '~/validator/validations/Regex.ts';
export { Required } from '~/validator/validations/Required.ts';
export { GreaterThan } from '~/validator/validations/GreaterThan.ts';
export { GreaterThanEqual } from '~/validator/validations/GreaterThanEqual.ts';
export { Equal } from '~/validator/validations/Equal.ts';

export default {
  Equal,
  GreaterThan,
  GreaterThanEqual,
  LessThan,
  LessThanEqual,
  Regex,
  Required
}