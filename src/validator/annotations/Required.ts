import Decorator from '~/decorator/services/Decorator.ts';
import Required from '~/validator/validations/Required.ts';

export default () => Decorator.apply(Required);
