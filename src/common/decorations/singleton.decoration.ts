import Decorator from '~/decorator/services/decorator.service.ts';
import SingletonAnnotation from '~/common/annotations/singleton.annotation.ts';

export const Singleton = Decorator.create(SingletonAnnotation)

export default Singleton